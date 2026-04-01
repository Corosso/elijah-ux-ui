import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'terms' | 'privacy' | 'cookies';
}

const content = {
  terms: [
    { heading: '1. Acceptance of Terms', body: 'By accessing and using the Elijah private chauffeur service, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.' },
    { heading: '2. Service Description', body: 'Elijah provides premium private chauffeur and ground transportation services across major cities in the United States, including but not limited to New York, Los Angeles, Miami, Philadelphia, Boston, and Washington D.C.' },
    { heading: '3. Booking and Cancellation', body: 'All bookings are subject to vehicle availability. Cancellations made less than 2 hours before the scheduled pickup time may incur a cancellation fee of up to 50% of the estimated fare. No-shows will be charged the full estimated fare.' },
    { heading: '4. Pricing and Payment', body: 'Prices are calculated based on distance, duration, vehicle type, and time of service. All prices are quoted in US Dollars (USD) unless otherwise stated. Payment is accepted via credit card, debit card, or approved corporate accounts.' },
    { heading: '5. Passenger Conduct', body: 'Passengers are expected to treat vehicles and chauffeurs with respect. Smoking, consumption of illegal substances, and any form of harassment are strictly prohibited. Elijah reserves the right to terminate a trip for violations of conduct policies.' },
    { heading: '6. Liability', body: 'Elijah maintains comprehensive insurance coverage for all vehicles and passengers during active service. However, Elijah shall not be liable for delays caused by traffic, weather, road conditions, or other circumstances beyond our control.' },
    { heading: '7. Privacy', body: 'Your personal data is collected and processed in accordance with our Privacy Policy. We are committed to protecting your privacy and ensuring the security of your personal information.' },
    { heading: '8. Modifications', body: 'Elijah reserves the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to our website. Continued use of our services constitutes acceptance of modified terms.' },
  ],
  privacy: [
    { heading: '1. Information We Collect', body: 'We collect personal information including your name, email address, phone number, payment details, and location data necessary to provide our chauffeur services.' },
    { heading: '2. How We Use Your Information', body: 'Your information is used to process bookings, provide transportation services, communicate with you about your trips, process payments, and improve our service quality.' },
    { heading: '3. Data Sharing', body: 'We do not sell your personal data to third parties. Information may be shared with our chauffeurs (limited to trip details), payment processors, and as required by applicable U.S. federal and state law.' },
    { heading: '4. Data Security', body: 'We implement industry-standard security measures including encryption, secure servers, and access controls to protect your personal information from unauthorized access or disclosure.' },
    { heading: '5. Your Rights', body: 'Under applicable U.S. privacy regulations, including the CCPA where applicable, you have the right to access, update, rectify, and delete your personal data. Contact us at privacy@elijah.co to exercise these rights.' },
    { heading: '6. Data Retention', body: 'We retain your personal data for as long as your account is active or as needed to provide services. Trip history and invoices are retained for 5 years for tax and legal compliance.' },
  ],
  cookies: [
    { heading: '1. What Are Cookies', body: 'Cookies are small text files stored on your device when you visit our website. They help us provide a better user experience by remembering your preferences and settings.' },
    { heading: '2. Cookies We Use', body: 'We use essential cookies (required for site functionality), preference cookies (to remember your settings like dark mode), and analytics cookies (to understand how our site is used).' },
    { heading: '3. Third-Party Cookies', body: 'Our mapping services (Google Maps, CartoDB) may set their own cookies. Payment processors may also use cookies during the checkout process.' },
    { heading: '4. Managing Cookies', body: 'You can control cookies through your browser settings. Disabling essential cookies may affect site functionality. Preference cookies can be declined without impact to core services.' },
  ],
};

const titles = {
  terms: 'Terms & Conditions',
  privacy: 'Privacy Policy',
  cookies: 'Cookie Policy',
};

export function LegalModal({ isOpen, onClose, type }: LegalModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="legal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-bg-elevated rounded-xl shadow-2xl border border-border w-full max-w-lg mx-4 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
              <div>
                <h2 className="font-serif text-body-lg text-text-primary">{titles[type]}</h2>
                <p className="text-eyebrow-sm text-text-secondary mt-0.5">Last updated: March 2026</p>
              </div>
              <button onClick={onClose} className="p-1.5 text-text-secondary hover:text-gold transition-colors rounded-lg hover:bg-white/5">
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-5 overflow-y-auto flex-1 space-y-5">
              {content[type].map((section, i) => (
                <div key={i}>
                  <h3 className="text-caption font-semibold text-gold mb-2">{section.heading}</h3>
                  <p className="text-caption text-text-secondary">{section.body}</p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-border flex-shrink-0">
              <button
                onClick={onClose}
                className="w-full py-2 bg-gold hover:bg-gold-hover text-white text-caption font-medium rounded-lg active:scale-[0.97] transition-all"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
