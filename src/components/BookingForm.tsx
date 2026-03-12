import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPinIcon, ArrowRightIcon, LoaderIcon, UsersIcon, BriefcaseIcon,
  CheckCircleIcon, CircleIcon, WifiIcon, CoffeeIcon, XCircleIcon,
  ClockIcon, StarIcon, ShieldCheckIcon, PhoneIcon, MessageCircleIcon,
  XIcon, CreditCardIcon, LockIcon, ArrowLeftIcon, CheckIcon,
} from 'lucide-react';
import { geocodeAutocomplete, getDirections } from '../api/googleMaps';
import type { GeocodeSuggestion, RouteGeometry } from '../api/googleMaps';
import { useDebounce } from '../hooks/useDebounce';
import { vehicles } from '../data/vehicles';
import { calculatePrice } from '../utils/pricing';
import type { PricingBreakdown } from '../utils/pricing';

interface BookingFormProps {
  onRouteFound?: (
    route: RouteGeometry,
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
  ) => void;
}

const COLOMBIA_CENTER = { lat: 4.65, lng: -74.05 };

const INPUT_CLASS = 'w-full bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/10 rounded py-2.5 pl-3 pr-3 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all text-sm';
const PAGE_INPUT = 'w-full border border-border rounded-lg py-3 px-4 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all text-sm bg-bg-primary dark:bg-bg-elevated';

function extractCity(label: string): string {
  const parts = label.split(',');
  return parts[0]?.trim() || label;
}

