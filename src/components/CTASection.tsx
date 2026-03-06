import React from 'react';
import { motion } from 'framer-motion';
export function CTASection() {
  return (
    <section className="relative pt-52 pb-32 md:pt-56 md:pb-40 overflow-hidden -mt-20 [clip-path:polygon(0_5rem,100%_0,100%_100%,0_100%)]">

      {/* Background */}
      <div className="absolute inset-0 bg-[#0A0A0A] z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/20 via-transparent to-transparent opacity-50"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.h2
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          transition={{
            duration: 0.8
          }}
          className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#F5F0E8] mb-6">

          Ready to Travel in Style?
        </motion.h2>

        <motion.p
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          transition={{
            duration: 0.8,
            delay: 0.2
          }}
          className="text-lg text-[#9A9590] mb-10 max-w-2xl mx-auto">

          Book your next journey with Elijah and experience the gold standard
          in private transportation.
        </motion.p>

        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          transition={{
            duration: 0.8,
            delay: 0.4
          }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4">

          <button className="w-full sm:w-auto px-8 py-4 bg-gold hover:bg-gold-hover text-white font-medium rounded-sm transition-colors animate-shimmer">
            Book Now
          </button>
          <button className="w-full sm:w-auto px-8 py-4 border border-gold text-gold hover:bg-gold/10 font-medium rounded-sm transition-colors">
            Contact Us
          </button>
        </motion.div>
      </div>
    </section>);

}