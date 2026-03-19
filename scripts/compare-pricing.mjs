/**
 * Compare Elijah pricing model vs Ridelux API for multiple routes.
 * Run: node scripts/compare-pricing.mjs
 */

const API_URL = 'https://api.mylimobiz.com/v0/companies/ridelux/rate_lookup';
const AUTH = 'bearer 2EdAuKEWJRG2I4A5VsbQlgVP7yrVQ1sdmLmCW7VZjEztVyIqIn';

// Ridelux vehicle_type_id → name
const RIDELUX_VEHICLES = {
  143407: 'Luxury Sedan',
  143410: 'SUV',
  143404: 'Business SUV',
  143405: 'Electric Class',
  143406: 'First Class',
  143408: 'Sprinter Class',
};

// Ridelux vehicle_type_id → Elijah vehicle id
const RIDELUX_TO_ELIJAH = {
  143407: 2, // Luxury Sedan → Cadillac XTS
  143410: 4, // SUV → Chevrolet Suburban
  143404: 3, // Business SUV → Cadillac Escalade
  143405: 5, // Electric Class → Tesla Model X
  143406: 1, // First Class → Mercedes S-Class
  143408: 6, // Sprinter Class → Mercedes Sprinter
};

const VEHICLE_TYPE_IDS = [143406, 143407, 143405, 143410, 143404, 143408];

const ROUTES = [
  {
    name: 'JFK → Times Square',
    pickup: { name: 'JFK Airport Terminal 4', lat: 40.6413, lng: -73.7781, state_code: 'NY', city: 'Queens', country_code: 'US' },
    dropoff: { name: 'Times Square', lat: 40.7580, lng: -73.9855, state_code: 'NY', city: 'New York', country_code: 'US' },
  },
  {
    name: 'LAX → Santa Monica',
    pickup: { name: 'Los Angeles International Airport', lat: 33.9416, lng: -118.4085, state_code: 'CA', city: 'Los Angeles', country_code: 'US' },
    dropoff: { name: 'Santa Monica Pier', lat: 34.0094, lng: -118.4973, state_code: 'CA', city: 'Santa Monica', country_code: 'US' },
  },
  {
    name: 'MIA → South Beach',
    pickup: { name: 'Miami International Airport', lat: 25.7959, lng: -80.2870, state_code: 'FL', city: 'Miami', country_code: 'US' },
    dropoff: { name: 'South Beach', lat: 25.7826, lng: -80.1341, state_code: 'FL', city: 'Miami Beach', country_code: 'US' },
  },
  {
    name: 'ORD → Chicago Loop',
    pickup: { name: "O'Hare International Airport", lat: 41.9742, lng: -87.9073, state_code: 'IL', city: 'Chicago', country_code: 'US' },
    dropoff: { name: 'Chicago Loop', lat: 41.8819, lng: -87.6278, state_code: 'IL', city: 'Chicago', country_code: 'US' },
  },
  {
    name: 'SFO → Palo Alto',
    pickup: { name: 'San Francisco International Airport', lat: 37.6213, lng: -122.3790, state_code: 'CA', city: 'San Francisco', country_code: 'US' },
    dropoff: { name: 'Palo Alto', lat: 37.4419, lng: -122.1430, state_code: 'CA', city: 'Palo Alto', country_code: 'US' },
  },
  {
    name: 'DEN → Boulder',
    pickup: { name: 'Denver International Airport', lat: 39.8561, lng: -104.6737, state_code: 'CO', city: 'Denver', country_code: 'US' },
    dropoff: { name: 'Boulder', lat: 40.0150, lng: -105.2705, state_code: 'CO', city: 'Boulder', country_code: 'US' },
  },
  {
    name: 'LAS → Strip',
    pickup: { name: 'Harry Reid International Airport', lat: 36.0840, lng: -115.1537, state_code: 'NV', city: 'Las Vegas', country_code: 'US' },
    dropoff: { name: 'Las Vegas Strip', lat: 36.1147, lng: -115.1728, state_code: 'NV', city: 'Las Vegas', country_code: 'US' },
  },
  {
    name: 'SEA → Downtown',
    pickup: { name: 'Seattle-Tacoma International Airport', lat: 47.4502, lng: -122.3088, state_code: 'WA', city: 'SeaTac', country_code: 'US' },
    dropoff: { name: 'Downtown Seattle', lat: 47.6062, lng: -122.3321, state_code: 'WA', city: 'Seattle', country_code: 'US' },
  },
  {
    name: 'ATL → Midtown',
    pickup: { name: 'Hartsfield-Jackson Atlanta International Airport', lat: 33.6407, lng: -84.4277, state_code: 'GA', city: 'Atlanta', country_code: 'US' },
    dropoff: { name: 'Midtown Atlanta', lat: 33.7866, lng: -84.3830, state_code: 'GA', city: 'Atlanta', country_code: 'US' },
  },
  {
    name: 'DFW → Downtown Dallas',
    pickup: { name: 'Dallas/Fort Worth International Airport', lat: 32.8998, lng: -97.0403, state_code: 'TX', city: 'Dallas', country_code: 'US' },
    dropoff: { name: 'Downtown Dallas', lat: 32.7767, lng: -96.7970, state_code: 'TX', city: 'Dallas', country_code: 'US' },
  },
];

