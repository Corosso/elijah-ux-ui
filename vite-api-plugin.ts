/**
 * Vite plugin that handles /api/* routes locally for development.
 * Uses Google Places API (New) and Directions API.
 */
import type { Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import { resolve } from 'path';
import { config } from 'dotenv';

config({ path: resolve(process.cwd(), '.env') });

function getGoogleKey(): string {
  return process.env.GOOGLE_MAPS_API_KEY || '';
}

/** Decode a Google encoded polyline string into [lng, lat] pairs */
function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte: number;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    shift = 0;
    result = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    points.push([lng / 1e5, lat / 1e5]);
  }
  return points;
}

/** Send a JSON response */
function sendJson(res: ServerResponse, status: number, data: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

async function handlePlacesAutocomplete(query: Record<string, string>, res: ServerResponse) {
  const GOOGLE_KEY = getGoogleKey();
  const { input, lat, lng } = query;

  if (!input || input.length < 3) {
    return sendJson(res, 200, { suggestions: [] });
  }

  try {
    // 1. Places Autocomplete (New API)
    const body: Record<string, unknown> = {
      input,
      includedRegionCodes: ['co', 'us'],
      languageCode: 'en',
    };

    if (lat && lng) {
      body.locationBias = {
        circle: {
          center: { latitude: parseFloat(lat), longitude: parseFloat(lng) },
          radius: 50000.0,
        },
      };
    }

    const acRes = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_KEY,
      },
      body: JSON.stringify(body),
    });
    const acData = await acRes.json();

    const predictions = acData.suggestions?.filter((s: any) => s.placePrediction) ?? [];

    if (predictions.length === 0) {
      return sendJson(res, 200, { suggestions: [], _debug: { raw: acData } });
    }

    // 2. Resolve placeId → lat/lng via Place Details (New API)
    const suggestions = await Promise.all(
      predictions.slice(0, 5).map(async (s: any) => {
        const pred = s.placePrediction;
        try {
          const detailRes = await fetch(
            `https://places.googleapis.com/v1/places/${pred.placeId}`,
            {
              headers: {
                'X-Goog-Api-Key': GOOGLE_KEY,
                'X-Goog-FieldMask': 'location',
              },
            }
          );
          const detailData = await detailRes.json();
          if (detailData.location) {
            return {
              label: pred.text?.text || pred.structuredFormat?.mainText?.text || '',
              lat: detailData.location.latitude,
              lng: detailData.location.longitude,
            };
          }
        } catch {
          // skip failed detail lookups
        }
        return null;
      })
    );

    sendJson(res, 200, { suggestions: suggestions.filter(Boolean) });
  } catch (err: any) {
    console.error('[api] places-autocomplete error:', err);
    sendJson(res, 500, { error: err.message });
  }
}

async function handleDirections(query: Record<string, string>, res: ServerResponse) {
  const GOOGLE_KEY = getGoogleKey();
  const { originLat, originLng, destLat, destLng } = query;

  if (!originLat || !originLng || !destLat || !destLng) {
    return sendJson(res, 400, { error: 'Missing origin/destination coordinates' });
  }

  try {
    const routeRes = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_KEY,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
      },
      body: JSON.stringify({
        origin: { location: { latLng: { latitude: parseFloat(originLat), longitude: parseFloat(originLng) } } },
        destination: { location: { latLng: { latitude: parseFloat(destLat), longitude: parseFloat(destLng) } } },
        travelMode: 'DRIVE',
        routingPreference: 'TRAFFIC_AWARE',
        units: 'METRIC',
      }),
    });
    const routeData = await routeRes.json();

    if (!routeData.routes?.length) {
      return sendJson(res, 200, { error: `Routes API: no routes found`, _debug: routeData });
    }

    const route = routeData.routes[0];
    const coordinates = decodePolyline(route.polyline.encodedPolyline);
    const durationSeconds = parseInt(route.duration.replace('s', ''), 10);
    const distanceMeters = route.distanceMeters;

    let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
    for (const [ln, lt] of coordinates) {
      if (ln < minLng) minLng = ln;
      if (lt < minLat) minLat = lt;
      if (ln > maxLng) maxLng = ln;
      if (lt > maxLat) maxLat = lt;
    }

    sendJson(res, 200, {
      coordinates,
      bbox: [minLng, minLat, maxLng, maxLat],
      duration: durationSeconds,
      distance: distanceMeters,
    });
  } catch (err: any) {
    console.error('[api] directions error:', err);
    sendJson(res, 500, { error: err.message });
  }
}

/* ── Ridelux pricing proxy (dev mode) ─────────────────────────── */
interface MarketConfig {
  bounds: { north: number; south: number; east: number; west: number };
  vehicleTypes: number[];
}

// Order matters: smaller/specific markets MUST come before larger ones (DC is inside NYC bounds)
const RIDELUX_MARKETS: MarketConfig[] = [
  { bounds: { north: 39.5, south: 38.5, east: -76.5, west: -77.6 },         // Washington DC
    vehicleTypes: [151765, 151766, 151768, 151764, 151767] },
  { bounds: { north: 26.961, south: 25.44, east: -79.9745, west: -80.5545 }, // South Florida
    vehicleTypes: [140371, 140375, 140372, 140374, 140376] },
  { bounds: { north: 34.7, south: 33.4, east: -117, west: -119.9 },          // Los Angeles
    vehicleTypes: [143406, 143407, 143405, 143410, 143404, 143408] },
  { bounds: { north: 43.241, south: 38.7093, east: -70.7568, west: -77.5415 }, // NYC (largest, last)
    vehicleTypes: [127324, 127654, 127655, 127656, 127658, 127659, 127660] },
];

