import { motion } from 'framer-motion';
import { MapPinIcon, ClockIcon, PlaneIcon, SparklesIcon } from 'lucide-react';
import { services } from '../data';
import type { LucideIcon } from 'lucide-react';
import { reveal, drift, staggerGrid, viewport } from '../utils/motion';

const iconMap: Record<string, LucideIcon> = {
  MapPin: MapPinIcon,
  Clock: ClockIcon,
  Plane: PlaneIcon,
  Sparkles: SparklesIcon,
};

export function ServicesSection() {
  const grid = staggerGrid(0.12);
  return (
    <section
      id="services"
      className="relative pt-[calc(5vw+2rem)] pb-[calc(5vw+2rem)] md:pt-[calc(5vw+3rem)] md:pb-[calc(5vw+2.5rem)] bg-bg-section-dark text-white -mt-[5vw] [clip-path:polygon(0_5vw,100%_0,100%_100%,0_100%)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 md:mb-14">
          <motion.span
            initial={drift.hidden}
            whileInView={drift.visible}
            viewport={viewport.once}
            className="text-gold text-eyebrow mb-4 block"
          >
            The Elijah Difference
          </motion.span>
          <motion.h2
            initial={reveal.hidden}
            whileInView={reveal.visible}
            viewport={viewport.once}
            transition={{ delay: 0.1 }}
            className="text-heading-lg-fluid font-serif text-white"
          >
            Experiences Tailored to You
          </motion.h2>
          <motion.p
            initial={drift.hidden}
            whileInView={drift.visible}
            viewport={viewport.once}
            transition={{ delay: 0.2 }}
            className="text-text-secondary max-w-2xl mx-auto text-body-lg mt-6"
          >
            Elijah is the stress-free solution for your ground transportation
            needs. Enjoy the comfort of a private journey.
          </motion.p>
        </div>

        <motion.div
          variants={grid.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || MapPinIcon;
            return (
              <motion.div
                key={index}
                variants={grid.item}
                className={`group py-8 px-6 lg:px-8 relative ${
                  index < services.length - 1
                    ? 'lg:border-r lg:border-border'
                    : ''
                } ${
                  index < 2
                    ? 'md:border-b lg:border-b-0 md:border-border'
                    : ''
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold/20 transition-colors duration-300 flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-body-lg font-serif text-white">{service.title}</h3>
                </div>
                <p className="text-text-secondary text-caption">
                  {service.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
