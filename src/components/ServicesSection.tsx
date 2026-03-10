import { motion } from 'framer-motion';
import { MapPinIcon, ClockIcon, PlaneIcon, SparklesIcon } from 'lucide-react';
import { services } from '../data';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  MapPin: MapPinIcon,
  Clock: ClockIcon,
  Plane: PlaneIcon,
  Sparkles: SparklesIcon,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export function ServicesSection() {
  return (
    <section
      id="services"
      className="relative pt-44 pb-24 md:pt-52 md:pb-32 bg-[#141414] text-[#F5F0E8] -mt-20 [clip-path:polygon(0_5rem,100%_0,100%_100%,0_100%)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gold text-sm font-semibold tracking-[0.2em] uppercase mb-4 block"
          >
            The Elijah Difference
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl font-serif text-white"
          >
            Experiences Tailored to You
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-text-secondary max-w-2xl mx-auto text-lg mt-6"
          >
            Elijah is the stress-free solution for your ground transportation
            needs. Enjoy the comfort of a private journey.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
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
                variants={itemVariants}
                className={`group py-8 px-6 lg:px-8 relative ${
                  index < services.length - 1
                    ? 'lg:border-r lg:border-[#2A2520]'
                    : ''
                } ${
                  index < 2
                    ? 'md:border-b lg:border-b-0 md:border-[#2A2520]'
                    : ''
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold/20 transition-colors duration-300 flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-serif text-white">{service.title}</h3>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
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
