import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';

interface LegalPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <Link to="/" className="inline-flex items-center gap-2 text-caption text-gold hover:text-gold-hover mb-8 transition-colors">
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Home
      </Link>
      <h1 className="font-serif text-heading-sm text-text-primary mb-2">{title}</h1>
      <p className="text-eyebrow-sm text-text-secondary mb-8">Last updated: March 2026</p>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}