// ── Elijah pricing model v2 (mirrors src/utils/pricing.ts) ─────
const KM_TO_MILES = 0.621371;
const BASE_MILE_RATE = 2.70;

const MARKETS = [
  { base: 128.80, lat: 40.6413, lng: -73.7781 },  // NYC
  { base: 129.10, lat: 33.9416, lng: -118.4085 },  // LA
  { base: 127.75, lat: 37.6213, lng: -122.3790 },  // SF
  { base: 129.18, lat: 25.7959, lng: -80.2870 },   // MIA
  { base: 128.69, lat: 41.9742, lng: -87.9073 },   // ORD
  { base: 134.59, lat: 39.8561, lng: -104.6737 },  // DEN
  { base: 128.64, lat: 47.4502, lng: -122.3088 },  // SEA
  { base: 128.40, lat: 33.6407, lng: -84.4277 },   // ATL
  { base: 126.60, lat: 36.0840, lng: -115.1537 },  // LAS
  { base: 127.69, lat: 32.8998, lng: -97.0403 },   // DFW
];
const DEFAULT_BASE = 129;

// Elijah uplifts v2 (vehicle_id → {fixed, perMile}) — baseline = id 2 (XTS / Luxury Sedan)
const VEHICLE_UPLIFTS = {
  2: { fixed: 0,   perMile: 0 },      // XTS = Luxury Sedan (baseline)
  4: { fixed: 1,   perMile: 1.11 },   // Suburban = SUV
  3: { fixed: 16,  perMile: 1.61 },   // Escalade = Business SUV
  5: { fixed: 21,  perMile: 1.61 },   // Tesla = Electric Class
  1: { fixed: 30,  perMile: 1.41 },   // S-Class = First Class
  6: { fixed: 178, perMile: 5.51 },   // Sprinter = Sprinter Class
};

