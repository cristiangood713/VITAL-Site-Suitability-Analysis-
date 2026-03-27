import { ComparisonTable } from '../components/ComparisonTable';
import { Site, SiteEvaluation } from '../types';

type ComparisonPageProps = {
  sites: Site[];
  evaluations: SiteEvaluation[];
};

export function ComparisonPage({ sites, evaluations }: ComparisonPageProps): JSX.Element {
  return (
    <section>
      <p className="print-note">Tip: use browser print to export this view as a clean one-page comparison handout.</p>
      <ComparisonTable sites={sites} evaluations={evaluations} />
    </section>
  );
}