/* =============== Address Input =============== */
function AddressInput({ label, placeholder, onSelect }: {
  label: string;
  placeholder: string;
  onSelect: (s: GeocodeSuggestion) => void;
}) {
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState<GeocodeSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(false);
  const debouncedText = useDebounce(text, 400);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected) return;
    if (!debouncedText || debouncedText.length < 3) { setSuggestions([]); return; }
    let cancelled = false;
    setLoading(true);
    geocodeAutocomplete(debouncedText, COLOMBIA_CENTER)
      .then((r) => { if (!cancelled) { setSuggestions(r); setIsOpen(r.length > 0); } })
      .catch(() => { if (!cancelled) setSuggestions([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [debouncedText, selected]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <label className="text-[10px] font-semibold text-gold uppercase tracking-widest mb-1 block">{label}</label>
      <div className="relative flex items-center">
        <MapPinIcon className="absolute left-3 w-5 h-5 text-text-secondary" />
        <input
          type="text"
          value={text}
          onChange={(e) => { setText(e.target.value); setSelected(false); setIsOpen(true); }}
          onFocus={() => { if (!selected && suggestions.length > 0) setIsOpen(true); }}
          placeholder={placeholder}
          className="w-full bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/10 rounded py-2.5 pl-10 pr-10 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all text-sm"
        />
        {loading && <LoaderIcon className="absolute right-3 w-4 h-4 text-text-secondary animate-spin" />}
      </div>
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1 bg-bg-primary dark:bg-bg-elevated border border-border rounded-md shadow-lg z-50 max-h-48 overflow-y-auto"
          >
            {suggestions.map((s, i) => (
              <li
                key={i}
                onClick={() => { setText(s.label); setSelected(true); setIsOpen(false); setSuggestions([]); onSelect(s); }}
                className="px-4 py-2.5 text-sm text-text-primary hover:bg-gold/10 cursor-pointer transition-colors border-b border-border last:border-b-0"
              >{s.label}</li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =============== Step Progress Bar (5 steps) =============== */
function StepProgress({ current }: { current: number }) {
  const steps = [
    { num: 1, label: 'Ride Information' },
    { num: 2, label: 'Vehicle Class' },
    { num: 3, label: 'Login' },
    { num: 4, label: 'Booking Details' },
    { num: 5, label: 'Payment' },
  ];
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-3 flex-wrap">
      {steps.map((s, i) => (
        <div key={s.num} className="flex items-center gap-1 sm:gap-3">
          <div className="flex items-center gap-1.5">
            {current > s.num ? (
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
            ) : current === s.num ? (
              <div className="w-5 h-5 rounded-full bg-gold text-white flex items-center justify-center text-[10px] font-bold">{s.num}</div>
            ) : (
              <CircleIcon className="w-5 h-5 text-text-secondary/30" />
            )}
            <span className={`text-xs font-medium hidden sm:inline ${current >= s.num ? 'text-text-primary' : 'text-text-secondary/40'}`}>{s.label}</span>
          </div>
          {i < steps.length - 1 && <div className="w-4 sm:w-8 h-px bg-border" />}
        </div>
      ))}
    </div>
  );
}

/* =============== Persistent Overlay Portal =============== */
function OverlayPortal({ step, onClose, children }: {
  step: number;
  onClose: () => void;
  children: React.ReactNode;
}) {
  // Lock body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-bg-primary overflow-y-auto"
    >
      <div className="sticky top-0 z-10 bg-bg-primary/95 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <span className="font-serif text-xl tracking-[0.2em] uppercase text-gold">ELIJAH</span>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-bg-elevated transition-colors text-text-secondary" aria-label="Close">
              <XIcon className="w-5 h-5" />
            </button>
          </div>
          <StepProgress current={step} />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </div>
    </motion.div>,
    document.body
  );
}

/* =============== Route Summary Header =============== */
function RouteSummary({ origin, destination, date, time, vehicleName, onEdit }: {
  origin: string;
  destination: string;
  date: string;
  time: string;
  vehicleName?: string;
  onEdit: () => void;
}) {
  const dateObj = new Date(date + 'T' + time);
  const fmt = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const tmFmt = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-8 pb-6 border-b border-border">
      <div>
        <span className="text-[10px] font-semibold text-gold uppercase tracking-widest block mb-1">Pickup Location</span>
        <span className="text-sm text-text-primary font-medium">{origin}</span>
      </div>
      <div>
        <span className="text-[10px] font-semibold text-gold uppercase tracking-widest block mb-1">Destination</span>
        <span className="text-sm text-text-primary font-medium">{destination}</span>
      </div>
      <div>
        <span className="text-[10px] font-semibold text-gold uppercase tracking-widest block mb-1">Date & Time</span>
        <span className="text-sm text-text-primary font-medium">{fmt} {tmFmt}</span>
      </div>
      {vehicleName && (
        <div>
          <span className="text-[10px] font-semibold text-gold uppercase tracking-widest block mb-1">Car Type</span>
          <span className="text-sm text-text-primary font-medium">{vehicleName}</span>
        </div>
      )}
      <button onClick={onEdit} className="ml-auto text-sm font-semibold text-gold hover:text-gold-hover transition-colors uppercase tracking-wider">EDIT</button>
    </div>
  );
}

/* =============== Price Sidebar =============== */
function PriceSidebar({ breakdown, buttonLabel, onAction }: {
  breakdown: PricingBreakdown;
  buttonLabel: string;
  onAction?: () => void;
}) {
  const totalParts = breakdown.total.toFixed(2).split('.');
  return (
    <div className="lg:w-[280px] flex-shrink-0 space-y-4">
      <div className="border border-border rounded-lg p-5 bg-bg-primary dark:bg-bg-elevated">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-secondary">Base Fare</span>
          <span className="text-sm font-medium text-text-primary">${breakdown.subtotal.toFixed(2)} USD</span>
        </div>
        {breakdown.returnLegCost > 0 && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">Return Leg</span>
            <span className="text-sm font-medium text-text-primary">${breakdown.returnLegCost.toFixed(2)} USD</span>
          </div>
        )}
        <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
          <span className="text-sm font-bold text-text-primary">Total</span>
          <div className="flex items-baseline gap-0.5">
            <span className="text-xl font-bold text-text-primary">${totalParts[0]}</span>
            <span className="text-sm font-bold text-text-primary">.{totalParts[1]}</span>
            <span className="text-xs text-text-secondary ml-1">USD</span>
          </div>
        </div>
        {onAction && (
          <button
            onClick={onAction}
            className="w-full mt-4 py-3 bg-gold hover:bg-gold-hover text-white font-bold rounded transition-colors uppercase tracking-wider text-sm"
          >
            {buttonLabel}
          </button>
        )}
        <p className="text-[10px] text-text-secondary/60 text-center mt-3">Secure payments</p>
        <p className="text-[10px] text-text-secondary/40 text-center">Powered by <strong>Stripe</strong></p>
      </div>

      <div className="border border-border rounded-lg p-5 bg-bg-primary dark:bg-bg-elevated">
        <div className="flex items-center gap-2 flex-wrap">
          {['VISA', 'MC', 'AMEX', 'PSE'].map((brand) => (
            <div key={brand} className="px-3 py-1.5 border border-border rounded text-[10px] font-bold text-text-secondary uppercase tracking-wider">{brand}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =============== Vehicle Card =============== */
function VehicleCard({ vehicle, breakdown, onSelect }: {
  vehicle: typeof vehicles[0];
  breakdown: PricingBreakdown | null;
  onSelect: (name: string, price: number) => void;
}) {
  const price = breakdown?.total ?? 0;
  const priceParts = price.toFixed(2).split('.');

  return (
    <div className="border-b border-border pb-8 last:border-b-0 last:pb-0">
      {/* Popular badge */}
      {vehicle.popular && (
        <div className="flex items-center gap-1.5 mb-4">
          <StarIcon className="w-3.5 h-3.5 text-gold fill-gold" />
          <span className="text-xs font-semibold text-gold uppercase tracking-wider">Most Popular</span>
        </div>
      )}

      {/* Mobile: stacked layout */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-5 lg:gap-8">
        {/* Vehicle Image */}
        <div className="flex justify-center lg:justify-start lg:w-[220px] flex-shrink-0">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="w-full max-w-[280px] sm:max-w-[240px] lg:max-w-[200px] h-auto object-contain dark:drop-shadow-[0_0_20px_rgba(200,170,110,0.25)]"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-text-primary">{vehicle.category}</h3>
          <p className="text-sm text-text-secondary mt-0.5">{vehicle.description}</p>

          {/* Price — prominent on mobile */}
          <div className="mt-3 lg:hidden">
            <div className="flex items-baseline gap-0.5">
              <span className="text-3xl font-bold text-text-primary">${priceParts[0]}</span>
              <span className="text-lg font-bold text-text-primary">.{priceParts[1]}</span>
              <span className="text-sm text-text-secondary ml-1.5">USD</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs text-text-secondary">Price includes taxes, tolls & tip.</span>
            </div>
            <p className="text-[10px] text-text-secondary/50 mt-0.5">No hidden costs.</p>
          </div>

          {/* Features */}
          {vehicle.features && (
            <ul className="mt-4 space-y-2">
              {vehicle.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                  {feat.toLowerCase().includes('wifi') ? <WifiIcon className="w-4 h-4 mt-0.5 flex-shrink-0" /> :
                   feat.toLowerCase().includes('water') || feat.toLowerCase().includes('champagne') || feat.toLowerCase().includes('snack') ? <CoffeeIcon className="w-4 h-4 mt-0.5 flex-shrink-0" /> :
                   feat.toLowerCase().includes('cancellation') ? <XCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" /> :
                   <ClockIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Pricing tags */}
          {breakdown && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {breakdown.timeMultiplierValue !== 1.0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold font-medium">
                  {breakdown.timeMultiplierLabel} {breakdown.timeMultiplierValue > 1 ? `+${Math.round((breakdown.timeMultiplierValue - 1) * 100)}%` : `${Math.round((1 - breakdown.timeMultiplierValue) * 100)}% off`}
                </span>
              )}
              {breakdown.dayMultiplierValue !== 1.0 && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${breakdown.dayMultiplierValue > 1 ? 'bg-orange-500/10 text-orange-400' : 'bg-green-500/10 text-green-400'}`}>
                  {breakdown.dayMultiplierLabel} {breakdown.dayMultiplierValue > 1 ? `+${Math.round((breakdown.dayMultiplierValue - 1) * 100)}%` : `${Math.round((1 - breakdown.dayMultiplierValue) * 100)}% off`}
                </span>
              )}
              {breakdown.advanceDiscount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 font-medium">Early booking -{Math.round(breakdown.advanceDiscount * 100)}%</span>
              )}
            </div>
          )}

          {/* Capacity */}
          <div className="flex items-center gap-5 mt-4 text-text-secondary">
            <div className="flex items-center gap-1.5">
              <UsersIcon className="w-4 h-4" /><span className="text-sm">max. {vehicle.passengers}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BriefcaseIcon className="w-4 h-4" /><span className="text-sm">max. {vehicle.luggage}</span>
            </div>
          </div>

          {/* Mobile SELECT */}
          <button
            onClick={() => onSelect(vehicle.name, price)}
            className="mt-5 w-full py-3.5 bg-gold hover:bg-gold-hover text-white font-bold rounded transition-colors uppercase tracking-wider text-sm lg:hidden"
          >SELECT</button>
        </div>

        {/* Desktop: Price + SELECT on right */}
        <div className="hidden lg:flex flex-col items-end justify-between flex-shrink-0 w-[160px]">
          <div className="text-right">
            <div className="flex items-baseline gap-0.5">
              <span className="text-3xl font-bold text-text-primary">${priceParts[0]}</span>
              <span className="text-lg font-bold text-text-primary">.{priceParts[1]}</span>
              <span className="text-sm text-text-secondary ml-1">USD</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs text-text-secondary">Price includes taxes, tolls & tip.</span>
            </div>
            <p className="text-[10px] text-text-secondary/60 mt-0.5">No hidden costs.</p>
          </div>
          <button
            onClick={() => onSelect(vehicle.name, price)}
            className="mt-4 w-full px-6 py-3 bg-gold hover:bg-gold-hover text-white font-bold rounded transition-colors uppercase tracking-wider text-sm"
          >SELECT</button>
        </div>
      </div>
    </div>
  );
}

/* =============== Step 2: Vehicle Selection Content =============== */
function VehicleSelectionContent({ origin, destination, date, time, returnTrip, routeResult, onEdit, onSelect }: {
  origin: GeocodeSuggestion; destination: GeocodeSuggestion; date: string; time: string;
  returnTrip: boolean; routeResult: RouteGeometry;
  onEdit: () => void; onSelect: (name: string, price: number) => void;
}) {
  const getBreakdown = (vehicleId: number): PricingBreakdown | null => {
    return calculatePrice({ distanceKm: routeResult.distance / 1000, durationMin: routeResult.duration / 60, vehicleId, date, time, returnTrip });
  };

  return (
    <>
      <RouteSummary origin={extractCity(origin.label)} destination={extractCity(destination.label)} date={date} time={time} onEdit={onEdit} />
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <h2 className="text-xs font-semibold text-gold uppercase tracking-widest">Step 2 of 5 — Vehicle Class</h2>
          {vehicles.map((v) => <VehicleCard key={v.id} vehicle={v} breakdown={getBreakdown(v.id)} onSelect={onSelect} />)}
        </div>
        <div className="lg:w-[280px] flex-shrink-0 space-y-4">
          <div className="border border-border rounded-lg p-5 bg-bg-primary dark:bg-bg-elevated">
            <h4 className="text-sm font-bold text-text-primary mb-2">Need help?</h4>
            <p className="text-xs text-text-secondary mb-4">Our customer care team is ready to assist you.</p>
            <a href="#" className="flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-hover transition-colors mb-3">
              <MessageCircleIcon className="w-4 h-4" /> START CHAT
            </a>
            <div className="border-t border-border pt-3">
              <span className="text-xs text-text-secondary block mb-1">Call Us</span>
              <a href="tel:+573001234567" className="flex items-center gap-2 text-sm font-medium text-text-primary hover:text-gold transition-colors">
                <PhoneIcon className="w-4 h-4" /> +57 300 123 4567
              </a>
            </div>
          </div>
          <div className="border border-border rounded-lg p-5 bg-bg-primary dark:bg-bg-elevated">
            <h4 className="text-sm font-bold text-text-primary mb-3">Secure payments</h4>
            <div className="flex items-center gap-2 flex-wrap">
              {['VISA', 'MC', 'AMEX', 'PSE'].map((b) => (
                <div key={b} className="px-3 py-1.5 border border-border rounded text-[10px] font-bold text-text-secondary uppercase tracking-wider">{b}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* =============== Step 3: Login Content =============== */
function LoginContent({ origin, destination, date, time, breakdown: _breakdown, onEdit, onContinue }: {
  origin: string; destination: string; date: string; time: string;
  breakdown: PricingBreakdown; onEdit: () => void;
  onContinue: (mode: 'guest' | 'account', data: { email: string; firstName?: string; lastName?: string; phone?: string }) => void;
}) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [loginEmail, setLoginEmail] = useState('');

  return (
    <>
      <RouteSummary origin={origin} destination={destination} date={date} time={time} onEdit={onEdit} />
      <h2 className="text-xs font-semibold text-gold uppercase tracking-widest mb-6">Step 3 of 5 — Login</h2>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Continue as Guest */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-text-primary mb-6">Continue as Guest</h3>
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Email address *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className={PAGE_INPUT} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-text-secondary mb-1 block">First name *</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className={PAGE_INPUT} />
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Last name *</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" className={PAGE_INPUT} />
              </div>
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Phone *</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+57" className={PAGE_INPUT} />
            </div>
            <button
              onClick={() => onContinue('guest', { email, firstName, lastName, phone })}
              disabled={!email || !firstName || !lastName || !phone}
              className="w-full py-3 border-2 border-gold text-gold font-bold rounded transition-colors uppercase tracking-wider text-sm hover:bg-gold hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >CONTINUE AS GUEST</button>
          </div>
        </div>

        {/* Login / Create Account */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-text-primary mb-6">Login or Create account</h3>
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Email address</label>
              <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Email address" className={PAGE_INPUT} />
            </div>
            <button
              onClick={() => onContinue('account', { email: loginEmail })}
              disabled={!loginEmail}
              className="w-full py-3 bg-gold hover:bg-gold-hover text-white font-bold rounded transition-colors uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >CONTINUE</button>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-text-primary mb-3">Why do I need an account?</h4>
            <ul className="space-y-2">
              {[
                'Book rides even faster using stored account details.',
                'Modify trip details.',
                'Access invoices and payment receipts.',
                'Reporting tools.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <CheckIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

/* =============== Step 4: Booking Details Content =============== */
function BookingDetailsContent({ origin, destination, date, time, vehicleName, breakdown, onEdit, onBack, onContinue }: {
  origin: string; destination: string; date: string; time: string; vehicleName: string;
  breakdown: PricingBreakdown; onEdit: () => void; onBack: () => void;
  onContinue: (notes: string, forSomeoneElse: boolean, childSeats: boolean) => void;
}) {
  const [notes, setNotes] = useState('');
  const [forSomeoneElse, setForSomeoneElse] = useState(false);
  const [childSeats, setChildSeats] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [showPromo, setShowPromo] = useState(false);

  return (
    <>
      <RouteSummary origin={origin} destination={destination} date={date} time={time} vehicleName={vehicleName} onEdit={onEdit} />
      <h2 className="text-xs font-semibold text-gold uppercase tracking-widest mb-6">Step 4 of 5 — Booking Details</h2>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-text-primary mb-6">Additional information (Optional)</h3>
          <div className="space-y-5 max-w-xl">
            <div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes for the chauffeur"
                rows={3}
                className={PAGE_INPUT + ' resize-none'}
              />
              <p className="text-xs text-text-secondary/60 mt-1">Enter any special requests or important information for your ride, e.g. child car seats, etc.</p>
            </div>

            <label className="flex items-center gap-3 cursor-pointer py-2">
              <div className={`w-10 h-6 rounded-full transition-colors relative ${forSomeoneElse ? 'bg-gold' : 'bg-border'}`}
                onClick={() => setForSomeoneElse(!forSomeoneElse)}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${forSomeoneElse ? 'left-5' : 'left-1'}`} />
              </div>
              <span className="text-sm text-text-primary">Are you booking for someone else?</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer py-2">
              <div className={`w-10 h-6 rounded-full transition-colors relative ${childSeats ? 'bg-gold' : 'bg-border'}`}
                onClick={() => setChildSeats(!childSeats)}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${childSeats ? 'left-5' : 'left-1'}`} />
              </div>
              <span className="text-sm text-text-primary">Do you need child seats?</span>
            </label>

            <div className="flex items-center gap-3 pt-4">
              <button onClick={onBack} className="px-8 py-3 border border-border text-text-primary font-bold rounded transition-colors uppercase tracking-wider text-sm hover:bg-bg-elevated">
                <span className="flex items-center gap-2"><ArrowLeftIcon className="w-4 h-4" /> BACK</span>
              </button>
              <button
                onClick={() => onContinue(notes, forSomeoneElse, childSeats)}
                className="flex-1 py-3 bg-gold hover:bg-gold-hover text-white font-bold rounded transition-colors uppercase tracking-wider text-sm"
              >CONTINUE TO PAYMENT</button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <PriceSidebar breakdown={breakdown} buttonLabel="CONTINUE TO PAYMENT" onAction={() => onContinue(notes, forSomeoneElse, childSeats)} />
          {!showPromo ? (
            <button onClick={() => setShowPromo(true)} className="flex items-center gap-2 text-sm text-text-secondary hover:text-gold transition-colors">
              <CircleIcon className="w-4 h-4" /> Do you have a promo code?
            </button>
          ) : (
            <div className="flex gap-2">
              <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Promo code" className={PAGE_INPUT + ' flex-1'} />
              <button className="px-4 py-2 bg-gold text-white text-sm font-bold rounded">APPLY</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* =============== Step 5: Payment Content =============== */
function PaymentContent({ origin, destination, date, time, vehicleName, breakdown, onEdit, onBack, onBook }: {
  origin: string; destination: string; date: string; time: string; vehicleName: string;
  breakdown: PricingBreakdown; onEdit: () => void; onBack: () => void;
  onBook: () => void;
}) {
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [agreed, setAgreed] = useState(false);

  const canBook = cardName && cardNumber && cardExpiry && cardCvc && agreed;

  return (
    <>
      <RouteSummary origin={origin} destination={destination} date={date} time={time} vehicleName={vehicleName} onEdit={onEdit} />
      <h2 className="text-xs font-semibold text-gold uppercase tracking-widest mb-6">Step 5 of 5 — Payment Information</h2>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-text-primary mb-2">Payment information</h3>
          <p className="text-sm text-text-secondary mb-6">All transactions are secure and encrypted. Safe and secure payments powered by <strong>Stripe</strong>.</p>

          <div className="space-y-4 max-w-xl">
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Name on Card *</label>
              <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Name on Card" className={PAGE_INPUT} />
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Card Number *</label>
              <div className="relative">
                <CreditCardIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="Card number" className={PAGE_INPUT + ' pl-10'} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Expiry *</label>
                <input type="text" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="MM / YY" className={PAGE_INPUT} />
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1 block">CVC *</label>
                <input type="text" value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} placeholder="CVC" className={PAGE_INPUT} />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <LockIcon className="w-3.5 h-3.5" />
              <span>By clicking 'BOOK NOW', you agree to our <a href="/legal#terms" className="text-gold hover:underline">Terms & Conditions</a>.</span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="w-4 h-4 accent-gold" />
              <span className="text-sm text-text-primary">I agree to the Terms & Conditions</span>
            </label>

            <div className="flex items-center gap-2 flex-wrap mt-2">
              {['VISA', 'MC', 'AMEX', 'PSE'].map((b) => (
                <div key={b} className="px-3 py-1.5 border border-border rounded text-[10px] font-bold text-text-secondary uppercase tracking-wider">{b}</div>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button onClick={onBack} className="px-8 py-3 border border-border text-text-primary font-bold rounded transition-colors uppercase tracking-wider text-sm hover:bg-bg-elevated">
                <span className="flex items-center gap-2"><ArrowLeftIcon className="w-4 h-4" /> BACK</span>
              </button>
              <button
                disabled={!canBook}
                onClick={onBook}
                className="flex-1 py-3 bg-gold hover:bg-gold-hover text-white font-bold rounded transition-colors uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >BOOK NOW</button>
            </div>
          </div>
        </div>

        <PriceSidebar breakdown={breakdown} buttonLabel="BOOK NOW" onAction={canBook ? onBook : undefined} />
      </div>
    </>
  );
}


/* =============== Main BookingForm =============== */

export function BookingForm({ onRouteFound }: BookingFormProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [origin, setOrigin] = useState<GeocodeSuggestion | null>(null);
  const [destination, setDestination] = useState<GeocodeSuggestion | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [returnTrip, setReturnTrip] = useState(false);
  const [routeResult, setRouteResult] = useState<RouteGeometry | null>(null);
  const [selectedVehicleName, setSelectedVehicleName] = useState('');
  const [selectedVehiclePrice, setSelectedVehiclePrice] = useState(0);
  const [selectedBreakdown, setSelectedBreakdown] = useState<PricingBreakdown | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const canSearch = origin !== null && destination !== null && selectedDate !== '' && selectedTime !== '';

  const handleGetPrices = () => {
    if (!origin || !destination || !onRouteFound) return;
    setLoadingRoute(true);
    getDirections({ lat: origin.lat, lng: origin.lng }, { lat: destination.lat, lng: destination.lng })
      .then((route) => {
        onRouteFound(route, { lat: origin.lat, lng: origin.lng }, { lat: destination.lat, lng: destination.lng });
        setRouteResult(route);
        setStep(2);
      })
      .catch(console.error)
      .finally(() => setLoadingRoute(false));
  };

  const handleVehicleSelect = (vehicleName: string, price: number) => {
    setSelectedVehicleName(vehicleName);
    setSelectedVehiclePrice(price);
    // Find the matching vehicle and compute breakdown
    const vehicle = vehicles.find((v) => v.name === vehicleName || v.category === vehicleName);
    if (vehicle && routeResult) {
      const bd = calculatePrice({ distanceKm: routeResult.distance / 1000, durationMin: routeResult.duration / 60, vehicleId: vehicle.id, date: selectedDate, time: selectedTime, returnTrip });
      setSelectedBreakdown(bd);
    }
    setStep(3);
  };

  const handleLoginContinue = () => { setStep(4); };
  const handleDetailsContinue = () => { setStep(5); };
  const handleBook = () => {
    alert(`Booking confirmed!\n\n${selectedVehicleName}\n$${selectedVehiclePrice.toFixed(2)} USD\n\nPayment integration coming soon.`);
    setStep(1);
  };
  const handleEdit = () => { setStep(1); };

  const originCity = origin ? extractCity(origin.label) : '';
  const destCity = destination ? extractCity(destination.label) : '';

  return (
    <>
      {/* Step 1: Compact booking form (in hero) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="bg-bg-primary/90 dark:bg-bg-elevated/90 backdrop-blur-md rounded-lg shadow-xl border border-white/20 dark:border-white/10 overflow-hidden w-full max-w-md mx-auto relative z-10"
      >
        <div className="p-5 flex flex-col gap-4">
          <AddressInput label="Origin" placeholder="Pickup address" onSelect={setOrigin} />
          <AddressInput label="Destination" placeholder="Destination address" onSelect={setDestination} />
          <div>
            <label className="text-[10px] font-semibold text-gold uppercase tracking-widest mb-1 block">Pick-up Date / Time</label>
            <input type="date" min={todayStr} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className={INPUT_CLASS} />
            <AnimatePresence>
              {selectedDate !== '' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                  <input type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className={INPUT_CLASS + ' mt-2'} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <input type="checkbox" id="returnTrip" checked={returnTrip} onChange={(e) => setReturnTrip(e.target.checked)} className="w-4 h-4 rounded border-white/30 text-gold focus:ring-gold bg-white/10 checked:bg-gold accent-gold cursor-pointer" />
            <label htmlFor="returnTrip" className="text-sm text-text-secondary cursor-pointer">Add return trip</label>
          </div>
          <button disabled={loadingRoute || !canSearch} onClick={handleGetPrices} className="w-full mt-2 py-3 bg-gold hover:bg-gold-hover text-white font-medium rounded-sm transition-colors flex items-center justify-center gap-2 group animate-shimmer disabled:opacity-60 disabled:cursor-not-allowed">
            {loadingRoute ? (<><LoaderIcon className="w-4 h-4 animate-spin" /> Calculating...</>) : (<>GET PRICES <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>)}
          </button>
        </div>
      </motion.div>

      {/* Full-page overlay — stays mounted for steps 2-5, no fade between steps */}
      {step >= 2 && origin && destination && routeResult && (
        <OverlayPortal step={step} onClose={handleEdit}>
          {step === 2 && (
            <VehicleSelectionContent origin={origin} destination={destination} date={selectedDate} time={selectedTime} returnTrip={returnTrip} routeResult={routeResult} onEdit={handleEdit} onSelect={handleVehicleSelect} />
          )}
          {step === 3 && selectedBreakdown && (
            <LoginContent origin={originCity} destination={destCity} date={selectedDate} time={selectedTime} breakdown={selectedBreakdown} onEdit={handleEdit} onContinue={handleLoginContinue} />
          )}
          {step === 4 && selectedBreakdown && (
            <BookingDetailsContent origin={originCity} destination={destCity} date={selectedDate} time={selectedTime} vehicleName={selectedVehicleName} breakdown={selectedBreakdown} onEdit={handleEdit} onBack={() => setStep(3)} onContinue={handleDetailsContinue} />
          )}
          {step === 5 && selectedBreakdown && (
            <PaymentContent origin={originCity} destination={destCity} date={selectedDate} time={selectedTime} vehicleName={selectedVehicleName} breakdown={selectedBreakdown} onEdit={handleEdit} onBack={() => setStep(4)} onBook={handleBook} />
          )}
        </OverlayPortal>
      )}
    </>
  );
}
