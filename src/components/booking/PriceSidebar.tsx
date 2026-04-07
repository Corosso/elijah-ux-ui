import type { PricingBreakdown } from '../../utils/pricing';
import { PaymentBrands } from './PaymentBrands';

interface PriceSidebarProps {
  breakdown: PricingBreakdown;
  buttonLabel: string;
  onAction?: () => void;
}

export function PriceSidebar({ breakdown, buttonLabel, onAction }: PriceSidebarProps) {
  const totalParts = breakdown.total.toFixed(2).split('.');
  return (
    <div className="lg:w-[280px] flex-shrink-0 space-y-4">
      <div className="border border-border rounded-lg p-5 bg-bg-primary dark:bg-bg-elevated">
        <div className="flex items-center justify-between mb-2">
          <span className="text-caption text-text-secondary">Base Fare</span>
          <span className="text-caption font-medium text-text-primary">${breakdown.subtotal.toFixed(2)} USD</span>
        </div>
        {breakdown.returnLegCost > 0 && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-caption text-text-secondary">Return Leg</span>
            <span className="text-caption font-medium text-text-primary">${breakdown.returnLegCost.toFixed(2)} USD</span>
          </div>
        )}
        {breakdown.nightFee > 0 && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-caption text-text-secondary">Night Time Fee</span>
            <span className="text-caption font-medium text-text-primary">${breakdown.nightFee.toFixed(2)} USD</span>
          </div>
        )}
        <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
          <span className="text-caption font-bold text-gold">Total</span>
          <div className="flex items-baseline gap-0.5">
            <span className="text-body-lg font-bold text-text-primary">${totalParts[0]}</span>
            <span className="text-caption font-bold text-text-primary">.{totalParts[1]}</span>
            <span className="text-micro text-text-secondary ml-1">USD</span>
          </div>
        </div>
        {onAction && (
          <button
            onClick={onAction}
            className="w-full mt-4 py-3 bg-gold hover:bg-gold-hover text-white font-bold rounded active:scale-[0.97] transition-all uppercase tracking-wider text-caption"
          >
            {buttonLabel}
          </button>
        )}

        <p className="text-caption text-text-secondary/60 text-center mt-4">Secure payments</p>
        <p className="text-micro text-text-secondary/40 text-center mb-3">Powered by <strong>Stripe</strong></p>
        <PaymentBrands />
      </div>
    </div>
  );
}
