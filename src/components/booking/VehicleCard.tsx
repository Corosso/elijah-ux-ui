import { UsersIcon, BriefcaseIcon, ShieldCheckIcon, WifiIcon, CoffeeIcon, XCircleIcon, ClockIcon } from 'lucide-react';
import { vehicles } from '../../data/vehicles';
import type { PricingBreakdown } from '../../utils/pricing';

interface VehicleCardProps {
  vehicle: typeof vehicles[0];
  breakdown: PricingBreakdown | null;
  onSelect: (name: string, breakdown: PricingBreakdown) => void;
}

export function VehicleCard({ vehicle, breakdown, onSelect }: VehicleCardProps) {
  const price = breakdown?.total ?? 0;
  const priceParts = price.toFixed(2).split('.');

  return (
    <div className="border-b border-border pb-5 sm:pb-8 last:border-b-0 last:pb-0">
      {/* Mobile: stacked layout */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-3 sm:gap-5 lg:gap-8">
        {/* Vehicle Image */}
        <div className="flex justify-center lg:justify-start lg:w-[300px] flex-shrink-0">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[290px] h-auto object-contain dark:drop-shadow-[0_0_20px_rgba(205,168,78,0.25)]"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-heading-sm font-bold text-text-primary font-serif">{vehicle.category}</h3>
          <p className="text-caption text-text-secondary mt-0.5">{vehicle.description}</p>

          {/* Price — prominent on mobile */}
          <div className="mt-2 sm:mt-3 lg:hidden">
            <div className="flex items-baseline gap-0.5">
              <span className="text-heading-xs font-bold text-text-primary">${priceParts[0]}</span>
              <span className="text-body font-bold text-text-primary">.{priceParts[1]}</span>
              <span className="text-caption text-text-secondary ml-1.5">USD</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <ShieldCheckIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500" />
              <span className="text-micro text-text-secondary">Price includes taxes, tolls & tip.</span>
            </div>
            <p className="text-micro text-text-secondary/50 mt-0.5">No hidden costs.</p>
          </div>

          {/* Features */}
          {vehicle.features && (
            <ul className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
              {vehicle.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2 text-caption text-text-secondary">
                  {feat.toLowerCase().includes('wifi') ? <WifiIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" /> :
                   feat.toLowerCase().includes('water') || feat.toLowerCase().includes('champagne') || feat.toLowerCase().includes('snack') ? <CoffeeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" /> :
                   feat.toLowerCase().includes('cancellation') ? <XCircleIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" /> :
                   <ClockIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />}
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Pricing tags */}

          {/* Capacity */}
          <div className="flex items-center gap-4 sm:gap-5 mt-3 sm:mt-4 text-text-secondary">
            <div className="flex items-center gap-1.5">
              <UsersIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /><span className="text-caption">max. {vehicle.passengers}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BriefcaseIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /><span className="text-caption">max. {vehicle.luggage}</span>
            </div>
          </div>

          {/* Mobile SELECT */}
          <button
            onClick={() => breakdown && onSelect(vehicle.name, breakdown)}
            className="mt-4 sm:mt-5 w-full py-3 sm:py-3.5 bg-gold hover:bg-gold-hover text-white font-bold rounded active:scale-[0.97] transition-all uppercase tracking-wider text-caption lg:hidden"
          >SELECT</button>
        </div>

        {/* Desktop: Price + SELECT on right */}
        <div className="hidden lg:flex flex-col items-end justify-between flex-shrink-0 w-[160px]">
          <div className="text-right">
            <div className="flex items-baseline gap-0.5">
              <span className="text-heading-sm font-bold text-text-primary">${priceParts[0]}</span>
              <span className="text-body-lg font-bold text-text-primary">.{priceParts[1]}</span>
              <span className="text-caption text-text-secondary ml-1">USD</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-green-500" />
              <span className="text-caption text-text-secondary">Price includes taxes, tolls & tip.</span>
            </div>
            <p className="text-micro text-text-secondary/60 mt-0.5">No hidden costs.</p>
          </div>
          <button
            onClick={() => breakdown && onSelect(vehicle.name, breakdown)}
            className="mt-4 w-full px-6 py-3 bg-gold hover:bg-gold-hover text-white font-bold rounded active:scale-[0.97] transition-all uppercase tracking-wider text-caption"
          >SELECT</button>
        </div>
      </div>
    </div>
  );
}
