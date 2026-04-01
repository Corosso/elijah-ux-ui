import { motion } from 'framer-motion';
import { ChevronRightIcon } from 'lucide-react';
import { routes } from '../data';
import { reveal, drift, staggerScaleIn, hoverLift, viewport } from '../utils/motion';

export function CitiesSection() {
  const grid = staggerScaleIn(0.08);
  return (
    <section
      id="cities"
      className="relative pt-[calc(5vw+2rem)] pb-[calc(5vw+2rem)] md:pt-[calc(5vw+3rem)] md:pb-[calc(5vw+2.5rem)] bg-bg-surface -mt-[5vw] [clip-path:polygon(0_5vw,100%_0,100%_100%,0_100%)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Centered header like Ridelux */}
        <div className="text-center mb-8 md:mb-12">
          <motion.span
            initial={drift.hidden}
            whileInView={drift.visible}
            viewport={viewport.once}
            className="text-gold text-eyebrow mb-3 block"
          >
            Popular Routes
          </motion.span>
          <motion.h2
            initial={reveal.hidden}
            whileInView={reveal.visible}
            viewport={viewport.once}
            transition={{ delay: 0.1 }}
            className="text-heading-md-fluid font-serif text-text-primary mb-3"
          >
            Intercity Rides
          </motion.h2>
          <motion.p
            initial={drift.hidden}
            whileInView={drift.visible}
            viewport={viewport.once}
            transition={{ delay: 0.2 }}
            className="text-text-secondary text-caption max-w-lg mx-auto"
          >
            Skip the airport lines, drop the station crowds. Ride your personal intercity car.
          </motion.p>
        </div>

        <motion.div
          variants={grid.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
        >
          {routes.map((route, index) => (
            <motion.div
              key={index}
              variants={grid.item}
              whileHover={hoverLift}
              className="group relative h-28 md:h-32 rounded-lg overflow-hidden cursor-pointer bg-black"
            >
              <img
                src={route.image}
                alt={`${route.origin} to ${route.dest}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 w-full p-4 z-10">
                <div className="flex items-center gap-2 text-white text-body font-serif mb-0.5">
                  <span>{route.origin}</span>
                  <ChevronRightIcon className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>{route.dest}</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-caption font-medium">
                  <span>{route.dist}</span>
                  <span className="text-gold">|</span>
                  <span>{route.time}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
