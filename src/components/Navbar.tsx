import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoonIcon, SunIcon, MenuIcon, XIcon, UserIcon, LogOutIcon, PhoneIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { navLinks } from '../data';

interface NavbarProps {
  isDark: boolean;
  toggleDark: () => void;
  user: string | null;
  onLogin: () => void;
  onLogout: () => void;
}

export function Navbar({ isDark, toggleDark, user, onLogin, onLogout }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors transition-[padding,background-color,border-color,backdrop-filter,box-shadow] duration-300 ${isScrolled ? 'bg-black/90 dark:bg-bg-surface/80 backdrop-blur-md shadow-sm border-b border-black/20 dark:border-border py-2' : 'bg-black/70 dark:bg-black/30 backdrop-blur-sm py-4'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <img src="/logo.png" alt="Elijah Logo" className="h-7 sm:h-8 w-auto object-contain" />
            <span className={`font-serif text-lg sm:text-xl tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-colors text-glow-gold ${isScrolled ? "text-white dark:text-text-primary" : "text-white"}`}>
              Elijah
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">

            <a
              href="tel:+573001234567"
              className={`flex items-center gap-1.5 text-sm font-medium hover:text-gold transition-colors ${isScrolled ? 'text-white/80 dark:text-text-secondary' : 'text-white/90'}`}
            >
              <PhoneIcon className="w-3.5 h-3.5" />
              +57 300 123 4567
            </a>

            <Link
              to="/cities"
              className={`text-sm font-semibold tracking-wider uppercase hover:text-gold transition-colors ${isScrolled ? 'text-white/80 dark:text-text-secondary' : 'text-white/90'}`}
            >
              Cities We Serve
            </Link>

            <div className="h-4 w-px bg-border" />

            <div className="flex items-center gap-4">

              <button
                onClick={toggleDark}
                className={`p-2 rounded-full transition-colors hover:text-gold ${isScrolled ? 'text-white/80 dark:text-text-secondary hover:bg-white/10 dark:hover:bg-bg-elevated' : 'text-white'}`}
                aria-label="Toggle dark mode"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isDark ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                </motion.div>
              </button>

              {user ? (
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-gold" />
                  <span className={`text-sm font-medium ${isScrolled ? "text-white dark:text-text-primary" : "text-white"}`}>{user}</span>
                  <button onClick={onLogout} className="p-1 text-text-secondary hover:text-gold transition-colors" aria-label="Logout">
                    <LogOutIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className={`text-sm font-medium hover:text-gold transition-colors ${isScrolled ? "text-white dark:text-text-primary" : "text-white"}`}>
                  Login
                </Link>
              )}

              <Link to="/signup" className="px-5 py-2.5 bg-gold hover:bg-gold-hover text-white text-sm font-medium rounded-sm transition-colors animate-shimmer">
                Signup
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleDark} className="p-2 text-text-secondary">
              {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-text-primary"
            >
              {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-bg-surface border-b border-border overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-text-primary py-2 border-b border-border"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <Link to="/cities" className="text-lg font-medium text-text-primary py-2 border-b border-border" onClick={() => setIsMobileMenuOpen(false)}>
                Cities We Serve
              </Link>
              <div className="flex flex-col gap-4 mt-4">
                <div className="flex gap-4">
                  {user ? (
                    <button onClick={onLogout} className="flex-1 py-3 border border-border text-text-primary font-medium rounded-sm">
                      Logout
                    </button>
                  ) : (
                    <Link to="/login" className="flex-1 py-3 border border-border text-text-primary font-medium rounded-sm text-center" onClick={() => setIsMobileMenuOpen(false)}>
                      Login
                    </Link>
                  )}
                  <Link to="/signup" className="flex-1 py-3 bg-gold text-white font-medium rounded-sm text-center" onClick={() => setIsMobileMenuOpen(false)}>
                    Signup
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
