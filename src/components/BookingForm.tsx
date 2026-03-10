import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPinIcon, ArrowRightIcon, LoaderIcon, UsersIcon, BriefcaseIcon } from 'lucide-react';
import { geocodeAutocomplete, getDirections } from '../api/openrouteservice';
import type { GeocodeSuggestion, RouteGeometry } from '../api/openrouteservice';
import { useDebounce } from '../hooks/useDebounce';
import { vehicles } from '../data/vehicles';

interface BookingFormProps {
  onRouteFound?: (
    route: RouteGeometry,
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
  ) => void;
}

const COLOMBIA_CENTER = { lat: 4.65, lng: -74.05 };

const VEHICLE_RATES: Record<number, number> = {
  1: 3.20,
  2: 2.80,
  3: 3.80,
  4: 3.50,
  5: 3.60,
  6: 4.20,
  7: 5.50,
};

const INPUT_CLASS = 'w-full bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded py-2.5 pl-3 pr-3 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all text-sm';

function extractCity(label: string): string {
  const parts = label.split(',');
  return parts[0]?.trim() || label;
}

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
          className="w-full bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded py-2.5 pl-10 pr-10 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all text-sm"
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

export function BookingForm({ onRouteFound }: BookingFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [origin, setOrigin] = useState<GeocodeSuggestion | null>(null);
  const [destination, setDestination] = useState<GeocodeSuggestion | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [returnTrip, setReturnTrip] = useState(false);
  const [routeResult, setRouteResult] = useState<RouteGeometry | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const canSearch = origin !== null && destination !== null && selectedDate !== '' && selectedTime !== '';

  const calculatePrice = (vehicleId: number): number => {
    if (!routeResult) return 0;
    const distanceKm = routeResult.distance / 1000;
    const baseFare = 5.00;
    const rate = VEHICLE_RATES[vehicleId] || 3.00;
    let nightSurcharge = 0;
    if (selectedTime) {
      const hour = parseInt(selectedTime.split(':')[0], 10);
      if (hour >= 22 || hour < 5) nightSurcharge = 10;
    }
    let total = baseFare + (distanceKm * rate) + nightSurcharge;
    if (returnTrip) total *= 2;
    return total;
  };

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

  const handleSelect = (vehicleName: string, price: number) => {
    alert(`Selected ${vehicleName} — $${price.toFixed(2)} USD. Payment integration coming soon.`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="bg-bg-primary/90 dark:bg-bg-elevated/90 backdrop-blur-md rounded-lg shadow-xl border border-white/20 dark:border-white/10 overflow-hidden w-full max-w-md mx-auto relative z-10"
    >
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="p-5 flex flex-col gap-4"
          >
            <AddressInput label="Origin" placeholder="Pickup address" onSelect={setOrigin} />
            <AddressInput label="Destination" placeholder="Destination address" onSelect={setDestination} />

            <div>
              <label className="text-[10px] font-semibold text-gold uppercase tracking-widest mb-1 block">Pick-up Date / Time</label>
              <input
                type="date"
                min={todayStr}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={INPUT_CLASS}
              />
              <AnimatePresence>
                {selectedDate !== '' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className={INPUT_CLASS + ' mt-2'}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <input
                type="checkbox"
                id="returnTrip"
                checked={returnTrip}
                onChange={(e) => setReturnTrip(e.target.checked)}
                className="w-4 h-4 rounded border-white/30 text-gold focus:ring-gold bg-white/10 checked:bg-gold accent-gold cursor-pointer"
              />
              <label htmlFor="returnTrip" className="text-sm text-text-secondary cursor-pointer">Add return trip</label>
            </div>

            <button
              disabled={loadingRoute || !canSearch}
              onClick={handleGetPrices}
              className="w-full mt-2 py-3 bg-gold hover:bg-gold-hover text-white font-medium rounded-sm transition-colors flex items-center justify-center gap-2 group animate-shimmer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingRoute ? (
                <><LoaderIcon className="w-4 h-4 animate-spin" /> Calculating...</>
              ) : (
                <>GET PRICES <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col"
          >
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold text-gold uppercase tracking-widest">Step 2 of 2 — Vehicle Class</span>
                <button
                  onClick={() => setStep(1)}
                  className="text-[11px] font-semibold text-gold uppercase tracking-wider hover:text-gold-hover transition-colors"
                >
                  EDIT
                </button>
              </div>
              <p className="text-xs text-text-secondary">
                {origin ? extractCity(origin.label) : 'Origin'}
                {' → '}
                {destination ? extractCity(destination.label) : 'Destination'}
                {' · '}
                {selectedDate} {selectedTime}
              </p>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {vehicles.map((v) => {
                const price = calculatePrice(v.id);
                return (
                  <div
                    key={v.id}
                    className="flex items-center gap-3 p-4 border-b border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <img src={v.image} alt={v.name} className="w-28 h-20 object-contain flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-text-primary">{v.name}</p>
                      <p className="text-[11px] text-text-secondary">{v.category}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-text-secondary">
                          <UsersIcon className="w-3.5 h-3.5" />
                          <span className="text-[11px]">{v.passengers}</span>
                        </div>
                        <div className="flex items-center gap-1 text-text-secondary">
                          <BriefcaseIcon className="w-3.5 h-3.5" />
                          <span className="text-[11px]">{v.luggage}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0">
                      <span className="text-lg font-bold text-gold">${price.toFixed(2)}</span>
                      <span className="text-[9px] text-text-secondary mb-1">USD</span>
                      <span className="text-[9px] text-text-secondary/70 mb-2">Price includes taxes & tolls</span>
                      <button
                        onClick={() => handleSelect(v.name, price)}
                        className="px-4 py-1.5 bg-gold hover:bg-gold-hover text-white text-[11px] font-semibold rounded-sm transition-colors uppercase tracking-wider"
                      >
                        SELECT
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
