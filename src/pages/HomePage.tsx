import { Hero } from '../components/Hero';
import { FleetSection } from '../components/FleetSection';
import { CitiesSection } from '../components/CitiesSection';
import { ServicesSection } from '../components/ServicesSection';
import { ExperienceSection } from '../components/ExperienceSection';
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
      <ExperienceSection />
      <CTASection />
    </main>
  );
}
