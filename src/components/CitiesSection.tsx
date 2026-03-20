import { motion } from 'framer-motion';
import { ChevronRightIcon } from 'lucide-react';
import { routes } from '../data';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export function CitiesSection() {
  return (
    <section
      id="cities"
      className="relative pt-[calc(5vw+2rem)] pb-[calc(5vw+2rem)] md:pt-[calc(5vw+3rem)] md:pb-[calc(5vw+2.5rem)] bg-bg-surface dark:bg-[#1A1A1A] -mt-[5vw] [clip-path:polygon(0_5vw,100%_0,100%_100%,0_100%)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Centered header like Ridelux */}
        <div className="text-center mb-8 md:mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-3 block"
          >
            Popular Routes
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-4xl font-serif text-text-primary mb-3"
          >
            Intercity Rides
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-text-secondary text-sm max-w-lg mx-auto"
          >
            Skip the airport lines, drop the station crowds. Ride your personal intercity car.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
        >
          {routes.map((route, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
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
                <div className="flex items-center gap-2 text-white text-sm md:text-base font-serif mb-0.5">
                  <span>{route.origin}</span>
                  <ChevronRightIcon className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>{route.dest}</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-xs font-medium">
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
