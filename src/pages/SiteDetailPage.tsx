import { SiteForm } from '../components/SiteForm';
import { ScoreForm } from '../components/ScoreForm';
import { Site, SiteEvaluation } from '../types';

type SiteDetailPageProps = {
  site?: Site;
  evaluation?: SiteEvaluation;
  onSaveSite: (site: Site) => void;
  onSaveEvaluation: (evaluation: SiteEvaluation) => void;
  onBack: () => void;
};

export function SiteDetailPage({
  site,
  evaluation,
  onSaveSite,
  onSaveEvaluation,
  onBack
}: SiteDetailPageProps): JSX.Element {
  return (
    <section className="stacked-layout">
      <button className="button-ghost" onClick={onBack}>
        ← Back to Dashboard
      </button>
      <SiteForm initialSite={site} onSave={onSaveSite} />
      {site && <ScoreForm siteId={site.id} initialEvaluation={evaluation} onSave={onSaveEvaluation} />}
    </section>
  );
}
