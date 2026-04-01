import { Link } from 'react-router-dom';
import { InstagramIcon, TwitterIcon, LinkedinIcon, FacebookIcon } from 'lucide-react';
import { contactInfo } from '../data';

const socialIcons = {
  instagram: InstagramIcon,
  twitter: TwitterIcon,
  linkedin: LinkedinIcon,
  facebook: FacebookIcon,
};

export function Footer() {
  return (
    <footer className="dark bg-bg-primary pt-24 pb-12 md:pt-28 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="Elijah Logo" className="h-12 w-auto object-contain" />
              <span className="text-logo-lg text-text-primary">
                Elijah
              </span>
            </div>
            <p className="text-text-secondary text-caption max-w-sm mb-8">
              America's most exclusive private chauffeur service.
              Redefining luxury, privacy and comfort on every journey.
            </p>
            <div className="flex gap-4">
              {Object.entries(contactInfo.social).map(([key, url]) => {
                const Icon = socialIcons[key as keyof typeof socialIcons];
                if (!Icon || !url) return null;
                return (
                  <a
                    key={key}
                    href={url}
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-secondary hover:text-gold hover:border-gold hover:scale-110 transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-text-primary text-eyebrow mb-6">Services</h4>
            <ul className="space-y-4">
              {['Point to Point', 'By the Hour', 'Airport', 'Events'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-text-secondary hover:text-gold text-caption transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-text-primary text-eyebrow mb-6">Cities</h4>
            <ul className="space-y-4">
              {['New York', 'Los Angeles', 'Miami', 'Boston'].map((city) => (
                <li key={city}>
                  <a href="#" className="text-text-secondary hover:text-gold text-caption transition-colors">{city}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-text-primary text-eyebrow mb-6">Company</h4>
            <ul className="space-y-4">
              {['About Us', 'Careers', 'Press', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-text-secondary hover:text-gold text-caption transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-secondary text-caption">
            &copy; {new Date().getFullYear()} Elijah. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/legal#terms" className="text-text-secondary hover:text-gold text-caption transition-colors">Terms</Link>
            <Link to="/legal#privacy" className="text-text-secondary hover:text-gold text-caption transition-colors">Privacy</Link>
            <Link to="/legal#cookies" className="text-text-secondary hover:text-gold text-caption transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
