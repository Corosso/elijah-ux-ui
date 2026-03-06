import { motion } from 'framer-motion';
import { BookingForm } from './BookingForm';
import { MapPreview } from './MapPreview';

interface HeroProps {
  isDark: boolean;
}

export function Hero({ isDark }: HeroProps) {
  const title = 'Your Personal Chauffeur Service';
  const words = title.split(' ');

  return (
    <section className="relative pt-16 overflow-hidden bg-bg-primary">
      {/* Hero Image Area */}
      <div className="relative w-full min-h-[440px] flex items-center">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/image.png"
            alt="Luxury Chauffeur Service"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center py-10">
          {/* Left — Text (5 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="w-12 h-0.5 bg-gold mb-1 origin-left"
            />

            <h1 className="text-2xl md:text-3xl lg:text-[2rem] font-serif text-white leading-tight flex flex-wrap">
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block mr-2.5 lg:mr-3 last:mr-0"
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-sm md:text-base text-white/75 max-w-sm leading-relaxed"
            >
              Experience the ultimate level of luxury, privacy and comfort.
              First-class vehicles for your most important journeys.
            </motion.p>
          </div>

          {/* Center — Booking Form (4 cols) */}
          <div className="lg:col-span-4 relative z-20">
            <BookingForm />
          </div>

          {/* Right — Map Preview (3 cols) */}
          <div className="lg:col-span-4 relative z-10 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.5 }}
              className="relative"
            >
              <div className="h-[380px] rounded-lg overflow-hidden shadow-lg border border-white/10">
                <MapPreview isDark={isDark} />
              </div>
              {/* Subtle gradient fade on left edge to blend with hero */}
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/20 to-transparent rounded-l-lg pointer-events-none z-10"></div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile-only map below hero */}
      <div className="lg:hidden px-4 sm:px-6 py-6 bg-bg-primary">
        <div className="h-[200px] rounded-lg overflow-hidden shadow-lg border border-border">
          <MapPreview isDark={isDark} />
        </div>
      </div>
    </section>
  );
}