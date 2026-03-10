import { motion } from 'framer-motion';
import { ChevronRightIcon, ArrowRightIcon } from 'lucide-react';
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
      className="relative pt-44 pb-32 md:pt-52 md:pb-48 bg-bg-surface -mt-20 [clip-path:polygon(0_5rem,100%_0,100%_100%,0_100%)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-6">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gold text-sm font-semibold tracking-[0.2em] uppercase mb-4 block"
            >
              Popular Routes
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl font-serif text-text-primary"
            >
              Cities We Serve
            </motion.h2>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {routes.map((route, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative h-64 rounded-xl overflow-hidden cursor-pointer bg-black shadow-luxury dark:shadow-luxury-dark"
            >
              <img
                src={route.image}
                alt={`${route.origin} to ${route.dest}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 w-full p-6 z-10 transform transition-transform duration-500 group-hover:-translate-y-2">
                <div className="flex items-center gap-3 text-white text-xl md:text-2xl font-serif mb-2">
                  <span>{route.origin}</span>
                  <ChevronRightIcon className="w-5 h-5 text-gold flex-shrink-0" />
                  <span>{route.dest}</span>
                </div>
                <div className="flex items-center gap-3 text-white/80 text-sm font-medium">
                  <span>{route.dist}</span>
                  <span className="text-gold">|</span>
                  <span>{route.time}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <button className="inline-flex items-center gap-2 px-6 py-3 border border-gold text-gold hover:bg-gold/10 font-medium text-sm rounded-sm transition-colors group">
            Explore All Routes
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
