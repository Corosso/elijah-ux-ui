import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoonIcon, SunIcon, MenuIcon, XIcon, PhoneIcon } from 'lucide-react';
interface NavbarProps {
  isDark: boolean;
  toggleDark: () => void;
}
export function Navbar({ isDark, toggleDark }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasEverScrolled, setHasEverScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
      if (scrolled) setHasEverScrolled(true);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const navLinks = [
    {
      name: 'Fleet',
      href: '#fleet'
    },
    {
      name: 'Cities',
      href: '#cities'
    },
    {
      name: 'Services',
      href: '#services'
    },
    {
      name: 'Experience',
      href: '#experience'
    }];

  return (
    <motion.nav
      initial={{
        y: -100
      }}
      animate={{
        y: 0
      }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${hasEverScrolled ? 'bg-bg-surface/80 backdrop-blur-md shadow-sm border-b border-border py-2' : 'bg-transparent py-4'}`}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Elijah Logo"
              className="h-8 w-auto object-contain" />

            <span className={`font-serif text-xl tracking-[0.2em] uppercase transition-colors ${hasEverScrolled ? "text-text-primary" : "text-white"}`}>
              Elijah
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
              {navLinks.map((link) =>
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium hover:text-gold transition-colors ${hasEverScrolled ? "text-text-secondary" : "text-white/70"}`}>

                  {link.name}
                </a>
              )}
            </div>

            <div className="h-4 w-px bg-border"></div>

            <div className="flex items-center gap-4">
              <a
                href="tel:+573000000000"
                className={`flex items-center gap-2 text-sm font-medium hover:text-gold transition-colors ${hasEverScrolled ? "text-text-primary" : "text-white"}`}>

                <PhoneIcon className="w-4 h-4" />
                <span>+57 300 000 0000</span>
              </a>

              <button
                onClick={toggleDark}
                className="p-2 rounded-full hover:bg-bg-elevated transition-colors text-text-secondary hover:text-gold"
                aria-label="Toggle dark mode">

                <motion.div
                  initial={false}
                  animate={{
                    rotate: isDark ? 180 : 0
                  }}
                  transition={{
                    duration: 0.3
                  }}>

                  {isDark ?
                    <SunIcon className="w-5 h-5" /> :

                    <MoonIcon className="w-5 h-5" />
                  }
                </motion.div>
              </button>

              <button className={`text-sm font-medium hover:text-gold transition-colors ${hasEverScrolled ? "text-text-primary" : "text-white"}`}>
                Login
              </button>
              <button className="px-5 py-2.5 bg-gold hover:bg-gold-hover text-white text-sm font-medium rounded-sm transition-colors animate-shimmer">
                Book
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleDark} className="p-2 text-text-secondary">
              {isDark ?
                <SunIcon className="w-5 h-5" /> :

                <MoonIcon className="w-5 h-5" />
              }
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-text-primary">

              {isMobileMenuOpen ?
                <XIcon className="w-6 h-6" /> :

                <MenuIcon className="w-6 h-6" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen &&
          <motion.div
            initial={{
              opacity: 0,
              height: 0
            }}
            animate={{
              opacity: 1,
              height: 'auto'
            }}
            exit={{
              opacity: 0,
              height: 0
            }}
            className="md:hidden bg-bg-surface border-b border-border overflow-hidden">

            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) =>
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-text-primary py-2 border-b border-border"
                  onClick={() => setIsMobileMenuOpen(false)}>

                  {link.name}
                </a>
              )}
              <div className="flex flex-col gap-4 mt-4">
                <a
                  href="tel:+573000000000"
                  className="flex items-center gap-2 text-lg font-medium text-text-primary">

                  <PhoneIcon className="w-5 h-5" />
                  <span>+57 300 000 0000</span>
                </a>
                <div className="flex gap-4">
                  <button className="flex-1 py-3 border border-border text-text-primary font-medium rounded-sm">
                    Login
                  </button>
                  <button className="flex-1 py-3 bg-gold text-white font-medium rounded-sm">
                    Book
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </motion.nav>);

}