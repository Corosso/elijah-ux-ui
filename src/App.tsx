import { useState } from 'react';
import { useDarkMode } from './hooks/useDarkMode';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FleetSection } from './components/FleetSection';
import { CitiesSection } from './components/CitiesSection';
import { ServicesSection } from './components/ServicesSection';
import { ExperienceSection } from './components/ExperienceSection';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';

export function App() {
  const [isDark, toggleDark] = useDarkMode();
  const [user, setUser] = useState<string | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-gold/30 selection:text-gold-hover">
      <Navbar isDark={isDark} toggleDark={toggleDark} user={user} onLogin={() => setUser("Test User")} onLogout={() => setUser(null)} onAdminPanel={() => setShowAdmin(true)} />
      <main>
        <Hero isDark={isDark} />
        <FleetSection />
        <CitiesSection />
        <ServicesSection />
        <ExperienceSection />
        <CTASection />
      </main>
      <Footer />
      <AdminPanel isOpen={showAdmin} onClose={() => setShowAdmin(false)} user={user || ""} />
    </div>
  );
}