function detectMarketTypes(lat: number, lng: number): number[] {
  // 1. Check if pickup falls within a market's bounds
  for (const market of RIDELUX_MARKETS) {
    const { north, south, east, west } = market.bounds;
    if (lat <= north && lat >= south && lng <= east && lng >= west) {
      return market.vehicleTypes;
    }
  }

  // 2. No exact match — use closest market (same logic as Ridelux frontend)
  let closest = RIDELUX_MARKETS[0];
  let bestDist = Infinity;
  for (const market of RIDELUX_MARKETS) {
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

const CLASS_TO_ELIJAH: Record<string, number> = {
  'First Class': 1, 'Luxury Sedan': 2, 'Business SUV': 3,
  'SUV': 4, 'Electric Class': 5, 'Sprinter Class': 6, 'Stretch Limo': 7,
};
const SERVICE_TYPE_ID = 213459;

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

  const csrfRes = await fetch('https://ridelux.com/api/auth/csrf', {
    headers: { 'user-agent': 'Mozilla/5.0' },
  });
  const { csrfToken } = await csrfRes.json();
  const csrfCookies = extractCookies(csrfRes);

  const callbackRes = await fetch('https://ridelux.com/api/auth/callback/appCredentials', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent': 'Mozilla/5.0',
      'origin': 'https://ridelux.com',
      cookie: cookieString(csrfCookies),
    },
    body: `csrfToken=${encodeURIComponent(csrfToken)}&json=true`,
    redirect: 'manual',
  });

  const allCookies = [...csrfCookies, ...extractCookies(callbackRes)];

  const sessionRes = await fetch('https://ridelux.com/api/auth/session', {
    headers: { 'user-agent': 'Mozilla/5.0', cookie: cookieString(allCookies) },
  });
  const session = await sessionRes.json();
  if (!session.accessToken) throw new Error('Failed to obtain Ridelux token');

  cachedToken = session.accessToken;
  tokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
  return cachedToken!;
}

interface PriceCache { data: any[]; expiresAt: number; }
const priceCache = new Map<string, PriceCache>();

function priceCacheKey(pLat: number, pLng: number, dLat: number, dLng: number) {
  const r = (n: number) => Math.round(n * 1000) / 1000;
  return `${r(pLat)},${r(pLng)}-${r(dLat)},${r(dLng)}`;
}

async function handleRideluxPricing(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });

  const body = await new Promise<any>((resolve) => {
    let data = '';
    req.on('data', (chunk: string) => { data += chunk; });
    req.on('end', () => { try { resolve(JSON.parse(data)); } catch { resolve({}); } });
  });

  const { pickupLat, pickupLng, dropoffLat, dropoffLng, pickupAddress, dropoffAddress } = body;
  if (!pickupLat || !pickupLng || !dropoffLat || !dropoffLng) {
    return sendJson(res, 400, { error: 'Missing coordinates' });
  }

  const key = priceCacheKey(pickupLat, pickupLng, dropoffLat, dropoffLng);
  const cached = priceCache.get(key);
  if (cached && Date.now() < cached.expiresAt) {
    return sendJson(res, 200, { source: 'cache', results: cached.data });
  }

  try {
    const token = await getRideluxToken();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const apiRes = await fetch('https://api.mylimobiz.com/v0/companies/ridelux/rate_lookup', {
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
        scheduled_pickup_at: tomorrow.toISOString().slice(0, 19),
        pickup: {
          type: 'address',
          address: { name: pickupAddress || 'Pickup', country_code: 'US', latitude: pickupLat, longitude: pickupLng },
          flight: {},
        },
        dropoff: {
          type: 'address',
          address: { name: dropoffAddress || 'Dropoff', country_code: 'US', latitude: dropoffLat, longitude: dropoffLng },
        },
      }),
    });

    if (!apiRes.ok) {
      cachedToken = null;
      tokenExpiresAt = 0;
      return sendJson(res, 502, { error: 'Upstream pricing unavailable' });
    }

    const data = await apiRes.json();
    const results = (data.results || [])
      .filter((r: any) => CLASS_TO_ELIJAH[r.vehicle_type_name] != null)
      .map((r: any) => ({
        vehicleId: CLASS_TO_ELIJAH[r.vehicle_type_name],
        vehicleName: r.vehicle_type_name,
        totalAmount: r.total_amount,
        distanceMiles: r.applied_distance,
      }));

    priceCache.set(key, { data: results, expiresAt: Date.now() + 24 * 60 * 60 * 1000 });
    if (priceCache.size > 500) {
      const oldest = priceCache.keys().next().value;
      if (oldest) priceCache.delete(oldest);
    }

    sendJson(res, 200, { source: 'live', results });
  } catch (err: any) {
    console.error('[api] ridelux-pricing error:', err);
    sendJson(res, 500, { error: err.message });
  }
}

export function vercelApiPlugin(): Plugin {
  return {
    name: 'vercel-api-dev',
    configureServer(server) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: Function) => {
        if (!req.url?.startsWith('/api/')) return next();

        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const pathname = parsedUrl.pathname;
        const query: Record<string, string> = {};
        parsedUrl.searchParams.forEach((value, key) => {
          query[key] = value;
        });

        if (pathname === '/api/places-autocomplete') {
          await handlePlacesAutocomplete(query, res);
        } else if (pathname === '/api/directions') {
          await handleDirections(query, res);
        } else if (pathname === '/api/ridelux-pricing') {
          await handleRideluxPricing(req, res);
        } else {
          sendJson(res, 404, { error: 'API route not found' });
        }
      });
    },
  };
}
