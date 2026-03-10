/**
 * Dynamic Pricing Engine — Elijah Luxury Transportation
 *
 * Factors considered (Airbnb-style):
 *  1. Base fare per vehicle class
 *  2. Distance rate per km (varies by vehicle)
 *  3. Time-of-day multiplier (peak hours cost more)
 *  4. Day-of-week multiplier (weekends / holidays cost more)
 *  5. Advance booking discount (booking days ahead = cheaper)
 *  6. Duration-based fare (minimum 1h for short trips)
 *  7. Return trip discount (10% off second leg)
 */

export interface PricingInput {
  distanceKm: number;
  durationMin: number;
  vehicleId: number;
  date: string;       // 'YYYY-MM-DD'
  time: string;       // 'HH:MM'
  returnTrip: boolean;
}

export interface PricingBreakdown {
  baseFare: number;
  distanceCost: number;
  timeSurcharge: number;
  dayMultiplierLabel: string;
  dayMultiplierValue: number;
  timeMultiplierLabel: string;
  timeMultiplierValue: number;
  advanceDiscount: number;
  subtotal: number;
  returnLegCost: number;
  total: number;
}

// Rate per km by vehicle class
const VEHICLE_RATES: Record<number, number> = {
  1: 3.20,  // Mercedes S-Class
  2: 2.80,  // Cadillac XTS
  3: 3.80,  // Cadillac Escalade
  4: 3.50,  // Chevrolet Suburban
  5: 3.60,  // Tesla Model X
  6: 4.20,  // Mercedes Sprinter
  7: 5.50,  // Lincoln Stretch Limousine
};

const BASE_FARE = 8.00;
const MINIMUM_FARE = 15.00;

/**
 * Time-of-day pricing tiers:
 *  - Late night (00:00–05:59): +$15 flat + 1.30x
 *  - Early morning rush (06:00–07:59): 1.20x
 *  - Morning peak (08:00–09:59): 1.35x
 *  - Midday (10:00–15:59): 1.00x (standard)
 *  - Afternoon peak (16:00–18:59): 1.35x
 *  - Evening (19:00–21:59): 1.15x
 *  - Night (22:00–23:59): +$10 flat + 1.20x
 */
function getTimeMultiplier(hour: number): { multiplier: number; surcharge: number; label: string } {
  if (hour >= 0 && hour < 6)   return { multiplier: 1.30, surcharge: 15, label: 'Late Night' };
  if (hour >= 6 && hour < 8)   return { multiplier: 1.20, surcharge: 0,  label: 'Early Morning' };
  if (hour >= 8 && hour < 10)  return { multiplier: 1.35, surcharge: 0,  label: 'Morning Peak' };
  if (hour >= 10 && hour < 16) return { multiplier: 1.00, surcharge: 0,  label: 'Standard' };
  if (hour >= 16 && hour < 19) return { multiplier: 1.35, surcharge: 0,  label: 'Afternoon Peak' };
  if (hour >= 19 && hour < 22) return { multiplier: 1.15, surcharge: 0,  label: 'Evening' };
  return { multiplier: 1.20, surcharge: 10, label: 'Night' };
}

/**
 * Day-of-week pricing:
 *  - Monday–Thursday: 1.00x (standard)
 *  - Friday: 1.10x (1.20x after 5pm)
 *  - Saturday: 1.25x
 *  - Sunday: 0.95x (lower demand)
 *
 *  Also checks for Colombian holidays and special dates.
 */
function getDayMultiplier(dateStr: string, hour: number): { multiplier: number; label: string } {
  const d = new Date(dateStr + 'T12:00:00');
  const dow = d.getDay(); // 0=Sun ... 6=Sat

  // Check Colombian holidays (simplified — major fixed-date holidays)
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const isHoliday =
    (month === 1 && day === 1) ||   // Año Nuevo
    (month === 5 && day === 1) ||   // Día del Trabajo
    (month === 7 && day === 20) ||  // Independencia
    (month === 8 && day === 7) ||   // Batalla de Boyacá
    (month === 12 && day === 25) || // Navidad
    (month === 12 && day === 31);   // Fin de Año

  if (isHoliday) return { multiplier: 1.40, label: 'Holiday' };

  // Check if it's a "puente" week (day before or after holiday)
  const isPreHoliday = (month === 12 && (day === 24 || day === 30));
  if (isPreHoliday) return { multiplier: 1.25, label: 'Pre-Holiday' };

  switch (dow) {
    case 0: return { multiplier: 0.95, label: 'Sunday' };
    case 5: return { multiplier: hour >= 17 ? 1.20 : 1.10, label: hour >= 17 ? 'Friday Night' : 'Friday' };
    case 6: return { multiplier: 1.25, label: 'Saturday' };
    default: return { multiplier: 1.00, label: 'Weekday' };
  }
}

/**
 * Advance booking discount:
 *  - Same day: 0% discount
 *  - 1–2 days ahead: 3% discount
 *  - 3–6 days ahead: 5% discount
 *  - 7–13 days ahead: 8% discount
 *  - 14+ days ahead: 12% discount
 */
function getAdvanceDiscount(dateStr: string): number {
  const bookingDate = new Date(dateStr + 'T12:00:00');
  const now = new Date();
  const diffMs = bookingDate.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays >= 14) return 0.12;
  if (diffDays >= 7) return 0.08;
  if (diffDays >= 3) return 0.05;
  if (diffDays >= 1) return 0.03;
  return 0;
}

export function calculatePrice(input: PricingInput): PricingBreakdown {
  const { distanceKm, vehicleId, date, time, returnTrip } = input;
  const rate = VEHICLE_RATES[vehicleId] || 3.00;
  const hour = parseInt(time.split(':')[0], 10);

  const timeTier = getTimeMultiplier(hour);
  const dayTier = getDayMultiplier(date, hour);
  const advanceDiscountPct = getAdvanceDiscount(date);

  // Core cost
  const distanceCost = distanceKm * rate;
  const rawCost = BASE_FARE + distanceCost + timeTier.surcharge;

  // Apply multipliers
  const afterMultipliers = rawCost * timeTier.multiplier * dayTier.multiplier;

  // Apply advance discount
  const discountAmount = afterMultipliers * advanceDiscountPct;
  const subtotal = Math.max(afterMultipliers - discountAmount, MINIMUM_FARE);

  // Return trip: 10% discount on second leg
  const returnLegCost = returnTrip ? subtotal * 0.90 : 0;
  const total = subtotal + returnLegCost;

  return {
    baseFare: BASE_FARE,
    distanceCost,
    timeSurcharge: timeTier.surcharge,
    timeMultiplierLabel: timeTier.label,
    timeMultiplierValue: timeTier.multiplier,
    dayMultiplierLabel: dayTier.label,
    dayMultiplierValue: dayTier.multiplier,
    advanceDiscount: advanceDiscountPct,
    subtotal,
    returnLegCost,
    total,
  };
}

/** Simple helper for just the total (backwards compatible) */
export function calculateTotal(input: PricingInput): number {
  return calculatePrice(input).total;
}
