import { useState } from 'react';
import { CheckIcon } from 'lucide-react';
import type { PricingBreakdown } from '../../utils/pricing';
import { PAGE_INPUT } from './constants';
import { RouteSummary } from './RouteSummary';

interface LoginContentProps {
  origin: string;
  destination: string;
  date: string;
  time: string;
  breakdown: PricingBreakdown;
  onEdit: () => void;
  onContinue: (mode: 'guest' | 'account', data: { email: string; firstName?: string; lastName?: string; phone?: string }) => void;
}

export function LoginContent({ origin, destination, date, time, breakdown: _breakdown, onEdit, onContinue }: LoginContentProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [loginEmail, setLoginEmail] = useState('');

  return (
    <>
      <RouteSummary origin={origin} destination={destination} date={date} time={time} onEdit={onEdit} />
      <h2 className="text-eyebrow-sm sm:text-eyebrow text-gold mb-4 sm:mb-6">Step 3 of 5 — Login</h2>

      <button
        onClick={() => onContinue('guest', { email: 'guest@elijah.co', firstName: 'Guest', lastName: 'User', phone: '+1 (800) 555-0199' })}
        className="mb-6 w-full max-w-lg py-3 border border-border text-text-secondary font-bold rounded active:scale-[0.97] transition-all uppercase tracking-wider text-caption hover:border-gold hover:text-gold"
      >SKIP — CONTINUE AS GUEST</button>

      <div className="flex flex-col lg:flex-row gap-5 sm:gap-8">
        {/* Continue as Guest */}
        <div className="flex-1">
          <h3 className="text-body-lg font-bold text-text-primary mb-4 sm:mb-6">Continue as Guest</h3>
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="text-caption text-text-secondary mb-1 block">Email address *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className={PAGE_INPUT} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-caption text-text-secondary mb-1 block">First name *</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className={PAGE_INPUT} />
              </div>
              <div>
                <label className="text-caption text-text-secondary mb-1 block">Last name *</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" className={PAGE_INPUT} />
              </div>
            </div>
            <div>
              <label className="text-caption text-text-secondary mb-1 block">Phone *</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+57" className={PAGE_INPUT} />
            </div>
            <button
              onClick={() => onContinue('guest', { email, firstName, lastName, phone })}
              disabled={!email || !firstName || !lastName || !phone}
              className="w-full py-3 border-2 border-gold text-gold font-bold rounded active:scale-[0.97] transition-all uppercase tracking-wider text-caption hover:bg-gold hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >CONTINUE AS GUEST</button>
          </div>
        </div>

        {/* Login / Create Account */}
        <div className="flex-1">
          <h3 className="text-body-lg font-bold text-text-primary mb-4 sm:mb-6">Login or Create account</h3>
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="text-caption text-text-secondary mb-1 block">Email address</label>
              <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Email address" className={PAGE_INPUT} />
            </div>
            <button
              onClick={() => onContinue('account', { email: loginEmail })}
              disabled={!loginEmail}
              className="w-full py-3 bg-gold hover:bg-gold-hover text-white font-bold rounded active:scale-[0.97] transition-all uppercase tracking-wider text-caption disabled:opacity-50 disabled:cursor-not-allowed"
            >CONTINUE</button>
          </div>

          <div className="mt-6">
            <h4 className="text-caption font-medium text-text-primary mb-3">Why do I need an account?</h4>
            <ul className="space-y-2">
              {[
                'Book rides even faster using stored account details.',
                'Modify trip details.',
                'Access invoices and payment receipts.',
                'Reporting tools.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-caption text-text-secondary">
                  <CheckIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
