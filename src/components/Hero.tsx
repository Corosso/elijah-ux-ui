import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingForm } from './BookingForm';
import { MapPreview } from './MapPreview';
import type { RouteGeometry } from '../api/openrouteservice';

interface HeroProps {
  isDark: boolean;
}

export function Hero({ isDark }: HeroProps) {
  const title = 'Your Personal Chauffeur Service';
  const words = title.split(' ');

  const [route, setRoute] = useState<RouteGeometry | null>(null);
  const [originCoords, setOriginCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [destCoords, setDestCoords] = useState<{ lat: number; lng: number } | null>(null);
  const showMap = route !== null;

  const handleRouteFound = useCallback(
    (r: RouteGeometry, o: { lat: number; lng: number }, d: { lat: number; lng: number }) => {
      setRoute(r);
      setOriginCoords(o);
      setDestCoords(d);
    },
    []
  );

  return (
    <section className="relative overflow-hidden bg-bg-primary">
      <div className="relative w-full min-h-[440px] flex items-center">
        {/* Background layers */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence>
            {!showMap && (
              <motion.div
                key="hero-image"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                <img src="/image.png" alt="Luxury Chauffeur Service" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showMap && (
              <motion.div
                key="hero-map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                <MapPreview isDark={isDark} route={route} origin={originCoords} destination={destCoords} />
                
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 pointer-events-none pt-20 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center py-10">
          {/* Left - Text (hidden when route is found) */}
          <AnimatePresence>
            {!showMap && (
              <motion.div
                key="hero-text"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-5 flex flex-col gap-3 pointer-events-auto"
              >
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="w-12 h-0.5 bg-gold mb-1 origin-left"
                />
                <h1 className="text-2xl md:text-3xl lg:text-[2rem] font-serif text-white leading-tight flex flex-wrap">
                  {words.map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                      className="inline-block mr-2.5 lg:mr-3 last:mr-0"
                    >
                      {word}
                    </motion.span>
                  ))}
                </h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="text-sm md:text-base text-white/75 max-w-sm leading-relaxed"
                >
                  Experience the ultimate level of luxury, privacy and comfort.
                  First-class vehicles for your most important journeys.
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Booking Form - always at right side */}
          <div className="lg:col-span-4 lg:col-start-9 relative z-20 pointer-events-auto">
            <BookingForm onRouteFound={handleRouteFound} />
          </div>
        </div>

        {/* Route Summary - small floating card, bottom-right */}
        <AnimatePresence>
          {showMap && route && (
            <motion.div
              key="route-summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="absolute bottom-6 left-6 z-20 hidden lg:block pointer-events-auto"
            >
              <div className="bg-black/60 backdrop-blur-md rounded-lg px-5 py-4 border border-white/15 min-w-[180px]">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-gold font-serif text-xl font-medium">{Math.round(route.distance / 1000)} km</div>
                    <div className="text-white/60 text-[10px] uppercase tracking-wider">Distance</div>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div className="text-center">
                    <div className="text-gold font-serif text-xl font-medium">{Math.round(route.duration / 60)} min</div>
                    <div className="text-white/60 text-[10px] uppercase tracking-wider">Duration</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile-only map */}
      {showMap && (
        <div className="lg:hidden px-4 sm:px-6 py-6 bg-bg-primary">
          <div className="h-[200px] rounded-lg overflow-hidden shadow-lg border border-border">
            <MapPreview isDark={isDark} route={route} origin={originCoords} destination={destCoords} />
          </div>
        </div>
      )}
      {/* Scroll indicator */}
      <div className="h-12 bg-gradient-to-b from-transparent to-bg-primary relative z-10 pointer-events-auto" />
    </section>
  );
}
