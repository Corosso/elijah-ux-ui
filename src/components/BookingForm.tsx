import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPinIcon, CalendarIcon, ArrowRightIcon, LoaderIcon, CarIcon, UsersIcon, ChevronDownIcon } from 'lucide-react';
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
    geocodeAutocomplete(debouncedText, { lat: 4.65, lng: -74.05 })
      .then((r) => { if (!cancelled) { setSuggestions(r); setIsOpen(r.length > 0); } })
      .catch(() => { if (!cancelled) setSuggestions([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [debouncedText, selected]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
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

interface FareEstimate {
  baseFare: number;
  distanceFare: number;
  vehicleSurcharge: number;
  timeSurcharge: number;
  total: number;
  currency: string;
  distanceKm: number;
}

var vehicleRates: Record<number, number> = {
  1: 3.20,
  2: 2.80,
  3: 3.80,
  4: 3.50,
  5: 3.60,
  6: 4.20,
  7: 5.50,
};

export function BookingForm({ onRouteFound }: BookingFormProps) {
  const [activeTab, setActiveTab] = useState<'point' | 'hourly'>('point');
  const [origin, setOrigin] = useState<GeocodeSuggestion | null>(null);
  const [destination, setDestination] = useState<GeocodeSuggestion | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [returnTrip, setReturnTrip] = useState(false);
  const [fareEstimate, setFareEstimate] = useState<FareEstimate | null>(null);

  var todayStr = new Date().toISOString().split('T')[0];

  var inputCls = 'w-full bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded py-2.5 pl-3 pr-3 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all text-sm';

  var handleGetPrices = function () {
    if (!origin || !destination || !onRouteFound) return;
    setLoadingRoute(true);
    getDirections({ lat: origin.lat, lng: origin.lng }, { lat: destination.lat, lng: destination.lng })
      .then(function (route) {
        onRouteFound(route, { lat: origin.lat, lng: origin.lng }, { lat: destination.lat, lng: destination.lng });

        var distanceKm = route.distance / 1000;
        var baseFare = 5.00;
        var rate = selectedVehicle !== null && vehicleRates[selectedVehicle] ? vehicleRates[selectedVehicle] : 3.00;
        var distanceFare = distanceKm * rate;

        var timeSurcharge = 0;
        if (selectedTime) {
          var hour = parseInt(selectedTime.split(':')[0], 10);
          if (hour >= 22 || hour < 6) {
            timeSurcharge = 10;
          }
        }

        var vehicleSurcharge = 0;
        var total = baseFare + distanceFare + timeSurcharge;
        if (returnTrip) {
          total = total * 2;
        }

        setFareEstimate({
          baseFare: baseFare,
          distanceFare: distanceFare,
          vehicleSurcharge: vehicleSurcharge,
          timeSurcharge: timeSurcharge,
          total: total,
          currency: 'USD',
          distanceKm: distanceKm,
        });
      })
      .catch(console.error)
      .finally(function () { setLoadingRoute(false); });
  };

  var canSearch = origin !== null && destination !== null && selectedDate !== '' && selectedTime !== '' && selectedVehicle !== null;

  var isPointActive = activeTab === 'point';
  var isHourlyActive = activeTab === 'hourly';
  var activeCls = 'flex-1 py-4 text-sm font-medium transition-colors relative text-gold';
  var inactiveCls = 'flex-1 py-4 text-sm font-medium transition-colors relative text-text-secondary hover:text-text-primary';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="bg-bg-primary/90 dark:bg-bg-elevated/90 backdrop-blur-md rounded-lg shadow-xl border border-white/20 dark:border-white/10 overflow-hidden w-full max-w-md mx-auto relative z-10"
    >
      <div className="flex border-b border-border relative">
        <button onClick={function () { setActiveTab('point'); }} className={isPointActive ? activeCls : inactiveCls}>
          Point to Point
          {isPointActive && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
        </button>
        <button onClick={function () { setActiveTab('hourly'); }} className={isHourlyActive ? activeCls : inactiveCls}>
          By the Hour
          {isHourlyActive && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
        </button>
      </div>
      <div className="p-5 flex flex-col gap-4">
        <AddressInput label="Origin" placeholder="Pickup address" onSelect={setOrigin} />
        <AddressInput label="Destination" placeholder="Destination address" onSelect={setDestination} />

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-semibold text-gold uppercase tracking-widest mb-1 block">Date</label>
            <input
              type="date"
              min={todayStr}
              value={selectedDate}
              onChange={function (e) { setSelectedDate(e.target.value); }}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-gold uppercase tracking-widest mb-1 block">Time</label>
            <input
              type="time"
              value={selectedTime}
              onChange={function (e) { setSelectedTime(e.target.value); }}
              className={inputCls}
            />
          </div>
        </div>

        {/* Vehicle Selector */}
        <div>
          <label className="text-[10px] font-semibold text-gold uppercase tracking-widest mb-1 block">Vehicle</label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
            {vehicles.map(function (v) {
              var isSelected = selectedVehicle === v.id;
              var rate = vehicleRates[v.id] || 3.00;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={function () { setSelectedVehicle(v.id); }}
                  className={
                    'flex flex-col items-center p-2 rounded border transition-all text-xs ' +
                    (isSelected
                      ? 'border-gold bg-gold/10'
                      : 'border-white/20 bg-white/5 hover:border-white/40')
                  }
                >
                  <img src={v.image} alt={v.name} className="h-12 object-contain mb-1" />
                  <span className="text-text-primary font-medium text-[11px] leading-tight text-center">{v.name}</span>
                  <span className="text-text-secondary text-[9px]">{v.category}</span>
                  <div className="flex items-center gap-1 mt-0.5 text-text-secondary">
                    <UsersIcon className="w-3 h-3" />
                    <span className="text-[9px]">{v.passengers}</span>
                  </div>
                  <span className="text-gold text-[10px] font-semibold mt-0.5">{'$' + rate.toFixed(2) + '/km'}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Return trip checkbox */}
        <div className="flex items-center gap-2 mt-1">
          <input
            type="checkbox"
            id="returnTrip"
            checked={returnTrip}
            onChange={function (e) { setReturnTrip(e.target.checked); }}
            className="w-4 h-4 rounded border-white/30 text-gold focus:ring-gold bg-white/10 checked:bg-gold accent-gold cursor-pointer"
          />
          <label htmlFor="returnTrip" className="text-sm text-text-secondary cursor-pointer">Add return trip</label>
        </div>

        {/* GET PRICES button */}
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

        {/* Fare Estimate */}
        <AnimatePresence>
          {fareEstimate !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 border border-white/20 rounded-lg p-4"
            >
              <h4 className="text-gold font-semibold text-sm mb-3">Estimated Fare</h4>
              <div className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>Base fare</span>
                  <span>{'$' + fareEstimate.baseFare.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>{'Distance (' + fareEstimate.distanceKm.toFixed(1) + ' km)'}</span>
                  <span>{'$' + fareEstimate.distanceFare.toFixed(2)}</span>
                </div>
                {fareEstimate.timeSurcharge > 0 && (
                  <div className="flex justify-between text-text-secondary">
                    <span>Night surcharge</span>
                    <span>{'$' + fareEstimate.timeSurcharge.toFixed(2)}</span>
                  </div>
                )}
                {returnTrip && (
                  <div className="flex justify-between text-text-secondary">
                    <span>Return trip</span>
                    <span>x2</span>
                  </div>
                )}
                <div className="border-t border-white/20 my-1" />
                <div className="flex justify-between items-center">
                  <span className="text-text-primary font-bold text-base">Total</span>
                  <span className="text-gold font-bold text-lg">{'$' + fareEstimate.total.toFixed(2) + ' USD'}</span>
                </div>
              </div>
              <p className="text-[10px] text-text-secondary/70 mt-2">Final price may vary. Tolls not included.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
