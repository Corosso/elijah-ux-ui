import { useState, useCallback } from 'react';
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

  const handleRouteFound = useCallback(
    (r: RouteGeometry, o: { lat: number; lng: number }, d: { lat: number; lng: number }) => {
      setRoute(r);
      setOriginCoords(o);
      setDestCoords(d);
    },
    []
  );

  return (
    <section className="relative overflow-hidden bg-bg-primary pt-16">
      <div className="relative w-full min-h-[480px] flex items-center">
        {/* Map always visible as background */}
        <div className="absolute inset-0 z-0">
          <MapPreview isDark={isDark} route={route} origin={originCoords} destination={destCoords} />
          {/* Subtle overlay only in dark mode for contrast */}
          {isDark && <div className="absolute inset-0 bg-black/20 pointer-events-none" />}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 pointer-events-none flex justify-end items-center py-10">
          {/* Booking Form - right side */}
          <div className="w-full max-w-md relative z-20 pointer-events-auto">
            <BookingForm onRouteFound={handleRouteFound} />
          </div>
        </div>
      </div>
    </section>
  );
}
