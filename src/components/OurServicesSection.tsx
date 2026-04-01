import { motion } from 'framer-motion';
import { reveal, drift, staggerScaleIn, hoverLift, viewport } from '../utils/motion';

interface ServiceCard {
  title: string;
  desc: string;
  image: string;
}

const ourServices: ServiceCard[] = [
  {
    title: 'Airport Car Service',
    desc: 'Drop the pre-flight stress when you plan your custom ride to the airport with Elijah.',
    image: '/services/airport.png',
  },
  {
    title: 'Luxury Black Car Service',
    desc: 'Enjoy a premium, luxury transfer service with our highly trained professional chauffeurs.',
    image: '/services/luxury car.png',
  },
  {
    title: 'Private Van Service',
    desc: 'Easily book spacious chauffeured sprinter vans for your whole group with all inclusive rates.',
    image: '/services/private van.png',
  },
  {
    title: 'Limousine Service',
    desc: 'Book your limousine service for guaranteed style and comfort; one of a kind rides for memorable times.',
    image: '/services/limousine.png',
  },
  {
    title: 'Wedding Limo',
    desc: 'Ensure your special day flows in style. Have your bridal party and guests arrive in unique comfort.',
    image: '/services/wedding limo.png',
  },
  {
    title: 'Executive Car Service',
    desc: 'Cross off every to-do on the agenda when you book our executive car service.',
    image: '/services/executive car.png',
  },
];

export function OurServicesSection() {
  const grid = staggerScaleIn(0.1);
  return (
    <section className="relative pt-[calc(5vw+2rem)] pb-[calc(5vw+2rem)] md:pt-[calc(5vw+3rem)] md:pb-[calc(5vw+2.5rem)] bg-bg-primary -mt-[5vw] [clip-path:polygon(0_5vw,100%_0,100%_100%,0_100%)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <motion.h2
            initial={reveal.hidden}
            whileInView={reveal.visible}
            viewport={viewport.once}
            className="text-heading-md-fluid font-serif text-text-primary mb-3"
          >
            Our Services
          </motion.h2>
          <motion.p
            initial={drift.hidden}
            whileInView={drift.visible}
            viewport={viewport.once}
            transition={{ delay: 0.15 }}
            className="text-text-secondary text-caption max-w-2xl mx-auto"
          >
            Best-in-class luxury vehicles and a quick set up for every professional chauffeured ride you may need;
            that&apos;s how we roll. On daily commutes, crucial transfers, or once in a lifetime trips,
            we are proud to be your top quality chosen partner.
          </motion.p>
        </div>

        {/* 2-column image card grid */}
        <motion.div
          variants={grid.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 max-w-4xl mx-auto"
        >
          {ourServices.map((service, index) => (
            <motion.div
              key={index}
              variants={grid.item}
              whileHover={hoverLift}
              className="group relative aspect-square sm:aspect-[4/3] rounded-xl overflow-hidden cursor-pointer bg-black"
            >
              <img
                src={service.image}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-5 z-10">
                <h3 className="text-white font-serif text-body-lg mb-1 italic">{service.title}</h3>
                <p className="text-white/70 text-caption">{service.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
