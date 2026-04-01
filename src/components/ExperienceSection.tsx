import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2Icon } from 'lucide-react';
import { experienceFeatures, stats } from '../data';
import { slide, staggerGrid, viewport } from '../utils/motion';

function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = value / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export function ExperienceSection() {
  const statsGrid = staggerGrid(0.1);

  return (
    <section id="experience" className="relative pt-[calc(5vw+2rem)] pb-[calc(5vw+2rem)] md:pt-[calc(5vw+3rem)] md:pb-[calc(5vw+2.5rem)] bg-bg-primary -mt-[5vw] [clip-path:polygon(0_5vw,100%_0,100%_100%,0_100%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={slide('left').hidden}
            whileInView={slide('left').visible}
            viewport={viewport.once}
          >
            <span className="text-gold text-eyebrow mb-4 block">
              The Elijah Experience
            </span>
            <h2 className="text-heading-lg-fluid font-serif text-text-primary mb-6">
              Redefining luxury transportation.
            </h2>
            <p className="text-body-lg text-text-secondary mb-8">
              We are more than a transportation service; we are creators of
              experiences. Every detail of your journey is meticulously planned
              to guarantee your comfort, safety and absolute privacy.
            </p>

            <ul className="space-y-4">
              {experienceFeatures.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={slide('left').hidden}
                  whileInView={slide('left').visible}
                  viewport={viewport.once}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
                  className="flex items-center gap-3 text-text-primary font-medium"
                >
                  <CheckCircle2Icon className="w-5 h-5 text-gold" />
                  {feature}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right Content - Stats */}
          <motion.div variants={statsGrid.container} initial="hidden" whileInView="visible" viewport={viewport.onceInset} className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={statsGrid.item}
                className={`bg-bg-surface p-8 rounded-lg border border-border text-center ${
                  index === 1 ? 'mt-8' : index === 2 ? '-mt-8' : ''
                }`}
              >
                <div className="text-heading-md font-serif text-gold mb-2">
                  {stat.animated ? <AnimatedCounter value={stat.value as number} /> : stat.value}
                  {stat.suffix}
                </div>
                <div className="text-eyebrow-sm text-text-secondary">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
