import { ComparisonTable } from '../components/ComparisonTable';
import { Site, SiteEvaluation } from '../types';

type ComparisonPageProps = {
  sites: Site[];
  evaluations: SiteEvaluation[];
};

export function ComparisonPage({ sites, evaluations }: ComparisonPageProps): JSX.Element {
  return (
    <section className="page-stack">
      <div className="page-intro">
        <div>
          <h1 className="page-title">Comparison View</h1>
          <p className="page-subtitle">Side-by-side brokerage review for shortlisted properties.</p>
        </div>
      </div>
      <p className="print-note">Tip: use browser print to export this view as a clean one-page comparison handout.</p>
      <div className="print-header">
        <h1>VITAL Climbing Gym — Site Evaluation</h1>
        <p>{new Date().toLocaleDateString()}</p>
      </div>
      <ComparisonTable sites={sites} evaluations={evaluations} />
    </section>
  );
}
