import { LegalPageLayout } from '../components/LegalPageLayout';
import { legalContent, legalTitles } from '../data/legal';

export function TermsPage() {
  return (
    <LegalPageLayout title={legalTitles.terms}>
      {legalContent.terms.map((section, i) => (
        <div key={i}>
          <h3 className="text-caption font-semibold text-gold mb-2">{section.heading}</h3>
          <p className="text-caption text-text-secondary">{section.body}</p>
        </div>
      ))}
    </LegalPageLayout>
  );
}
