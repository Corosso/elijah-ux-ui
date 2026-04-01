import { motion } from 'framer-motion';
import { reveal, drift, tap, hoverGlow, viewport } from '../utils/motion';

export function CTASection() {
  return (
    <section className="dark relative pt-[calc(5vw+2rem)] pb-[calc(5vw+2rem)] md:pt-[calc(5vw+3rem)] md:pb-[calc(5vw+2.5rem)] overflow-hidden -mt-[5vw] [clip-path:polygon(0_5vw,100%_0,100%_100%,0_100%)]">
      {/* CTA is the last section, no need for extra pb */}
      <div className="absolute inset-0 bg-bg-primary z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/20 via-transparent to-transparent opacity-50" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.h2
          initial={reveal.hidden}
          whileInView={reveal.visible}
          viewport={viewport.once}
          className="text-display-sm-fluid font-serif text-text-primary mb-6"
        >
          Ready to Travel in Style?
        </motion.h2>

        <motion.p
          initial={drift.hidden}
          whileInView={drift.visible}
          viewport={viewport.once}
          transition={{ delay: 0.15 }}
          className="text-body-lg text-text-secondary mb-10 max-w-2xl mx-auto"
        >
          Book your next journey with Elijah and experience the gold standard
          in private transportation.
        </motion.p>

        <motion.div
          initial={drift.hidden}
          whileInView={drift.visible}
          viewport={viewport.once}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button whileTap={tap} whileHover={hoverGlow} className="w-full sm:w-auto px-8 py-4 bg-gold hover:bg-gold-hover text-white font-medium rounded-sm transition-colors active:scale-[0.97]">
            Book Now
          </motion.button>
          <motion.button whileTap={tap} className="w-full sm:w-auto px-8 py-4 border border-gold text-gold hover:bg-gold/10 font-medium rounded-sm transition-colors active:scale-[0.97]">
            Contact Us
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
