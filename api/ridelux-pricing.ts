import type { VercelRequest, VercelResponse } from '@vercel/node';

/* ── Market-aware vehicle type IDs (reverse-engineered from Ridelux frontend) ── */

interface MarketConfig {
  bounds: { north: number; south: number; east: number; west: number };
  vehicleTypes: number[];
}

// Order matters: smaller/specific markets MUST come before larger ones (DC is inside NYC bounds)
const MARKETS: MarketConfig[] = [
  { // Washington DC — check first (overlaps with NYC bounds)
    bounds: { north: 39.5, south: 38.5, east: -76.5, west: -77.6 },
    vehicleTypes: [151765, 151766, 151768, 151764, 151767], // 5: no Electric, no Limo
  },
  { // South Florida (Miami, Fort Lauderdale, West Palm Beach)
    bounds: { north: 26.961, south: 25.44, east: -79.9745, west: -80.5545 },
    vehicleTypes: [140371, 140375, 140372, 140374, 140376], // 5: no FC, no Limo
  },
  { // Los Angeles
    bounds: { north: 34.7, south: 33.4, east: -117, west: -119.9 },
    vehicleTypes: [143406, 143407, 143405, 143410, 143404, 143408], // 6: no Limo
  },
  { // NYC / Northeast (largest — must be last)
    bounds: { north: 43.241, south: 38.7093, east: -70.7568, west: -77.5415 },
    vehicleTypes: [127324, 127654, 127655, 127656, 127658, 127659, 127660], // 7: all
  },
];

function detectMarketTypes(lat: number, lng: number): number[] {
  // 1. Check if pickup falls within a market's bounds
  for (const market of MARKETS) {
    const { north, south, east, west } = market.bounds;
    if (lat <= north && lat >= south && lng <= east && lng >= west) {
      return market.vehicleTypes;
    }
  }

  // 2. No exact match — use closest market (same logic as Ridelux frontend)
  let closest = MARKETS[0];
  let bestDist = Infinity;
  for (const market of MARKETS) {
    const { north, south, east, west } = market.bounds;
    const centerLat = (north + south) / 2;
    const centerLng = (east + west) / 2;
    const dist = Math.sqrt((lat - centerLat) ** 2 + (lng - centerLng) ** 2);
    if (dist < bestDist) {
      bestDist = dist;
      closest = market;
    }
  }
  return closest.vehicleTypes;
}

/* ── Map Ridelux vehicle class name → Elijah vehicle ID ───────── */
const CLASS_TO_ELIJAH: Record<string, number> = {
  'First Class': 1,
  'Luxury Sedan': 2,
  'Business SUV': 3,
  'SUV': 4,
  'Electric Class': 5,
  'Sprinter Class': 6,
  'Stretch Limo': 7,
};

const SERVICE_TYPE_ID = 213459;

/* ── Token cache ──────────────────────────────────────────────── */
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

function extractCookies(res: Response): string[] {
  return (res.headers as any).getSetCookie?.() ?? [];
}

function cookieString(rawCookies: string[]): string {
  return rawCookies.map(c => c.split(';')[0]).join('; ');
}

async function getRideluxToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;

  // Step 1: Get CSRF token
  const csrfRes = await fetch('https://ridelux.com/api/auth/csrf', {
    headers: { 'user-agent': 'Mozilla/5.0' },
  });
  const { csrfToken } = await csrfRes.json();
  const csrfCookies = extractCookies(csrfRes);

  // Step 2: Create anonymous session via appCredentials
  const callbackRes = await fetch(
    'https://ridelux.com/api/auth/callback/appCredentials',
    {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'user-agent': 'Mozilla/5.0',
        'origin': 'https://ridelux.com',
        cookie: cookieString(csrfCookies),
      },
      body: `csrfToken=${encodeURIComponent(csrfToken)}&json=true`,
      redirect: 'manual',
    },
  );

  // Collect all cookies including session token
  const allCookies = [...csrfCookies, ...extractCookies(callbackRes)];

  // Step 3: Get accessToken from session
  const sessionRes = await fetch('https://ridelux.com/api/auth/session', {
    headers: { 'user-agent': 'Mozilla/5.0', cookie: cookieString(allCookies) },
  });
  const session = await sessionRes.json();

  if (!session.accessToken) {
    throw new Error('Failed to obtain Ridelux access token');
  }

  cachedToken = session.accessToken;
  // Refresh token every 24h (sessions last ~30 days)
  tokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
  return cachedToken!;
}

