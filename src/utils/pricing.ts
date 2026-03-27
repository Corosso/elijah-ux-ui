export interface PricingBreakdown {
  subtotal: number;
  returnLegCost: number;
  total: number;
}

export type ServiceMode = 'point-to-point' | 'hourly';

interface PointToPointInput {
  mode: 'point-to-point';
  distanceKm: number;
  vehicleId: number;
  returnTrip: boolean;
  pickupLat?: number;
  pickupLng?: number;
}

interface HourlyInput {
  mode: 'hourly';
  hours: number;
  vehicleId: number;
  pickupLat?: number;
  pickupLng?: number;
}

export type PricingInput = PointToPointInput | HourlyInput;

const KM_TO_MILES = 0.621371;

/* ── Point-to-point model (v4 — exact formula from Ridelux source) ───
 *  price = base + perMile × miles
 *
 *  Derived from 5 real API routes (103–451 mi) with $0.00 error on all.
 *  Formula is perfectly linear per vehicle class.
 *
 *  Vehicle IDs:
 *    2  Cadillac XTS          → Luxury Sedan
 *    4  Chevrolet Suburban    → SUV
 *    3  Cadillac Escalade     → Business SUV
 *    5  Tesla Model X         → Electric Class
 *    1  Mercedes S-Class      → First Class
 *    6  Mercedes Sprinter     → Sprinter Class
 *    7  Lincoln MKT Stretch   → Stretch Limo
 * ────────────────────────────────────────────────────────────────────── */

interface VehicleRate { base: number; perMile: number; }

/* ── Market-based pricing & vehicle availability ──────────────────────
 *  Reverse-engineered from Ridelux frontend JS + API.
 *  Each market has different per-mile rates AND available vehicles.
 *  Key differences: First Class is $4.20/mi in DC/LA vs $5.00/mi in NYC.
 *  Sprinter is $8.50/mi in LA/Miami vs $10.70/mi in NYC/DC.
 * ────────────────────────────────────────────────────────────────────── */

interface MarketBounds { north: number; south: number; east: number; west: number; }

interface PricingMarket {
  bounds: MarketBounds;
  rates: Record<number, VehicleRate>;
}

// Order matters: smaller/specific markets MUST come before larger ones (DC overlaps NYC)
const PRICING_MARKETS: PricingMarket[] = [
  { // Washington DC (151xxx) — 5 vehicles, FC at $4.20/mi, Sprinter at $10.70/mi
    bounds: { north: 39.5, south: 38.5, east: -76.5, west: -77.6 },
    rates: {
      2: { base:  81.00, perMile:  3.20 },  // Luxury Sedan
      4: { base: 101.50, perMile:  4.20 },  // SUV
      1: { base:  95.00, perMile:  4.20 },  // First Class
      3: { base: 108.00, perMile:  4.70 },  // Business SUV
      6: { base: 328.00, perMile: 10.70 },  // Sprinter Class
    },
  },
  { // South Florida (140xxx) — 5 vehicles, Sprinter at $8.50/mi
    bounds: { north: 26.961, south: 25.44, east: -79.9745, west: -80.5545 },
    rates: {
      2: { base:  93.36, perMile:  3.20 },  // Luxury Sedan
      4: { base: 112.88, perMile:  4.20 },  // SUV
      3: { base: 127.89, perMile:  4.70 },  // Business SUV
      5: { base: 147.89, perMile:  4.70 },  // Electric Class
      6: { base: 183.59, perMile:  8.50 },  // Sprinter Class
    },
  },
  { // Los Angeles (143xxx) — 6 vehicles, FC at $4.20/mi, Sprinter at $8.50/mi
    bounds: { north: 34.7, south: 33.4, east: -117, west: -119.9 },
    rates: {
      2: { base: 113.17, perMile:  3.20 },  // Luxury Sedan
      4: { base: 117.63, perMile:  4.20 },  // SUV
      1: { base: 154.63, perMile:  4.20 },  // First Class
      3: { base: 132.61, perMile:  4.70 },  // Business SUV
      5: { base: 137.61, perMile:  4.70 },  // Electric Class
      6: { base: 298.66, perMile:  8.50 },  // Sprinter Class
    },
  },
  { // NYC / Northeast (127xxx) — 7 vehicles, all classes, FC at $5.00/mi
    bounds: { north: 43.241, south: 38.7093, east: -70.7568, west: -77.5415 },
    rates: {
      2: { base:  93.30, perMile:  3.20 },  // Luxury Sedan
      4: { base: 112.80, perMile:  4.20 },  // SUV
      3: { base: 127.80, perMile:  4.70 },  // Business SUV
      5: { base: 147.80, perMile:  4.70 },  // Electric Class
      1: { base: 190.00, perMile:  5.00 },  // First Class
      6: { base: 246.80, perMile: 10.70 },  // Sprinter Class
      7: { base: 284.80, perMile:  7.70 },  // Stretch Limo
    },
  },
];

