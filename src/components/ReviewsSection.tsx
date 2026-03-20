import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { StarIcon } from 'lucide-react';

interface Review {
  name: string;
  title: string;
  rating: number;
  text: string;
  avatar: string;
}

const reviews: Review[] = [
  {
    name: 'Garrett Williams',
    title: 'Regional VP',
    rating: 5,
    text: 'Our driver was waiting for us when we arrived at the airport. The drive was smooth and uneventful, just how I like it. Extremely professional from start to finish. Will be using Elijah again.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Scott Webber',
    title: 'CEO, Y International',
    rating: 5,
    text: 'I would highly recommend this company. They are very professional, the driver was early at my house for pick up at the airport waiting for us when we got back.',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    name: 'Phillip A.',
    title: 'Mechanical Engineer',
    rating: 5,
    text: 'Top notch service. Gladly recommend this company. Very reliable and courteous. Will use again!',
    avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
  },
  {
    name: 'Elizabeth McGraw',
    title: 'Marketing Director',
    rating: 5,
    text: 'We tried several services but found Elijah to be the best. Their drivers are courteous and their dispatcher was especially helpful during our recent travels.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Michael Chen',
    title: 'Software Architect',
    rating: 5,
    text: 'Impeccable service from booking to drop-off. The vehicle was immaculate and the driver was incredibly professional.',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
  },
  {
    name: 'Sarah Johnson',
    title: 'Investment Banker',
    rating: 5,
    text: 'I use Elijah for all my business travel. The consistency and reliability is unmatched. Every ride feels like first class on the ground.',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
  },
  {
    name: 'David Park',
    title: 'Entrepreneur',
    rating: 5,
    text: 'From airport pickups to corporate events, Elijah has never let me down. The attention to detail sets them apart.',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
  },
  {
    name: 'Amanda Torres',
    title: 'Creative Director',
    rating: 5,
    text: 'Used Elijah for a special anniversary dinner. The whole experience was elegant and seamless.',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
  },
  {
    name: 'James Richardson',
    title: 'Hotel General Manager',
    rating: 5,
    text: 'We recommend Elijah to all our VIP guests. The level of professionalism and discretion is exactly what our clientele expects.',
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
  },
  {
    name: 'Laura Kim',
    title: 'Fashion Designer',
    rating: 5,
    text: 'Always on time, always elegant. Elijah understands what luxury means. My go-to for every event.',
    avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <StarIcon key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-white dark:bg-bg-elevated rounded-lg px-5 py-4 shadow-sm dark:shadow-none border border-gray-100 dark:border-border flex flex-col gap-2">
      <div className="flex items-center gap-2.5">
        <img
          src={review.avatar}
          alt={review.name}
          className="w-8 h-8 rounded-full object-cover border border-gold/20"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-text-primary truncate">{review.name}</p>
          <p className="text-[11px] text-text-secondary truncate">{review.title}</p>
        </div>
        <Stars count={review.rating} />
      </div>
      <p className="text-xs text-text-secondary leading-relaxed">{review.text}</p>
    </div>
  );
}

/* Scrolling column — duplicates items for seamless loop */
function ScrollingColumn({ items, speed, direction }: { items: Review[]; speed: number; direction: 'up' | 'down' }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const colRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(wrapperRef, { once: false, margin: '200px' });

  useEffect(() => {
    const el = colRef.current;
    if (!el || !isInView) return;

    let raf: number;
    let pos = direction === 'up' ? 0 : -(el.scrollHeight / 2);

    const step = () => {
      if (direction === 'up') {
        pos -= speed;
        if (Math.abs(pos) >= el.scrollHeight / 2) pos = 0;
      } else {
        pos += speed;
        if (pos >= 0) pos = -(el.scrollHeight / 2);
      }
      el.style.transform = `translateY(${pos}px)`;
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isInView, speed, direction]);

  const doubled = [...items, ...items];

  return (
    <div ref={wrapperRef} className="overflow-hidden h-[400px] lg:h-[450px]">
      <div ref={colRef} className="flex flex-col gap-4 will-change-transform">
        {doubled.map((review, i) => (
          <div key={`${review.name}-${i}`} className="flex-shrink-0">
            <ReviewCard review={review} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReviewsSection() {
  // Split reviews into 2 columns
  const col1 = reviews.filter((_, i) => i % 2 === 0);
  const col2 = reviews.filter((_, i) => i % 2 === 1);

  return (
    <section className="relative pt-[calc(5vw+2rem)] pb-[calc(5vw+2rem)] md:pt-[calc(5vw+3rem)] md:pb-[calc(5vw+2.5rem)] bg-bg-surface dark:bg-[#0A0A0A] overflow-hidden -mt-[5vw] [clip-path:polygon(0_5vw,100%_0,100%_100%,0_100%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-center">
          {/* Left — headline */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-gold text-sm font-semibold tracking-[0.2em] uppercase mb-4 block">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-text-primary mb-4 leading-tight">
              Rated 5 out of 5 stars<br />by our customers!
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed max-w-md">
              Customers from across the globe have had fantastic experiences using Elijah.
              Here&apos;s what they have to say.
            </p>
          </motion.div>

          {/* Right — 2 scrolling columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-hidden">
            <ScrollingColumn items={col1} speed={0.3} direction="up" />
            <div className="hidden sm:block">
              <ScrollingColumn items={col2} speed={0.35} direction="down" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
