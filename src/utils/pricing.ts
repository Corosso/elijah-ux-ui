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

/* ── Point-to-point model (v2 — recalibrated from live API) ──────
 *  price = cityBase + BASE_MILE_RATE * miles
 *        + classFixed + classPerMile * miles
 *
 *  Coefficients fitted via regression on 10 live API routes (Jun 2026).
 *  Baseline class = Luxury Sedan (Cadillac XTS, vehicle id 2).
 *  cityBase absorbs the airport surcharge for that market.
 * ────────────────────────────────────────────────────────────────── */

const BASE_MILE_RATE = 2.70;

interface Market {
  base: number;
  lat: number;
  lng: number;
}

const MARKETS: Market[] = [
  { base: 128.80, lat: 40.6413,  lng: -73.7781  }, // NYC  (JFK)
  { base: 129.10, lat: 33.9416,  lng: -118.4085 }, // LA   (LAX)
  { base: 127.75, lat: 37.6213,  lng: -122.3790 }, // SF   (SFO)
  { base: 129.18, lat: 25.7959,  lng: -80.2870  }, // Miami(MIA)
  { base: 128.69, lat: 41.9742,  lng: -87.9073  }, // ORD
  { base: 134.59, lat: 39.8561,  lng: -104.6737 }, // DEN
  { base: 128.64, lat: 47.4502,  lng: -122.3088 }, // SEA
  { base: 128.40, lat: 33.6407,  lng: -84.4277  }, // ATL
  { base: 126.60, lat: 36.0840,  lng: -115.1537 }, // LAS
  { base: 127.69, lat: 32.8998,  lng: -97.0403  }, // DFW
];

const DEFAULT_BASE = 129;
const MARKET_RADIUS_MI = 60;

// Vehicle ID → class (confirmed via Ridelux API):
//   2  Cadillac XTS          → Luxury Sedan   (BASELINE — cheapest)
//   4  Chevrolet Suburban    → SUV
//   3  Cadillac Escalade     → Business SUV
//   5  Tesla Model X         → Electric Class
//   1  Mercedes S-Class      → First Class
//   6  Mercedes Sprinter     → Sprinter Class

interface ClassUplift {
  fixed: number;
  perMile: number;
}

const VEHICLE_UPLIFTS: Record<number, ClassUplift> = {
  2: { fixed: 0,     perMile: 0     },  // Luxury Sedan (baseline)
  4: { fixed: 1,     perMile: 1.11  },  // SUV
  3: { fixed: 16,    perMile: 1.61  },  // Business SUV
  5: { fixed: 21,    perMile: 1.61  },  // Electric Class
  1: { fixed: 30,    perMile: 1.41  },  // First Class
  6: { fixed: 178,   perMile: 5.51  },  // Sprinter Class
};

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
 *
 *  Vehicle availability varies: some classes missing in certain markets.
 *  Missing classes fall back to the nearest available tier.
 * ────────────────────────────────────────────────────────────────── */

export const HOURLY_MIN = 3;
export const HOURLY_MAX = 12;

// Vehicle IDs: 2=Luxury Sedan, 4=SUV, 5=Electric, 3=Business SUV,
//              1=First Class, 6=Sprinter

type HourlyTier = Record<number, number>;

// NYC / Philadelphia / Boston
const TIER_NORTHEAST: HourlyTier = {
  2: 95, 4: 120, 5: 130, 3: 140, 1: 190, 6: 220,
};

// Los Angeles
const TIER_WEST_COAST: HourlyTier = {
  2: 110, 5: 120, 4: 140, 3: 150, 1: 160, 6: 200,
};

// Miami (no First Class available on Ridelux — use Business SUV + uplift)
const TIER_SOUTHEAST: HourlyTier = {
  2: 100, 4: 120, 5: 120, 3: 140, 1: 160, 6: 230,
};

// Washington DC (no Electric available on Ridelux — use SUV rate)
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
  // Unmapped cities fall back to TIER_SOUTHEAST (most conservative)
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

function detectBase(lat?: number, lng?: number): number {
  if (lat == null || lng == null) return DEFAULT_BASE;

  let best = DEFAULT_BASE;
  let bestDist = Infinity;

  for (const m of MARKETS) {
    const d = haversineMi(lat, lng, m.lat, m.lng);
    if (d < bestDist) {
      bestDist = d;
      best = m.base;
    }
  }

  return bestDist <= MARKET_RADIUS_MI ? best : DEFAULT_BASE;
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
  const base = detectBase(input.pickupLat, input.pickupLng);
  const uplift = VEHICLE_UPLIFTS[input.vehicleId] ?? VEHICLE_UPLIFTS[2];

  const subtotal = base + BASE_MILE_RATE * miles + uplift.fixed + uplift.perMile * miles;
  const returnLegCost = input.returnTrip ? subtotal * 0.90 : 0;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    returnLegCost: Math.round(returnLegCost * 100) / 100,
    total: Math.round((subtotal + returnLegCost) * 100) / 100,
  };
}