function detectMarket(lat?: number, lng?: number): PricingMarket {
  const fallback = PRICING_MARKETS[PRICING_MARKETS.length - 1]; // NYC
  if (lat == null || lng == null) return fallback;

  // 1. Check if pickup falls within a market's bounds
  for (const market of PRICING_MARKETS) {
    const { north, south, east, west } = market.bounds;
    if (lat <= north && lat >= south && lng <= east && lng >= west) {
      return market;
    }
  }

  // 2. No exact match — use closest market center
  let closest = PRICING_MARKETS[0];
  let bestDist = Infinity;
  for (const market of PRICING_MARKETS) {
    const { north, south, east, west } = market.bounds;
    const centerLat = (north + south) / 2;
    const centerLng = (east + west) / 2;
    const dist = Math.sqrt((lat - centerLat) ** 2 + (lng - centerLng) ** 2);
    if (dist < bestDist) {
      bestDist = dist;
      closest = market;
    }
  }
  return closest;
}

export function getAvailableVehicles(lat?: number, lng?: number): number[] {
  const market = detectMarket(lat, lng);
  return Object.keys(market.rates).map(Number);
}

/* ── Hourly model (v3 — 4-tier market-aware, Ridelux frontend scrape) ──
 *  price = hourlyRate[market][vehicleId] × hours
 *
 *  Scraped from ridelux.com frontend (Jun 2026) for 6 cities × 3 durations.
 *  Pricing is strictly linear (rate × hours, no fixed fee). Confirmed with
 *  3h, 6h, 9h windows — all produce identical per-hour rates.
 *
 *  4 distinct tiers identified:
 *    NORTHEAST  → NYC, Philadelphia, Boston           (Sedan $95/hr)
 *    WEST_COAST → Los Angeles                         (Sedan $110/hr)
 *    SOUTHEAST  → Miami                               (Sedan $100/hr)
 *    CAPITAL    → Washington DC                       (Sedan $100/hr)
 * ────────────────────────────────────────────────────────────────── */

export const HOURLY_MIN = 3;
export const HOURLY_MAX = 12;

type HourlyTier = Record<number, number>;

// NYC / Philadelphia / Boston
const TIER_NORTHEAST: HourlyTier = {
  2: 95, 4: 120, 5: 130, 3: 140, 1: 190, 6: 220, 7: 230,
};

// Los Angeles
const TIER_WEST_COAST: HourlyTier = {
  2: 110, 5: 120, 4: 140, 3: 150, 1: 160, 6: 200,
};

// Miami (no Stretch Limo / First Class on Ridelux for this market)
const TIER_SOUTHEAST: HourlyTier = {
  2: 100, 4: 120, 5: 120, 3: 140, 1: 160, 6: 230,
};

// Washington DC (no Electric / Stretch Limo on Ridelux for this market)
const TIER_CAPITAL: HourlyTier = {
  2: 100, 4: 120, 5: 120, 3: 140, 1: 200, 6: 280,
};

interface HourlyMarket {
  lat: number;
  lng: number;
  tier: HourlyTier;
}

const HOURLY_MARKETS: HourlyMarket[] = [
  { lat: 40.7128,  lng: -74.0060,  tier: TIER_NORTHEAST  },  // NYC
  { lat: 39.9526,  lng: -75.1652,  tier: TIER_NORTHEAST  },  // Philadelphia
  { lat: 42.3601,  lng: -71.0589,  tier: TIER_NORTHEAST  },  // Boston
  { lat: 34.0522,  lng: -118.2437, tier: TIER_WEST_COAST },  // Los Angeles
  { lat: 25.7617,  lng: -80.1918,  tier: TIER_SOUTHEAST  },  // Miami
  { lat: 38.9072,  lng: -77.0369,  tier: TIER_CAPITAL    },  // Washington DC
];

const HOURLY_MARKET_RADIUS_MI = 60;

function getHourlyTier(lat?: number, lng?: number): HourlyTier {
  if (lat == null || lng == null) return TIER_SOUTHEAST;

  let best: HourlyTier = TIER_SOUTHEAST;
  let bestDist = Infinity;

  for (const m of HOURLY_MARKETS) {
    const d = haversineMi(lat, lng, m.lat, m.lng);
    if (d < bestDist) {
      bestDist = d;
      best = m.tier;
    }
  }

  return bestDist <= HOURLY_MARKET_RADIUS_MI ? best : TIER_SOUTHEAST;
}

// ── Helpers ──────────────────────────────────────────────────────

function haversineMi(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = Math.PI / 180;
  const dLat = (lat2 - lat1) * toRad;
  const dLng = (lng2 - lng1) * toRad;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.sin(dLng / 2) ** 2;
  return 3959 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Public API ───────────────────────────────────────────────────

export function calculatePrice(input: PricingInput): PricingBreakdown {
  if (input.mode === 'hourly') {
    const tier = getHourlyTier(input.pickupLat, input.pickupLng);
    const rate = tier[input.vehicleId] ?? tier[2];
    const hours = Math.max(input.hours, HOURLY_MIN);
    const subtotal = rate * hours;
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      returnLegCost: 0,
      total: Math.round(subtotal * 100) / 100,
    };
  }

  const miles = Math.max(input.distanceKm * KM_TO_MILES, 1);
  const market = detectMarket(input.pickupLat, input.pickupLng);
  const rate = market.rates[input.vehicleId] ?? market.rates[2];
  const subtotal = rate.base + rate.perMile * miles;
  const returnLegCost = input.returnTrip ? subtotal * 0.90 : 0;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    returnLegCost: Math.round(returnLegCost * 100) / 100,
    total: Math.round((subtotal + returnLegCost) * 100) / 100,
  };
}
