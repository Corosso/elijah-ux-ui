import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-bg-page dark:bg-bg-primary flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <div />
        <div className="flex items-center gap-4">
          <span className="text-caption text-text-secondary">Don&apos;t have an account?</span>
          <Link
            to="/signup"
            className="px-5 py-2 border border-border text-caption font-semibold text-text-primary uppercase tracking-wider rounded-sm hover:border-gold hover:text-gold active:scale-[0.97] transition-all"
          >
            Signup
          </Link>
        </div>
      </div>

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-start pt-8 md:pt-12 px-4">
        {/* Logo */}
        <div className="mb-8">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Elijah" className="h-8 w-auto" />
            <span className="text-logo text-text-primary">Elijah</span>
          </Link>
        </div>

        {/* Card */}
        <div className="w-full max-w-md bg-white dark:bg-bg-elevated rounded-lg shadow-luxury dark:shadow-luxury-dark p-8 md:p-10">
          <h1 className="text-heading-xs font-serif text-text-primary mb-8">Log in to your account</h1>

          <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email address"
                required
                className="w-full border border-border rounded px-4 py-3.5 text-caption text-text-primary placeholder:text-text-secondary/60 bg-transparent focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  required
                  className="w-full border border-border rounded px-4 py-3.5 pr-11 text-caption text-text-primary placeholder:text-text-secondary/60 bg-transparent focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOffIcon className="w-4.5 h-4.5" /> : <EyeIcon className="w-4.5 h-4.5" />}
                </button>
              </div>
              <Link to="#" className="text-caption text-gold hover:text-gold-hover transition-colors mt-2 inline-block">
                Forgot your password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gold hover:bg-gold-hover text-white font-semibold rounded uppercase tracking-wider text-caption active:scale-[0.97] transition-all mt-2"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
