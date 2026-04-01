import { useState } from 'react';
import { CircleIcon, ArrowLeftIcon } from 'lucide-react';
import type { PricingBreakdown } from '../../utils/pricing';
import { PAGE_INPUT } from './constants';
import { RouteSummary } from './RouteSummary';
import { PriceSidebar } from './PriceSidebar';

interface BookingDetailsContentProps {
  origin: string;
  destination: string;
  date: string;
  time: string;
  vehicleName: string;
  breakdown: PricingBreakdown;
  onEdit: () => void;
  onBack: () => void;
  onContinue: (notes: string, forSomeoneElse: boolean, childSeats: boolean) => void;
}

export function BookingDetailsContent({ origin, destination, date, time, vehicleName, breakdown, onEdit, onBack, onContinue }: BookingDetailsContentProps) {
  const [notes, setNotes] = useState('');
  const [forSomeoneElse, setForSomeoneElse] = useState(false);
  const [childSeats, setChildSeats] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [showPromo, setShowPromo] = useState(false);

  return (
    <>
      <RouteSummary origin={origin} destination={destination} date={date} time={time} vehicleName={vehicleName} onEdit={onEdit} />
      <h2 className="text-eyebrow-sm sm:text-eyebrow text-gold mb-4 sm:mb-6">Step 4 of 5 — Booking Details</h2>
      <div className="flex flex-col lg:flex-row gap-5 sm:gap-8">
        <div className="flex-1">
          <h3 className="text-body-lg font-bold text-text-primary mb-4 sm:mb-6">Additional information (Optional)</h3>
          <div className="space-y-5 max-w-xl">
            <div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes for the chauffeur"
                rows={3}
                className={PAGE_INPUT + ' resize-none'}
              />
              <p className="text-caption text-text-secondary/60 mt-1">Enter any special requests or important information for your ride, e.g. child car seats, etc.</p>
            </div>

            <label className="flex items-center gap-3 cursor-pointer py-2">
              <div className={`w-10 h-6 rounded-full transition-colors relative ${forSomeoneElse ? 'bg-gold' : 'bg-border'}`}
                onClick={() => setForSomeoneElse(!forSomeoneElse)}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${forSomeoneElse ? 'left-5' : 'left-1'}`} />
              </div>
              <span className="text-caption text-text-primary">Are you booking for someone else?</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer py-2">
              <div className={`w-10 h-6 rounded-full transition-colors relative ${childSeats ? 'bg-gold' : 'bg-border'}`}
                onClick={() => setChildSeats(!childSeats)}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${childSeats ? 'left-5' : 'left-1'}`} />
              </div>
              <span className="text-caption text-text-primary">Do you need child seats?</span>
            </label>

            <div className="flex items-center gap-3 pt-4">
              <button onClick={onBack} className="px-8 py-3 border border-border text-text-primary font-bold rounded active:scale-[0.97] transition-all uppercase tracking-wider text-caption hover:bg-bg-elevated">
                <span className="flex items-center gap-2"><ArrowLeftIcon className="w-4 h-4" /> BACK</span>
              </button>
              <button
                onClick={() => onContinue(notes, forSomeoneElse, childSeats)}
                className="flex-1 py-3 bg-gold hover:bg-gold-hover text-white font-bold rounded active:scale-[0.97] transition-all uppercase tracking-wider text-caption"
              >CONTINUE TO PAYMENT</button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <PriceSidebar breakdown={breakdown} buttonLabel="CONTINUE TO PAYMENT" onAction={() => onContinue(notes, forSomeoneElse, childSeats)} />
          {!showPromo ? (
            <button onClick={() => setShowPromo(true)} className="flex items-center gap-2 text-caption text-text-secondary hover:text-gold transition-colors">
              <CircleIcon className="w-4 h-4" /> Do you have a promo code?
            </button>
          ) : (
            <div className="flex gap-2">
              <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Promo code" className={PAGE_INPUT + ' flex-1'} />
              <button className="px-4 py-2 bg-gold text-white text-caption font-bold rounded active:scale-[0.97] transition-all">APPLY</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