/* ── Price cache (route key → results, 24h TTL) ──────────────── */
interface CacheEntry {
  data: RideluxResult[];
  expiresAt: number;
}

interface RideluxResult {
  vehicle_type_id: number;
  vehicle_type_name: string;
  total_amount: number;
  applied_distance: number;
}

const priceCache = new Map<string, CacheEntry>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function cacheKey(
  pickupLat: number, pickupLng: number,
  dropoffLat: number, dropoffLng: number,
): string {
  // Round to 3 decimals (~111m precision) to increase cache hits
  const round = (n: number) => Math.round(n * 1000) / 1000;
  return `${round(pickupLat)},${round(pickupLng)}-${round(dropoffLat)},${round(dropoffLng)}`;
}

/* ── Main handler ─────────────────────────────────────────────── */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { pickupLat, pickupLng, dropoffLat, dropoffLng, pickupAddress, dropoffAddress } = req.body || {};

  if (!pickupLat || !pickupLng || !dropoffLat || !dropoffLng) {
    return res.status(400).json({ error: 'Missing pickup/dropoff coordinates' });
  }

  // Check cache
  const key = cacheKey(pickupLat, pickupLng, dropoffLat, dropoffLng);
  const cached = priceCache.get(key);
  if (cached && Date.now() < cached.expiresAt) {
    return res.status(200).json({ source: 'cache', results: formatResults(cached.data) });
  }

  try {
    const token = await getRideluxToken();

    // Tomorrow at 10am as scheduled pickup (neutral time)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    const scheduledPickup = tomorrow.toISOString().slice(0, 19);

    const rideluxRes = await fetch(
      'https://api.mylimobiz.com/v0/companies/ridelux/rate_lookup',
      {
        method: 'POST',
        headers: {
          'authorization': `bearer ${token}`,
          'content-type': 'application/json',
          'origin': 'https://ridelux.com',
          'referer': 'https://ridelux.com/',
        },
        body: JSON.stringify({
          service_type_id: SERVICE_TYPE_ID,
          vehicle_types: detectMarketTypes(pickupLat, pickupLng),
          promotion_code: '',
          scheduled_pickup_at: scheduledPickup,
          pickup: {
            type: 'address',
            address: {
              name: pickupAddress || 'Pickup',
              country_code: 'US',
              latitude: pickupLat,
              longitude: pickupLng,
            },
            flight: {},
          },
          dropoff: {
            type: 'address',
            address: {
              name: dropoffAddress || 'Dropoff',
              country_code: 'US',
              latitude: dropoffLat,
              longitude: dropoffLng,
            },
          },
        }),
      },
    );

    if (!rideluxRes.ok) {
      // Token might be expired — clear it and let next request retry
      cachedToken = null;
      tokenExpiresAt = 0;
      const errText = await rideluxRes.text();
      console.error('Ridelux API error:', rideluxRes.status, errText);
      return res.status(502).json({ error: 'Upstream pricing unavailable' });
    }

    const data = await rideluxRes.json();
    const results: RideluxResult[] = (data.results || []).map((r: any) => ({
      vehicle_type_id: r.vehicle_type_id,
      vehicle_type_name: r.vehicle_type_name,
      total_amount: r.total_amount,
      applied_distance: r.applied_distance,
    }));

    // Store in cache
    priceCache.set(key, { data: results, expiresAt: Date.now() + CACHE_TTL });

    // Evict old entries (keep max 500)
    if (priceCache.size > 500) {
      const oldest = priceCache.keys().next().value;
      if (oldest) priceCache.delete(oldest);
    }

    return res.status(200).json({ source: 'live', results: formatResults(results) });
  } catch (err) {
    console.error('Ridelux pricing error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function formatResults(results: RideluxResult[]) {
  return results
    .filter((r) => CLASS_TO_ELIJAH[r.vehicle_type_name] != null)
    .map((r) => ({
      vehicleId: CLASS_TO_ELIJAH[r.vehicle_type_name],
      vehicleName: r.vehicle_type_name,
      totalAmount: r.total_amount,
      distanceMiles: r.applied_distance,
    }));
}
