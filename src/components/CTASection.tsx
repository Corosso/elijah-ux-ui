import { motion } from 'framer-motion';

export function CTASection() {
  return (
    <section className="relative pt-[calc(5vw+2rem)] pb-20 md:pt-[calc(5vw+3rem)] md:pb-24 overflow-hidden -mt-[5vw] [clip-path:polygon(0_5vw,100%_0,100%_100%,0_100%)]">
      {/* CTA is the last section, no need for extra pb */}
      <div className="absolute inset-0 bg-[#0A0A0A] z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/20 via-transparent to-transparent opacity-50" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#F5F0E8] mb-6"
        >
          Ready to Travel in Style?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-text-secondary mb-10 max-w-2xl mx-auto"
        >
          Book your next journey with Elijah and experience the gold standard
          in private transportation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="w-full sm:w-auto px-8 py-4 bg-gold hover:bg-gold-hover text-white font-medium rounded-sm transition-colors animate-shimmer">
            Book Now
          </button>
          <button className="w-full sm:w-auto px-8 py-4 border border-gold text-gold hover:bg-gold/10 font-medium rounded-sm transition-colors">
            Contact Us
          </button>
        </motion.div>
      </div>
    </section>
  );
}
