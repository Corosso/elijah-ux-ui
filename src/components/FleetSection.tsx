import { useState } from 'react';
import { motion } from 'framer-motion';
import { UsersIcon, BriefcaseIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const vehicles = [
  {
    id: 1,
    name: 'Mercedes-Benz S-Class',
    category: 'First Class',
    description: 'Mercedes S550 or similar',
    passengers: 3,
    luggage: 3,
    image: '/flota/mercedes-s-class.png',
  },
  {
    id: 2,
    name: 'Cadillac XTS',
    category: 'Business Sedan',
    description: 'Cadillac XTS or similar',
    passengers: 3,
    luggage: 3,
    image: '/flota/cadillac-xts.png',
  },
  {
    id: 3,
    name: 'Cadillac Escalade',
    category: 'SUV',
    description: 'Cadillac Escalade or similar',
    passengers: 6,
    luggage: 6,
    image: '/flota/cadillac-escalade.png',
  },
  {
    id: 4,
    name: 'Chevrolet Suburban',
    category: 'SUV',
    description: 'Chevrolet Suburban or similar',
    passengers: 6,
    luggage: 6,
    image: '/flota/chevy-suv.png',
  },
  {
    id: 5,
    name: 'Tesla Model X',
    category: 'Electric Class',
    description: 'Tesla Model X or similar',
    passengers: 4,
    luggage: 3,
    image: '/flota/tesla-model-x.png',
  },
  {
    id: 6,
    name: 'Mercedes-Benz Sprinter',
    category: 'Executive Van',
    description: 'Mercedes Sprinter or similar',
    passengers: 12,
    luggage: 12,
    image: '/flota/mercedes-sprinter.png',
  },
  {
    id: 7,
    name: 'Lincoln Stretch Limousine',
    category: 'Limousine',
    description: 'Lincoln Stretch Limo or similar',
    passengers: 8,
    luggage: 4,
    image: '/flota/lincoln-stretch-limousine.png',
  },
];

export function FleetSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((i) => (i === 0 ? vehicles.length - 1 : i - 1));
  };
  const next = () => {
    setCurrentIndex((i) => (i === vehicles.length - 1 ? 0 : i + 1));
  };

  const currentVehicle = vehicles[currentIndex];
  // Clamp so active vehicle stays centered (except at edges)
  const slideOffset = Math.max(0, Math.min(currentIndex - 1, vehicles.length - 3));

  return (
    <section
      id="fleet"
      className="relative py-16 md:py-24 bg-white dark:bg-bg-surface"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-3 block"
          >
            Our Fleet
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-4xl font-serif text-text-primary mb-4"
          >
            Comfort, privacy and luxury.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-text-secondary max-w-2xl mx-auto text-sm md:text-base"
          >
            Experience the ultimate private chauffeur service. Reach every
            destination in our top-of-the-line vehicles.
          </motion.p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prev}
            className="absolute left-0 md:-left-2 top-[45%] -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 dark:bg-bg-surface-elevated/80 backdrop-blur-sm border border-border shadow-lg flex items-center justify-center text-text-secondary hover:text-gold hover:border-gold/50 transition-all group"
            aria-label="Previous vehicle"
          >
            <ChevronLeftIcon className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 md:-right-2 top-[45%] -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 dark:bg-bg-surface-elevated/80 backdrop-blur-sm border border-border shadow-lg flex items-center justify-center text-text-secondary hover:text-gold hover:border-gold/50 transition-all group"
            aria-label="Next vehicle"
          >
            <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Sliding Track */}
          <div className="overflow-hidden mx-2 md:mx-14">
            {/* Mobile: 1 vehicle at a time */}
            <motion.div
              className="flex md:hidden"
              animate={{ x: `${-currentIndex * (100 / vehicles.length)}%` }}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              style={{ width: `${vehicles.length * 100}%` }}
            >
              {vehicles.map((vehicle, i) => (
                <div
                  key={vehicle.id}
                  className="px-4"
                  style={{ width: `${100 / vehicles.length}%` }}
                >
                  <div
                    className={`transition-all duration-500 ${
                      i === currentIndex
                        ? 'opacity-100 scale-100'
                        : 'opacity-50 scale-[0.92]'
                    }`}
                  >
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-64 md:h-64 lg:h-72 object-contain cursor-pointer"
                      onClick={() => setCurrentIndex(i)}
                    />
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Desktop: 3 vehicles at a time */}
            <motion.div
              className="hidden md:flex"
              animate={{ x: `${-slideOffset * (100 / vehicles.length)}%` }}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              style={{ width: `${(vehicles.length * 100) / 3}%` }}
            >
              {vehicles.map((vehicle, i) => (
                <div
                  key={vehicle.id}
                  className="px-6"
                  style={{ width: `${100 / vehicles.length}%` }}
                >
                  <div
                    className={`transition-all duration-500 ${
                      i === currentIndex
                        ? 'opacity-100 scale-100'
                        : 'opacity-50 scale-[0.92]'
                    }`}
                  >
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-64 lg:h-72 object-contain cursor-pointer"
                      onClick={() => setCurrentIndex(i)}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Vehicle Info (below carousel) */}
          <div className="text-center mt-6">
            <h3 className="text-xl md:text-2xl font-serif text-text-primary mb-1">
              {currentVehicle.category}
            </h3>
            <p className="text-sm text-text-secondary mb-3">
              {currentVehicle.description}
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-text-secondary">
              <div className="flex items-center gap-1.5">
                <UsersIcon className="w-4 h-4" />
                <span>max. {currentVehicle.passengers}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BriefcaseIcon className="w-4 h-4" />
                <span>max. {currentVehicle.luggage}</span>
              </div>
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-6">
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
      </div>
    </section>
  );
}
