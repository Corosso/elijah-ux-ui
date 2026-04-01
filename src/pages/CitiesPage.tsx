import { motion } from 'framer-motion';
import { reveal, drift, staggerScaleIn, hoverLift } from '../utils/motion';

// Extract unique cities from routes (origins + destinations)
const cities = [
  { name: 'New York City', image: 'https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?w=600&h=500&fit=crop' },
  { name: 'Los Angeles', image: 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=600&h=500&fit=crop' },
  { name: 'Miami', image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=600&h=500&fit=crop' },
  { name: 'Philadelphia', image: '/bgs/filadelfia.png' },
  { name: 'Boston', image: '/bgs/boston.png' },
  { name: 'Washington D.C.', image: 'https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=600&h=500&fit=crop' },
];

export function CitiesPage() {
  const grid = staggerScaleIn(0.08);
  return (
    <main className="pt-20 pb-24 bg-bg-primary min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 pt-8">
          <motion.span
            initial={drift.hidden}
            animate={drift.visible}
            className="text-gold text-eyebrow mb-3 block"
          >
            Our Locations
          </motion.span>
          <motion.h1
            initial={reveal.hidden}
            animate={reveal.visible}
            transition={{ delay: 0.05 }}
            className="text-heading-lg-fluid font-serif text-text-primary mb-4"
          >
            The icon of luxury rides.
          </motion.h1>
          <motion.p
            initial={drift.hidden}
            animate={drift.visible}
            transition={{ delay: 0.15 }}
            className="text-gold text-heading-sm-fluid font-serif"
          >
            This is where your journey begins.
          </motion.p>
        </div>

        {/* City Cards Grid */}
        <motion.div
          variants={grid.container}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
        >
          {cities.map((city, index) => (
            <motion.div
              key={city.name}
              variants={grid.item}
              whileHover={hoverLift}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer bg-black shadow-luxury dark:shadow-luxury-dark"
            >
              <img
                src={city.image}
                alt={city.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <h2 className="text-white text-heading-sm-fluid font-serif text-center drop-shadow-lg">
                  {city.name}
                </h2>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </main>
  );
}
