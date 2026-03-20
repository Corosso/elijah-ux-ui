import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { UsersIcon, BriefcaseIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { vehicles } from '../data';

const AUTO_PLAY_MS = 4000;

export function FleetSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i === 0 ? vehicles.length - 1 : i - 1));
  }, []);
  const next = useCallback(() => {
    setCurrentIndex((i) => (i === vehicles.length - 1 ? 0 : i + 1));
  }, []);

  // Auto-play
  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, AUTO_PLAY_MS);
    return () => clearInterval(id);
  }, [paused, next]);

  const currentVehicle = vehicles[currentIndex];

  const slideWidthPercent = 33.333;
  const trackWidthPercent = vehicles.length * slideWidthPercent;

  return (
    <section
      id="fleet"
      className="relative pt-[calc(5vw+2rem)] pb-[calc(5vw+2rem)] md:pt-[calc(5vw+3rem)] md:pb-[calc(5vw+2.5rem)] bg-white dark:bg-[#111111] -mt-[5vw] [clip-path:polygon(0_5vw,100%_0,100%_100%,0_100%)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 md:mb-6 pt-4">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2 block"
          >
            Our Fleet
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-4xl font-serif text-text-primary mb-2"
          >
            Comfort, privacy and luxury.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-text-secondary max-w-2xl mx-auto text-xs md:text-sm"
          >
            Experience the ultimate private chauffeur service. Encounter every
            destination in our top-of-the-line vehicles, where high end luxury
            meets safe, private and reliable journeys; just what the upscale
            modern day passenger needs.
          </motion.p>
        </div>
      </div>

      {/* Full-bleed Carousel */}
      <div className="relative">
        <button
          onClick={prev}
          className="absolute left-2 sm:left-6 lg:left-12 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 dark:bg-bg-elevated/90 backdrop-blur-sm border border-border shadow-lg flex items-center justify-center text-text-secondary hover:text-gold hover:border-gold/50 transition-all group"
          aria-label="Previous vehicle"
        >
          <ChevronLeftIcon className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <button
          onClick={next}
          className="absolute right-2 sm:right-6 lg:right-12 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 dark:bg-bg-elevated/90 backdrop-blur-sm border border-border shadow-lg flex items-center justify-center text-text-secondary hover:text-gold hover:border-gold/50 transition-all group"
          aria-label="Next vehicle"
        >
          <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <div className="overflow-hidden w-full">
          <motion.div
            className="flex items-center"
            animate={{
              x: `calc(50vw - ${slideWidthPercent / 2}vw - ${currentIndex * slideWidthPercent}vw)`,
            }}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            style={{ width: `${trackWidthPercent}vw` }}
          >
            {vehicles.map((vehicle, i) => (
              <div
                key={vehicle.id}
                className="flex-shrink-0 px-3 lg:px-6"
                style={{ width: `${slideWidthPercent}vw` }}
              >
                <motion.div
                  animate={{
                    scale: i === currentIndex ? 1 : 0.78,
                    opacity: i === currentIndex ? 1 : 0.35,
                  }}
                  transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                  className="cursor-pointer"
                  onClick={() => setCurrentIndex(i)}
                >
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-auto object-contain mx-auto dark:drop-shadow-[0_0_30px_rgba(212,175,55,0.3)] dark:brightness-110"
                  />
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mt-2">
          <h3 className="text-xl md:text-2xl font-serif text-text-primary mb-0.5">
            {currentVehicle.category}
          </h3>
          <p className="text-xs text-text-secondary mb-2">
            {currentVehicle.description}
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-text-secondary">
            <div className="flex items-center gap-1.5">
              <UsersIcon className="w-3.5 h-3.5" />
              <span>max. {currentVehicle.passengers}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BriefcaseIcon className="w-3.5 h-3.5" />
              <span>max. {currentVehicle.luggage}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {vehicles.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex
                ? 'bg-gold w-6'
                : 'bg-border hover:bg-text-secondary'
                }`}
              aria-label={`Go to vehicle ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
