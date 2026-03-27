import { ComparisonTable } from '../components/ComparisonTable';
import { Site } from '../types';

type ComparisonPageProps = {
  sites: Site[];
};

export function ComparisonPage({ sites }: ComparisonPageProps): JSX.Element {
  return (
    <section className="page-stack">
      <div className="page-intro">
        <div>
          <h1 className="page-title">Comparison View</h1>
          <p className="page-subtitle">Side-by-side brokerage review for shortlisted properties.</p>
        </div>
        <button className="screen-only" onClick={() => window.print()}>
          Print / Export
        </button>
      </div>
      <p className="print-note">Tip: use Print / Export to generate a clean one-page comparison handout.</p>
      <div className="print-header">
        <h1>VITAL Climbing Gym — Site Evaluation</h1>
        <p>{new Date().toLocaleDateString()}</p>
      </div>
      <ComparisonTable sites={sites} />
    </section>
  );
}
