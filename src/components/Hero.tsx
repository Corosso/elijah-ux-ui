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
  const [mobileFormHeight, setMobileFormHeight] = useState(0);
  const mobileFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mobileFormRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setMobileFormHeight(entry.contentRect.height);
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
    <section className="relative bg-bg-primary pt-16 sm:pt-20 pb-[5vw]">
      {/* Desktop: contained map with form overlay */}
      <div className="hidden lg:block max-w-6xl mx-auto px-6 xl:px-8">
        <div className="relative rounded-xl overflow-hidden shadow-luxury dark:shadow-luxury-dark" style={{ height: '460px' }}>
          <div className="absolute inset-0 z-0">
            <MapPreview
              isDark={isDark}
              route={route}
              origin={originCoords}
              destination={destCoords}
              topOffset={0}
            />
          </div>
          {/* Form card overlaying top-right */}
          <div className="absolute top-4 right-4 bottom-4 z-10 w-full max-w-md">
            <BookingForm onRoutePreview={handleRoutePreview} />
          </div>
        </div>
      </div>

      {/* Mobile: stacked layout */}
      <div className="lg:hidden relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <MapPreview
            isDark={isDark}
            route={route}
            origin={originCoords}
            destination={destCoords}
            topOffset={mobileFormHeight}
          />
        </div>
        <div
          className="absolute inset-x-0 top-0 z-[1] pointer-events-none"
          style={{ height: `${mobileFormHeight + 72}px` }}
        >
          <div className="w-full h-full" style={{
            background: isDark
              ? 'linear-gradient(to bottom, #0A0A0A 80%, transparent 100%)'
              : 'linear-gradient(to bottom, #FFFFFF 80%, transparent 100%)'
          }} />
        </div>
        <div className="relative z-[2] px-3 sm:px-6 w-full">
          <div className="w-full max-w-sm sm:max-w-md mx-auto py-4 sm:py-6">
            <div ref={mobileFormRef}>
              <BookingForm onRoutePreview={handleRoutePreview} />
            </div>
          </div>
          <div className="h-[220px] sm:h-[260px]" />
        </div>
      </div>
    </section>
  );
}
