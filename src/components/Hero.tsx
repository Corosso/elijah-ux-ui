import { useState, useCallback, useRef, useEffect } from 'react';
import { BookingForm } from './BookingForm';
import { MapPreview } from './MapPreview';
import type { RouteGeometry } from '../api/googleMaps';

interface HeroProps {
  isDark: boolean;
}

export function Hero({ isDark }: HeroProps) {
  const [route, setRoute] = useState<RouteGeometry | null>(null);
  const [originCoords, setOriginCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [destCoords, setDestCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [formHeight, setFormHeight] = useState(0);
  const formRef = useRef<HTMLDivElement>(null);

  // Track form height changes (fields animate in/out)
  useEffect(() => {
    const el = formRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setFormHeight(entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleRoutePreview = useCallback(
    (r: RouteGeometry | null, o: { lat: number; lng: number } | null, d: { lat: number; lng: number } | null) => {
      setRoute(r);
      setOriginCoords(o);
      setDestCoords(d);
    },
    []
  );

  return (
    <section className="relative overflow-hidden bg-bg-primary pt-14 sm:pt-16">
      {/* Map covers entire hero */}
      <div className="absolute inset-0 z-0">
        <MapPreview
          isDark={isDark}
          route={route}
          origin={originCoords}
          destination={destCoords}
          topOffset={formHeight}
        />
        {isDark && <div className="absolute inset-0 bg-black/20 pointer-events-none" />}
      </div>

      {/* Mobile: gradient overlay hides map behind form, reveals it below */}
      <div
        className="absolute inset-x-0 top-0 z-[1] pointer-events-none lg:hidden"
        style={{ height: `${formHeight + 72}px` }}
      >
        <div className="w-full h-full" style={{
          background: isDark
            ? 'linear-gradient(to bottom, #0A0A0A 80%, transparent 100%)'
            : 'linear-gradient(to bottom, #FDFCFA 80%, transparent 100%)'
        }} />
      </div>

      <div className="relative z-[2] max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row lg:justify-end lg:items-center lg:min-h-[480px] py-4 sm:py-10">
          {/* Booking form */}
          <div ref={formRef} className="w-full max-w-sm sm:max-w-md mx-auto lg:mx-0">
            <BookingForm onRoutePreview={handleRoutePreview} />
          </div>

          {/* Mobile: visible map area below form */}
          <div className="lg:hidden h-[250px] sm:h-[280px]" />
        </div>
      </div>
    </section>
  );
}
