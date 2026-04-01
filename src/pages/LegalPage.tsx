import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, ScrollTextIcon, ShieldCheckIcon, CookieIcon } from 'lucide-react';
import { legalContent, legalTitles } from '../data/legal';

type LegalTab = 'terms' | 'privacy' | 'cookies';

const tabs: { key: LegalTab; label: string; icon: React.ElementType }[] = [
  { key: 'terms', label: legalTitles.terms, icon: ScrollTextIcon },
  { key: 'privacy', label: legalTitles.privacy, icon: ShieldCheckIcon },
  { key: 'cookies', label: legalTitles.cookies, icon: CookieIcon },
];

export function LegalPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<LegalTab>('terms');

  // Set active tab from URL hash on mount or navigation
  useEffect(() => {
    const hash = location.hash.replace('#', '') as LegalTab;
    if (hash && ['terms', 'privacy', 'cookies'].includes(hash)) {
      setActiveTab(hash);
    }
    window.scrollTo(0, 0);
  }, [location.hash]);

  const sections = legalContent[activeTab];

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="bg-bg-surface border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-caption text-gold hover:text-gold-hover mb-8 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Home
          </Link>

          <h1 className="font-serif text-heading-md-fluid text-text-primary mb-3">Legal Information</h1>
          <p className="text-text-secondary text-caption max-w-2xl">
            Everything you need to know about how we handle your data, our service terms, and cookie usage.
            Last updated: March 2026.
          </p>

          {/* Tabs */}
          <div className="flex gap-1 mt-8 border-b border-border -mb-px overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    window.history.replaceState(null, '', `/legal#${tab.key}`);
                  }}
                  className={`flex items-center gap-2 px-4 py-3 text-caption font-medium whitespace-nowrap border-b-2 transition-colors ${
                    isActive
                      ? 'border-gold text-gold'
                      : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          <motion.article
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-0"
          >
            {/* Article Header */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                  {(() => {
                    const TabIcon = tabs.find(t => t.key === activeTab)!.icon;
                    return <TabIcon className="w-5 h-5 text-gold" />;
                  })()}
                </div>
                <div>
                  <h2 className="font-serif text-heading-xs text-text-primary">{legalTitles[activeTab]}</h2>
                  <p className="text-eyebrow-sm text-text-secondary">Effective March 2026</p>
                </div>
              </div>
              <div className="w-full h-px bg-border mt-6" />
            </div>

            {/* Sections */}
            {sections.map((section, i) => (
              <div key={i} className="group">
                <div className="py-6">
                  <h3 className="text-body font-semibold text-gold mb-3 font-serif">{section.heading}</h3>
                  <p className="text-caption text-text-secondary leading-[1.8] max-w-3xl">{section.body}</p>
                </div>
                {i < sections.length - 1 && (
                  <div className="w-full h-px bg-border/50" />
                )}
              </div>
            ))}
          </motion.article>
        </AnimatePresence>

        {/* Footer navigation */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-wrap gap-6">
            {tabs.filter(t => t.key !== activeTab).map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  window.history.replaceState(null, '', `/legal#${tab.key}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-caption text-text-secondary hover:text-gold transition-colors flex items-center gap-2"
              >
                <tab.icon className="w-4 h-4" />
                Read {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
