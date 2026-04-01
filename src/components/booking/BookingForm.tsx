import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightIcon, LoaderIcon } from 'lucide-react';
import { getDirections } from '../../api/googleMaps';
import type { GeocodeSuggestion, RouteGeometry } from '../../api/googleMaps';
import { HOURLY_MIN, HOURLY_MAX } from '../../utils/pricing';
import type { PricingBreakdown, ServiceMode } from '../../utils/pricing';
import { DateTimePicker } from '../DateTimePicker';
import { extractCity } from './constants';
import { AddressInput } from './AddressInput';
import { OverlayPortal } from './OverlayPortal';
import { VehicleSelectionContent } from './VehicleSelectionContent';
import { LoginContent } from './LoginContent';
import { BookingDetailsContent } from './BookingDetailsContent';
import { PaymentContent } from './PaymentContent';

interface BookingFormProps {
  onRoutePreview?: (
    route: RouteGeometry | null,
    origin: { lat: number; lng: number } | null,
    destination: { lat: number; lng: number } | null
  ) => void;
}

export function BookingForm({ onRoutePreview }: BookingFormProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [serviceMode, setServiceMode] = useState<ServiceMode>('point-to-point');
  const [origin, setOrigin] = useState<GeocodeSuggestion | null>(null);
  const [destination, setDestination] = useState<GeocodeSuggestion | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [returnTrip, setReturnTrip] = useState(false);
  const [selectedHours, setSelectedHours] = useState(HOURLY_MIN);
  const [routeResult, setRouteResult] = useState<RouteGeometry | null>(null);
  const [selectedVehicleName, setSelectedVehicleName] = useState('');
  const [routeError, setRouteError] = useState('');
  const [selectedBreakdown, setSelectedBreakdown] = useState<PricingBreakdown | null>(null);

  const isHourly = serviceMode === 'hourly';
  const todayStr = new Date().toISOString().split('T')[0];
  const canSearch = isHourly
    ? origin !== null && selectedDate !== '' && selectedTime !== ''
    : origin !== null && destination !== null && selectedDate !== '' && selectedTime !== '';

  // Fetch and preview route on map as soon as both points are selected
  useEffect(() => {
    if (!origin || !destination || isHourly) {
      if (routeResult) {
        setRouteResult(null);
        onRoutePreview?.(null, null, null);
      }
      return;
    }
    let cancelled = false;
    setRouteError('');
    setLoadingRoute(true);
    getDirections({ lat: origin.lat, lng: origin.lng }, { lat: destination.lat, lng: destination.lng })
      .then((route) => {
        if (cancelled) return;
        setRouteResult(route);
        onRoutePreview?.(route, { lat: origin.lat, lng: origin.lng }, { lat: destination.lat, lng: destination.lng });
      })
      .catch(() => { if (!cancelled) { console.error('Route fetch failed'); setRouteError('Could not calculate route. Please check your addresses.'); setLoadingRoute(false); } })
      .finally(() => { if (!cancelled) setLoadingRoute(false); });
    return () => { cancelled = true; };
  }, [origin, destination, isHourly]);

  const handleGetPrices = () => {
    if (!origin) return;
    if (!isHourly && (!destination || !routeResult)) return;
    setStep(2);
  };

  const handleVehicleSelect = (vehicleName: string, breakdown: PricingBreakdown) => {
    setSelectedVehicleName(vehicleName);
    setSelectedBreakdown(breakdown);
    setStep(3);
  };

  const handleLoginContinue = () => { setStep(4); };
  const handleDetailsContinue = () => { setStep(5); };
  const handleBook = () => {
    alert(`Booking confirmed!\n\n${selectedVehicleName}\n$${selectedBreakdown?.total.toFixed(2)} USD\n\nPayment integration coming soon.`);
    setStep(1);
  };
  const handleEdit = () => { setStep(1); };

  const originCity = origin ? extractCity(origin.label) : '';
  const destCity = isHourly
    ? `${selectedHours} hour${selectedHours !== 1 ? 's' : ''} — By the Hour`
    : destination ? extractCity(destination.label) : '';

  return (
    <>
      {/* Step 1: Compact booking form (in hero) */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 0.68, 0, 1], delay: 0.3 }}
        className="bg-bg-primary/90 dark:bg-bg-elevated/90 backdrop-blur-md rounded-lg shadow-xl border border-white/20 dark:border-white/10 overflow-hidden w-full max-w-sm sm:max-w-md mx-auto relative z-10"
      >
        <div className="p-4 sm:p-5 flex flex-col gap-3 sm:gap-4">
          {/* Service mode toggle */}
          <div className="flex rounded overflow-hidden border border-black/15 dark:border-white/10">
            <button
              onClick={() => { setServiceMode('point-to-point'); setReturnTrip(false); }}
              className={`flex-1 py-2 text-eyebrow-sm transition-colors ${!isHourly ? 'bg-gold text-white' : 'bg-black/5 dark:bg-white/5 text-text-secondary hover:text-text-primary'}`}
            >Point to Point</button>
            <button
              onClick={() => { setServiceMode('hourly'); setReturnTrip(false); }}
              className={`flex-1 py-2 text-eyebrow-sm transition-colors ${isHourly ? 'bg-gold text-white' : 'bg-black/5 dark:bg-white/5 text-text-secondary hover:text-text-primary'}`}
            >By the Hour</button>
          </div>

          <AddressInput label="Origin" placeholder="Pickup address" onSelect={setOrigin} />

          <AnimatePresence mode="wait">
            {isHourly ? (
              <motion.div key="hourly" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                <label className="text-eyebrow-sm text-gold mb-1 block">Duration</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={HOURLY_MIN}
                    max={HOURLY_MAX}
                    value={selectedHours}
                    onChange={(e) => setSelectedHours(Number(e.target.value))}
                    className="flex-1 accent-gold"
                  />
                  <span className="text-caption font-semibold text-text-primary w-16 text-center">{selectedHours} hr{selectedHours !== 1 ? 's' : ''}</span>
                </div>
              </motion.div>
            ) : (
              <motion.div key="destination" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                <AddressInput label="Destination" placeholder="Destination address" onSelect={setDestination} />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="text-eyebrow-sm text-gold mb-1 block">Pick-up Date / Time</label>
            <DateTimePicker
              date={selectedDate}
              time={selectedTime}
              onDateChange={setSelectedDate}
              onTimeChange={setSelectedTime}
              minDate={todayStr}
            />
          </div>

          {!isHourly && (
            <div className="flex items-center gap-2 mt-1">
              <input type="checkbox" id="returnTrip" checked={returnTrip} onChange={(e) => setReturnTrip(e.target.checked)} className="w-4 h-4 rounded border-white/30 text-gold focus:ring-gold bg-white/10 checked:bg-gold accent-gold cursor-pointer" />
              <label htmlFor="returnTrip" className="text-caption text-text-secondary cursor-pointer">Add return trip</label>
            </div>
          )}

          {routeError && <p className="text-micro text-red-500">{routeError}</p>}

          <button disabled={loadingRoute || !canSearch} onClick={handleGetPrices} className="w-full mt-1 sm:mt-2 py-2.5 sm:py-3 bg-gold hover:bg-gold-hover text-white text-caption font-medium rounded-sm active:scale-[0.97] transition-all flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed">
            {loadingRoute ? (<><LoaderIcon className="w-4 h-4 animate-spin" /> Calculating...</>) : (<>GET PRICES <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>)}
          </button>
        </div>
      </motion.div>

      {/* Full-page overlay — stays mounted for steps 2-5, no fade between steps */}
      {step >= 2 && origin && (isHourly || (destination && routeResult)) && (
        <OverlayPortal step={step} onClose={handleEdit}>
          {step === 2 && (
            <VehicleSelectionContent origin={origin} destination={destination} date={selectedDate} time={selectedTime} serviceMode={serviceMode} returnTrip={returnTrip} routeResult={routeResult} hours={selectedHours} onEdit={handleEdit} onSelect={handleVehicleSelect} />
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
