import { SiteForm } from '../components/SiteForm';
import { Site } from '../types';

type SiteDetailPageProps = {
  site?: Site;
  onSaveSite: (site: Site) => void;
  onBack: () => void;
};

export function SiteDetailPage({ site, onSaveSite, onBack }: SiteDetailPageProps): JSX.Element {
  return (
    <section className="stacked-layout">
      <div className="page-intro">
        <div>
          <h1 className="page-title">Site Detail</h1>
          <p className="page-subtitle">Document property specifics and underwriting rationale.</p>
        </div>
        <button className="button-ghost screen-only" onClick={onBack}>
          Back to Dashboard
        </button>
      </div>
      <SiteForm initialSite={site} onSave={onSaveSite} />
    </section>
  );
}
