import { Hero } from '../components/Hero';
import { FleetSection } from '../components/FleetSection';
import { CitiesSection } from '../components/CitiesSection';
import { OurServicesSection } from '../components/OurServicesSection';
import { ServicesSection } from '../components/ServicesSection';
import { ReviewsSection } from '../components/ReviewsSection';
import { CTASection } from '../components/CTASection';

interface HomePageProps {
  isDark: boolean;
}

export function HomePage({ isDark }: HomePageProps) {
  return (
    <main>
      <Hero isDark={isDark} />
      <FleetSection />
      <CitiesSection />
      <ServicesSection />
      <OurServicesSection />
      <ReviewsSection />
      <CTASection />
    </main>
  );
}
