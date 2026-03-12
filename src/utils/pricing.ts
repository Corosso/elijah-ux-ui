interface PricingInput {
  distanceKm: number;
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

export function calculatePrice({ distanceKm, vehicleId, date, time, returnTrip }: PricingInput): number {
  const rate = VEHICLE_RATES[vehicleId] || 3.00;
  const hour = parseInt(time.split(':')[0], 10);
  const dayOfWeek = new Date(date + 'T12:00:00').getDay();

  // Time-based multiplier and flat surcharge
  let timeMultiplier = 1.0;
  let flatSurcharge = 0;

  if (hour >= 0 && hour < 5) {
    flatSurcharge = 10;
  } else if (hour >= 7 && hour < 9) {
    timeMultiplier = 1.25;
  } else if (hour >= 17 && hour < 19) {
    timeMultiplier = 1.25;
  } else if (hour >= 19 && hour < 22) {
    timeMultiplier = 1.1;
  } else if (hour >= 22) {
    flatSurcharge = 10;
  }

  // Day-based multiplier
  let dayMultiplier = 1.0;

  if (dayOfWeek === 0) {
    dayMultiplier = 0.90;
  } else if (dayOfWeek === 6) {
    dayMultiplier = 1.20;
  } else if (dayOfWeek === 5 && hour >= 17) {
    dayMultiplier = 1.15;
  }

  let total = (BASE_FARE + distanceKm * rate + flatSurcharge) * timeMultiplier * dayMultiplier;

  if (returnTrip) {
    total *= 2;
  }

  return total;
}
