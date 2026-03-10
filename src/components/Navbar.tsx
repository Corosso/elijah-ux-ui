import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoonIcon, SunIcon, MenuIcon, XIcon, UserIcon, LogOutIcon, MailIcon, LockKeyholeIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors transition-[padding,background-color,border-color,backdrop-filter,box-shadow] duration-300 ${isScrolled ? 'bg-bg-surface/80 backdrop-blur-md shadow-sm border-b border-border py-2' : 'bg-black/30 backdrop-blur-sm py-4'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Elijah Logo" className="h-8 w-auto object-contain" />
            <span className={`font-serif text-xl tracking-[0.2em] uppercase transition-colors text-glow-gold ${isScrolled ? "text-text-primary" : "text-white"}`}>
              Elijah
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium hover:text-gold transition-colors ${isScrolled ? "text-text-secondary" : "text-white/90"}`}
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="h-4 w-px bg-border" />

            <div className="flex items-center gap-4">

              <button
                onClick={toggleDark}
                className={`p-2 rounded-full transition-colors hover:text-gold ${isScrolled ? 'text-text-secondary hover:bg-bg-elevated' : 'text-white'}`}
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
                  <span className={`text-sm font-medium ${isScrolled ? "text-text-primary" : "text-white"}`}>{user}</span>
                  <button onClick={onLogout} className="p-1 text-text-secondary hover:text-gold transition-colors" aria-label="Logout">
                    <LogOutIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowLoginModal(true)} className={`text-sm font-medium hover:text-gold transition-colors ${isScrolled ? "text-text-primary" : "text-white"}`}>
                  Login
                </button>
              )}

              <button className="px-5 py-2.5 bg-gold hover:bg-gold-hover text-white text-sm font-medium rounded-sm transition-colors animate-shimmer">
                Book
              </button>
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
              <div className="flex flex-col gap-4 mt-4">
                <div className="flex gap-4">
                  {user ? (
                    <button onClick={onLogout} className="flex-1 py-3 border border-border text-text-primary font-medium rounded-sm">
                      Logout
                    </button>
                  ) : (
                    <button onClick={() => { setShowLoginModal(true); setIsMobileMenuOpen(false); }} className="flex-1 py-3 border border-border text-text-primary font-medium rounded-sm">
                      Login
                    </button>
                  )}
                  <button className="flex-1 py-3 bg-gold text-white font-medium rounded-sm">
                    Book
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            key="login-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLoginModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1E1E1E] rounded-xl shadow-2xl border border-[#2A2520] w-full max-w-sm mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-[#141414] px-6 py-4 text-center border-b border-[#2A2520]">
                <img src="/logo.png" alt="Elijah" className="h-8 w-auto mx-auto mb-2" />
                <h2 className="font-serif text-lg text-[#F5F0E8]">Welcome Back</h2>
                <p className="text-sm text-[#9A9590] mt-1">Sign in to continue your journey</p>
              </div>

              {/* Form */}
              <div className="px-6 py-4 flex flex-col gap-3">
                {/* Email */}
                <div>
                  <label className="text-[10px] font-semibold text-gold uppercase tracking-widest mb-1.5 block">Email</label>
                  <div className="relative flex items-center">
                    <MailIcon className="absolute left-3 w-4 h-4 text-[#9A9590]" />
                    <input type="email" placeholder="your@email.com" className="w-full bg-[#0A0A0A] border border-[#2A2520] rounded-lg py-2 pl-9 pr-4 text-[#F5F0E8] placeholder:text-[#9A9590]/50 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all text-sm" />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-[10px] font-semibold text-gold uppercase tracking-widest mb-1.5 block">Password</label>
                  <div className="relative flex items-center">
                    <LockKeyholeIcon className="absolute left-3 w-4 h-4 text-[#9A9590]" />
                    <input type={showPassword ? "text" : "password"} placeholder="Enter your password" className="w-full bg-[#0A0A0A] border border-[#2A2520] rounded-lg py-2 pl-9 pr-9 text-[#F5F0E8] placeholder:text-[#9A9590]/50 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all text-sm" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-[#9A9590] hover:text-[#F5F0E8] transition-colors">
                      {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-3.5 h-3.5 rounded border-border text-gold focus:ring-gold" />
                    <span className="text-xs text-[#9A9590]">Remember me</span>
                  </label>
                  <button className="text-xs text-gold hover:text-gold-hover transition-colors font-medium">Forgot password?</button>
                </div>

                {/* Sign In Button */}
                <button
                  onClick={() => { onLogin(); setShowLoginModal(false); }}
                  className="w-full py-2.5 bg-gold hover:bg-gold-hover text-white font-medium rounded-lg transition-colors animate-shimmer"
                >
                  Sign In
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-[#2A2520]" />
                  <span className="text-[10px] text-text-secondary uppercase tracking-wider">or</span>
                  <div className="flex-1 h-px bg-[#2A2520]" />
                </div>

                {/* Quick Login */}
                <button
                  onClick={() => { onLogin(); setShowLoginModal(false); }}
                  className="w-full py-2 border border-[#2A2520] text-[#F5F0E8] hover:border-gold hover:text-gold font-medium rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <UserIcon className="w-4 h-4" />
                  Continue as Guest
                </button>
              </div>

              {/* Footer */}
              <div className="px-6 py-3 bg-[#141414] border-t border-[#2A2520] text-center">
                <p className="text-xs text-[#9A9590]">
                  New to Elijah? <button className="text-gold hover:text-gold-hover font-medium transition-colors">Create an account</button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
