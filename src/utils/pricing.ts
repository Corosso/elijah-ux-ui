export interface PricingBreakdown {
  subtotal: number;
  returnLegCost: number;
  total: number;
  timeMultiplierValue: number;
  timeMultiplierLabel: string;
  dayMultiplierValue: number;
  dayMultiplierLabel: string;
  advanceDiscount: number;
}

interface PricingInput {
  distanceKm: number;
  durationMin: number;
  vehicleId: number;
  date: string;    // 'YYYY-MM-DD'
  time: string;    // 'HH:MM'
  returnTrip: boolean;
}

const VEHICLE_RATES: Record<number, number> = {
  1: 3.20,  // Mercedes S-Class
  2: 2.80,  // Cadillac XTS
  3: 3.80,  // Cadillac Escalade
  4: 3.50,  // Chevrolet Suburban
  5: 3.60,  // Tesla Model X
  6: 4.20,  // Mercedes Sprinter
  7: 5.50,  // Lincoln Stretch Limousine
};

const BASE_FARE = 5.00;

// Colombian public holidays (month-day)
const HOLIDAYS = [
  '01-01', '01-06', '03-24', '03-28', '03-29', '05-01',
  '06-16', '06-23', '06-30', '07-01', '07-20', '08-07',
  '08-19', '10-14', '11-04', '11-11', '12-08', '12-25',
];

export function calculatePrice({ distanceKm, durationMin, vehicleId, date, time, returnTrip }: PricingInput): PricingBreakdown {
  const rate = VEHICLE_RATES[vehicleId] || 3.00;
  const hour = parseInt(time.split(':')[0], 10);
  const dateObj = new Date(date + 'T12:00:00');
  const dayOfWeek = dateObj.getDay();
  const monthDay = date.slice(5); // 'MM-DD'

  // Time-based multiplier
  let timeMultiplierValue = 1.0;
  let timeMultiplierLabel = 'Standard';

  if (hour >= 0 && hour < 5) {
    timeMultiplierValue = 1.30;
    timeMultiplierLabel = 'Late Night';
  } else if (hour >= 7 && hour < 9) {
    timeMultiplierValue = 1.35;
    timeMultiplierLabel = 'Morning Rush';
  } else if (hour >= 17 && hour < 19) {
    timeMultiplierValue = 1.35;
    timeMultiplierLabel = 'Evening Rush';
  } else if (hour >= 19 && hour < 22) {
    timeMultiplierValue = 1.10;
    timeMultiplierLabel = 'Evening';
  } else if (hour >= 22) {
    timeMultiplierValue = 1.30;
    timeMultiplierLabel = 'Late Night';
  }

  // Day-based multiplier
  let dayMultiplierValue = 1.0;
  let dayMultiplierLabel = 'Weekday';

  if (HOLIDAYS.includes(monthDay)) {
    dayMultiplierValue = 1.40;
    dayMultiplierLabel = 'Holiday';
  } else if (dayOfWeek === 0) {
    dayMultiplierValue = 0.95;
    dayMultiplierLabel = 'Sunday';
  } else if (dayOfWeek === 6) {
    dayMultiplierValue = 1.25;
    dayMultiplierLabel = 'Saturday';
  } else if (dayOfWeek === 5 && hour >= 17) {
    dayMultiplierValue = 1.15;
    dayMultiplierLabel = 'Friday Evening';
  }

  // Advance booking discount (based on days ahead)
  const now = new Date();
  const tripDate = new Date(date + 'T' + time);
  const daysAhead = Math.max(0, (tripDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  let advanceDiscount = 0;
  if (daysAhead >= 14) advanceDiscount = 0.12;
  else if (daysAhead >= 7) advanceDiscount = 0.08;
  else if (daysAhead >= 3) advanceDiscount = 0.04;

  // Duration-based minimum (long trips get a time component)
  const durationSurcharge = durationMin > 60 ? (durationMin - 60) * 0.15 : 0;

  const baseCost = BASE_FARE + distanceKm * rate + durationSurcharge;
  const subtotal = baseCost * timeMultiplierValue * dayMultiplierValue * (1 - advanceDiscount);

  let returnLegCost = 0;
  if (returnTrip) {
    returnLegCost = subtotal * 0.90; // 10% discount on return leg
  }

  const total = subtotal + returnLegCost;

  return {
    subtotal,
    returnLegCost,
    total,
    timeMultiplierValue,
    timeMultiplierLabel,
    dayMultiplierValue,
    dayMultiplierLabel,
    advanceDiscount,
  };
}
