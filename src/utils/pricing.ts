export interface PricingBreakdown {
  subtotal: number;
  returnLegCost: number;
  total: number;
}

interface PricingInput {
  distanceKm: number;
  vehicleId: number;
  returnTrip: boolean;
  pickupLat?: number;
  pickupLng?: number;
}

const KM_TO_MILES = 0.621371;

/* ── Ridelux-style linear model (v2 — recalibrated from live API) ──
 *  price = cityBase + BASE_MILE_RATE * miles
 *        + classFixed + classPerMile * miles
 *
 *  Coefficients fitted via regression on 10 live API routes (Jun 2026).
 *  Baseline class = Luxury Sedan (Cadillac XTS, vehicle id 2).
 *  cityBase absorbs the airport surcharge for that market.
 * ────────────────────────────────────────────────────────────────── */

const BASE_MILE_RATE = 2.70; // USD per mile — Luxury Sedan baseline

// ── Market bases (Luxury Sedan, derived from live API prices) ────
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

const DEFAULT_BASE = 129; // Fallback — most markets cluster around $128-129
const MARKET_RADIUS_MI = 60;

// ── Class uplifts over Luxury Sedan (regression-fitted) ─────────
//
// Vehicle ID → class (confirmed via Ridelux API):
//   2  Cadillac XTS          → Luxury Sedan   (BASELINE — cheapest)
//   4  Chevrolet Suburban    → SUV
//   3  Cadillac Escalade     → Business SUV
//   5  Tesla Model X         → Electric Class  (= Business SUV + $5 fixed)
//   1  Mercedes S-Class      → First Class
//   6  Mercedes Sprinter     → Sprinter Class

interface ClassUplift {
  fixed: number;
  perMile: number;
}

const VEHICLE_UPLIFTS: Record<number, ClassUplift> = {
  2: { fixed: 0,     perMile: 0     },  // Luxury Sedan (baseline)
  4: { fixed: 1,     perMile: 1.11  },  // SUV              — MAE ~$0.80
  3: { fixed: 16,    perMile: 1.61  },  // Business SUV     — MAE ~$0.80
  5: { fixed: 21,    perMile: 1.61  },  // Electric Class   — MAE ~$0.80
  1: { fixed: 30,    perMile: 1.41  },  // First Class      — MAE ~$3.54
  6: { fixed: 178,   perMile: 5.51  },  // Sprinter Class   — MAE ~$1.33
};

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

export function calculatePrice({
  distanceKm,
  vehicleId,
  returnTrip,
  pickupLat,
  pickupLng,
}: PricingInput): PricingBreakdown {
  const miles = Math.max(distanceKm * KM_TO_MILES, 1);
  const base = detectBase(pickupLat, pickupLng);
  const uplift = VEHICLE_UPLIFTS[vehicleId] ?? VEHICLE_UPLIFTS[2];

  const subtotal = base + BASE_MILE_RATE * miles + uplift.fixed + uplift.perMile * miles;
  const returnLegCost = returnTrip ? subtotal * 0.90 : 0;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    returnLegCost: Math.round(returnLegCost * 100) / 100,
    total: Math.round((subtotal + returnLegCost) * 100) / 100,
  };
}
