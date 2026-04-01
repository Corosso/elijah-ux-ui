import { useState } from 'react';
import { CreditCardIcon, LockIcon, ArrowLeftIcon } from 'lucide-react';
import { PaymentBrands } from './PaymentBrands';
import type { PricingBreakdown } from '../../utils/pricing';
import { PAGE_INPUT } from './constants';
import { RouteSummary } from './RouteSummary';
import { PriceSidebar } from './PriceSidebar';

interface PaymentContentProps {
  origin: string;
  destination: string;
  date: string;
  time: string;
  vehicleName: string;
  breakdown: PricingBreakdown;
  onEdit: () => void;
  onBack: () => void;
  onBook: () => void;
}

export function PaymentContent({ origin, destination, date, time, vehicleName, breakdown, onEdit, onBack, onBook }: PaymentContentProps) {
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [agreed, setAgreed] = useState(false);

  const canBook = cardName && cardNumber && cardExpiry && cardCvc && agreed;

  return (
    <>
      <RouteSummary origin={origin} destination={destination} date={date} time={time} vehicleName={vehicleName} onEdit={onEdit} />
      <h2 className="text-eyebrow-sm sm:text-eyebrow text-gold mb-4 sm:mb-6">Step 5 of 5 — Payment Information</h2>
      <div className="flex flex-col lg:flex-row gap-5 sm:gap-8">
        <div className="flex-1">
          <h3 className="text-body-lg font-bold text-text-primary mb-2">Payment information</h3>
          <p className="text-caption text-text-secondary mb-4 sm:mb-6">All transactions are secure and encrypted. Safe and secure payments powered by <strong>Stripe</strong>.</p>

          <div className="space-y-4 max-w-xl">
            <div>
              <label className="text-caption text-text-secondary mb-1 block">Name on Card *</label>
              <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Name on Card" className={PAGE_INPUT} />
            </div>
            <div>
              <label className="text-caption text-text-secondary mb-1 block">Card Number *</label>
              <div className="relative">
                <CreditCardIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="Card number" className={PAGE_INPUT + ' pl-10'} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-caption text-text-secondary mb-1 block">Expiry *</label>
                <input type="text" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="MM / YY" className={PAGE_INPUT} />
              </div>
              <div>
                <label className="text-caption text-text-secondary mb-1 block">CVC *</label>
                <input type="text" value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} placeholder="CVC" className={PAGE_INPUT} />
              </div>
            </div>

            <div className="flex items-center gap-2 text-caption text-text-secondary">
              <LockIcon className="w-3.5 h-3.5" />
              <span>By clicking 'BOOK NOW', you agree to our <a href="/legal#terms" className="text-gold hover:underline">Terms & Conditions</a>.</span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="w-4 h-4 accent-gold" />
              <span className="text-caption text-text-primary">I agree to the Terms & Conditions</span>
            </label>

            <div className="mt-2">
              <PaymentBrands />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button onClick={onBack} className="px-8 py-3 border border-border text-text-primary font-bold rounded active:scale-[0.97] transition-all uppercase tracking-wider text-caption hover:bg-bg-elevated">
                <span className="flex items-center gap-2"><ArrowLeftIcon className="w-4 h-4" /> BACK</span>
              </button>
              <button
                disabled={!canBook}
                onClick={onBook}
                className="flex-1 py-3 bg-gold hover:bg-gold-hover text-white font-bold rounded active:scale-[0.97] transition-all uppercase tracking-wider text-caption disabled:opacity-50 disabled:cursor-not-allowed"
              >BOOK NOW</button>
            </div>
          </div>
        </div>

        <PriceSidebar breakdown={breakdown} buttonLabel="BOOK NOW" onAction={canBook ? onBook : undefined} />
      </div>
    </>
  );
}
