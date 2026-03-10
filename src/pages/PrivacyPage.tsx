import { LegalPageLayout } from '../components/LegalPageLayout';
import { legalContent, legalTitles } from '../data/legal';

export function PrivacyPage() {
  return (
    <LegalPageLayout title={legalTitles.privacy}>
      {legalContent.privacy.map((section, i) => (
        <div key={i}>
          <h3 className="text-sm font-semibold text-gold mb-2">{section.heading}</h3>
          <p className="text-sm text-text-secondary leading-relaxed">{section.body}</p>
        </div>
      ))}
    </LegalPageLayout>
  );
}
