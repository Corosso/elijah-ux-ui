import { useMemo } from 'react';
import { MessageCircleIcon, PhoneIcon } from 'lucide-react';
import { vehicles } from '../../data/vehicles';
import { calculatePrice, getAvailableVehicles } from '../../utils/pricing';
import type { PricingBreakdown, ServiceMode } from '../../utils/pricing';
import type { GeocodeSuggestion, RouteGeometry } from '../../api/googleMaps';
import { extractCity } from './constants';
import { RouteSummary } from './RouteSummary';
import { VehicleCard } from './VehicleCard';
import { PaymentBrands } from './PaymentBrands';

interface VehicleSelectionContentProps {
  origin: GeocodeSuggestion;
  destination: GeocodeSuggestion | null;
  date: string;
  time: string;
  serviceMode: ServiceMode;
  returnTrip: boolean;
  routeResult: RouteGeometry | null;
  hours: number;
  onEdit: () => void;
  onSelect: (name: string, breakdown: PricingBreakdown) => void;
}

export function VehicleSelectionContent({ origin, destination, date, time, serviceMode, returnTrip, routeResult, hours, onEdit, onSelect }: VehicleSelectionContentProps) {
  // Filter vehicles by market availability and compute prices
  const availableIds = useMemo(
    () => serviceMode === 'point-to-point'
      ? getAvailableVehicles(origin.lat, origin.lng)
      : null, // hourly shows all vehicles (availability handled via tier rates)
    [serviceMode, origin.lat, origin.lng],
  );

  const pickupHour = time ? parseInt(time.split(':')[0], 10) : undefined;

  const breakdowns = useMemo(
    () => Object.fromEntries(vehicles.map(v => [v.id,
      serviceMode === 'hourly'
        ? calculatePrice({ mode: 'hourly', hours, vehicleId: v.id, pickupLat: origin.lat, pickupLng: origin.lng, pickupHour })
        : calculatePrice({ mode: 'point-to-point', distanceKm: (routeResult?.distance ?? 0) / 1000, vehicleId: v.id, returnTrip, pickupLat: origin.lat, pickupLng: origin.lng, pickupHour }),
    ])),
    [serviceMode, hours, routeResult?.distance, returnTrip, origin.lat, origin.lng, pickupHour],
  );

  // Filter by market availability (point-to-point) and sort by price
  const sortedVehicles = useMemo(() => {
    const filtered = availableIds
      ? vehicles.filter(v => availableIds.includes(v.id))
      : vehicles;
    return [...filtered].sort((a, b) => (breakdowns[a.id]?.total ?? 0) - (breakdowns[b.id]?.total ?? 0));
  }, [availableIds, breakdowns]);

  const originLabel = extractCity(origin.label);
  const destLabel = serviceMode === 'hourly'
    ? `${hours} hour${hours !== 1 ? 's' : ''} — By the Hour`
    : extractCity(destination?.label ?? '');

  return (
    <>
      <RouteSummary origin={originLabel} destination={destLabel} date={date} time={time} onEdit={onEdit} />
      <div className="flex flex-col lg:flex-row gap-5 sm:gap-8">
        <div className="flex-1 space-y-4 sm:space-y-6">
          <h2 className="text-eyebrow-sm sm:text-eyebrow text-gold">Step 2 of 5 — Vehicle Class</h2>
          {sortedVehicles.map((v) => <VehicleCard key={v.id} vehicle={v} breakdown={breakdowns[v.id]} onSelect={onSelect} />)}
        </div>
        <div className="lg:w-[280px] flex-shrink-0 space-y-4">
          <div className="border border-border rounded-lg p-5 bg-bg-primary dark:bg-bg-elevated">
            <h4 className="text-caption font-bold text-text-primary mb-2">Need help?</h4>
            <p className="text-caption text-text-secondary mb-4">Our customer care team is ready to assist you.</p>
            <a href="#" className="flex items-center gap-2 text-caption font-semibold text-gold hover:text-gold-hover transition-colors mb-3">
              <MessageCircleIcon className="w-4 h-4" /> START CHAT
            </a>
            <div className="border-t border-border pt-3">
              <span className="text-caption text-text-secondary block mb-1">Call Us</span>
              <a href="tel:+18005550199" className="flex items-center gap-2 text-caption font-medium text-text-primary hover:text-gold transition-colors">
                <PhoneIcon className="w-4 h-4" /> +1 (800) 555-0199
              </a>
            </div>
          </div>
          <div className="border border-border rounded-lg p-5 bg-bg-primary dark:bg-bg-elevated">
            <p className="text-caption text-text-secondary/60 text-center">Secure payments</p>
            <p className="text-micro text-text-secondary/40 text-center mb-3">Powered by <strong>Stripe</strong></p>
            <PaymentBrands />
          </div>
        </div>
      </div>
    </>
  );
}
