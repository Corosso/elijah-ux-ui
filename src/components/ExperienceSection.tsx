import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2Icon } from 'lucide-react';
function AnimatedCounter({
  value,
  duration = 2



}: {value: number;duration?: number;}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: '-50px'
  });
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
const features = [
'Certified professional chauffeurs',
'Latest generation vehicles',
'24/7 Service',
'Real-time tracking'];

export function ExperienceSection() {
  return (
    <section id="experience" className="relative pt-44 pb-24 md:pt-52 md:pb-32 bg-bg-primary -mt-20 [clip-path:polygon(0_5rem,100%_0,100%_100%,0_100%)]">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{
              opacity: 0,
              x: -30
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1]
            }}>

            <span className="text-gold text-sm font-semibold tracking-[0.2em] uppercase mb-4 block">
              The Elijah Experience
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-text-primary mb-6">
              Redefining luxury transportation.
            </h2>
            <p className="text-lg text-text-secondary mb-8">
              We are more than a transportation service; we are creators of
              experiences. Every detail of your journey is meticulously planned
              to guarantee your comfort, safety and absolute privacy.
            </p>

            <ul className="space-y-4">
              {features.map((feature, index) =>
              <motion.li
                key={index}
                initial={{
                  opacity: 0,
                  x: -20
                }}
                whileInView={{
                  opacity: 1,
                  x: 0
                }}
                viewport={{
                  once: true
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1
                }}
                className="flex items-center gap-3 text-text-primary font-medium">

                  <CheckCircle2Icon className="w-5 h-5 text-gold" />
                  {feature}
                </motion.li>
              )}
            </ul>
          </motion.div>

          {/* Right Content - Stats */}
          <div className="grid grid-cols-2 gap-6">
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
                duration: 0.6,
                delay: 0.2
              }}
              className="bg-bg-surface p-8 rounded-lg border border-border text-center">

              <div className="text-4xl font-serif text-gold mb-2">
                <AnimatedCounter value={500} />+
              </div>
              <div className="text-sm text-text-secondary font-medium uppercase tracking-wider">
                Satisfied Clients
              </div>
            </motion.div>

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
                duration: 0.6,
                delay: 0.3
              }}
              className="bg-bg-surface p-8 rounded-lg border border-border text-center mt-8">

              <div className="text-4xl font-serif text-gold mb-2">
                <AnimatedCounter value={50} />
                k+
              </div>
              <div className="text-sm text-text-secondary font-medium uppercase tracking-wider">
                Completed Trips
              </div>
            </motion.div>

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
                duration: 0.6,
                delay: 0.4
              }}
              className="bg-bg-surface p-8 rounded-lg border border-border text-center -mt-8">

              <div className="text-4xl font-serif text-gold mb-2">
                <AnimatedCounter value={6} />
              </div>
              <div className="text-sm text-text-secondary font-medium uppercase tracking-wider">
                Cities
              </div>
            </motion.div>

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
                duration: 0.6,
                delay: 0.5
              }}
              className="bg-bg-surface p-8 rounded-lg border border-border text-center">

              <div className="text-4xl font-serif text-gold mb-2">4.9</div>
              <div className="text-sm text-text-secondary font-medium uppercase tracking-wider">
                Rating
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>);

}