function haversineMi(lat1, lng1, lat2, lng2) {
  const toRad = Math.PI / 180;
  const dLat = (lat2 - lat1) * toRad;
  const dLng = (lng2 - lng1) * toRad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.sin(dLng / 2) ** 2;
  return 3959 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function detectBase(lat, lng) {
  let best = DEFAULT_BASE, bestDist = Infinity;
  for (const m of MARKETS) {
    const d = haversineMi(lat, lng, m.lat, m.lng);
    if (d < bestDist) { bestDist = d; best = m.base; }
  }
  return bestDist <= 60 ? best : DEFAULT_BASE;
}

function elijahPrice(distanceMiles, elijahVehicleId, pickupLat, pickupLng) {
  const miles = Math.max(distanceMiles, 1);
  const base = detectBase(pickupLat, pickupLng);
  const uplift = VEHICLE_UPLIFTS[elijahVehicleId] || VEHICLE_UPLIFTS[1];
  return Math.round((base + BASE_MILE_RATE * miles + uplift.fixed + uplift.perMile * miles) * 100) / 100;
}

// ── Ridelux API call ───────────────────────────────────────────
async function fetchRideluxPrices(route) {
  const body = {
    service_type_id: 213459,
    infant_child_seat_count: 0,
    booster_child_seat_count: 0,
    toddler_child_seat_count: 0,
    vehicle_types: VEHICLE_TYPE_IDS,
    promotion_code: '',
    scheduled_pickup_at: '2026-06-02T10:00:00',
    pickup: {
      type: 'address',
      address: {
        name: route.pickup.name,
        country_code: route.pickup.country_code,
        state_code: route.pickup.state_code,
        city: route.pickup.city,
        address_line1: route.pickup.name,
        latitude: route.pickup.lat,
        longitude: route.pickup.lng,
      },
    },
    dropoff: {
      type: 'address',
      address: {
        name: route.dropoff.name,
        country_code: route.dropoff.country_code,
        state_code: route.dropoff.state_code,
        city: route.dropoff.city,
        address_line1: route.dropoff.name,
        latitude: route.dropoff.lat,
        longitude: route.dropoff.lng,
      },
    },
  };

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      accept: '*/*',
      authorization: AUTH,
      'content-type': 'application/json',
      origin: 'https://ridelux.com',
      referer: 'https://ridelux.com/',
      'user-agent': 'Mozilla/5.0 (iPad; CPU OS 18_5 like Mac OS X)',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json();
}

// ── Main ────────────────────────────────────────────────────────
async function main() {
  const allRows = [];
  let totalAbsError = 0;
  let totalCount = 0;

  for (const route of ROUTES) {
    process.stdout.write(`Fetching ${route.name}...`);
    try {
      const data = await fetchRideluxPrices(route);
      const distanceMi = data.results[0]?.applied_distance || 0;
      console.log(` ${distanceMi.toFixed(1)} mi`);

      for (const r of data.results) {
        const elijahId = RIDELUX_TO_ELIJAH[r.vehicle_type_id];
        if (!elijahId) continue;

        const rideluxPrice = r.total_amount;
        const elijahPriceVal = elijahPrice(distanceMi, elijahId, route.pickup.lat, route.pickup.lng);
        const diff = elijahPriceVal - rideluxPrice;
        const pctDiff = ((diff / rideluxPrice) * 100);

        allRows.push({
          route: route.name,
          miles: distanceMi,
          vehicle: RIDELUX_VEHICLES[r.vehicle_type_id],
          ridelux: rideluxPrice,
          elijah: elijahPriceVal,
          diff: diff,
          pct: pctDiff,
        });

        totalAbsError += Math.abs(diff);
        totalCount++;
      }
    } catch (err) {
      console.log(` ERROR: ${err.message}`);
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 500));
  }

  // Print comparison table
  console.log('\n' + '='.repeat(110));
  console.log('ELIJAH vs RIDELUX PRICING COMPARISON');
  console.log('='.repeat(110));
  console.log(
    'Route'.padEnd(22) +
    'Miles'.padStart(7) +
    'Vehicle'.padEnd(18) +
    'Ridelux $'.padStart(12) +
    'Elijah $'.padStart(12) +
    'Diff $'.padStart(10) +
    'Diff %'.padStart(10)
  );
  console.log('-'.repeat(110));

  let currentRoute = '';
  for (const row of allRows) {
    if (row.route !== currentRoute) {
      if (currentRoute) console.log('');
      currentRoute = row.route;
    }
    const diffColor = Math.abs(row.pct) <= 5 ? '  ' : Math.abs(row.pct) <= 10 ? '! ' : '!!';
    console.log(
      row.route.padEnd(22) +
      row.miles.toFixed(1).padStart(7) +
      ('  ' + row.vehicle).padEnd(18) +
      row.ridelux.toFixed(2).padStart(12) +
      row.elijah.toFixed(2).padStart(12) +
      (row.diff >= 0 ? '+' : '') + row.diff.toFixed(2).padStart(9) +
      (row.pct >= 0 ? '+' : '') + row.pct.toFixed(1).padStart(8) + '%' +
      ' ' + diffColor
    );
  }

  console.log('\n' + '='.repeat(110));
  console.log(`Total comparisons: ${totalCount}`);
  console.log(`Mean Absolute Error (MAE): $${(totalAbsError / totalCount).toFixed(2)}`);

  // Per-vehicle MAE
  const byVehicle = {};
  for (const row of allRows) {
    if (!byVehicle[row.vehicle]) byVehicle[row.vehicle] = { sum: 0, count: 0 };
    byVehicle[row.vehicle].sum += Math.abs(row.diff);
    byVehicle[row.vehicle].count++;
  }
  console.log('\nMAE by vehicle class:');
  for (const [name, stats] of Object.entries(byVehicle).sort((a, b) => a[1].sum / a[1].count - b[1].sum / b[1].count)) {
    console.log(`  ${name.padEnd(18)} $${(stats.sum / stats.count).toFixed(2)}`);
  }
}

main().catch(console.error);
