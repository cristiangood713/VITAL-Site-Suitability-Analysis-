import { Site, SiteEvaluation } from '../types';
import { calculateWeightedScore, getRecommendationTier } from '../utils/scoring';

type ComparisonTableProps = {
  sites: Site[];
  evaluations: SiteEvaluation[];
};

function scoreColor(score: number): string {
  if (score >= 4) {
    return 'var(--color-score-high)';
  }

  if (score === 3) {
    return 'var(--color-score-mid)';
  }

  return 'var(--color-score-low)';
}

export function ComparisonTable({ sites, evaluations }: ComparisonTableProps): JSX.Element {
  const validRows = sites
    .map((site) => ({ site, evaluation: evaluations.find((evaluation) => evaluation.siteId === site.id) }))
    .filter((row): row is { site: Site; evaluation: SiteEvaluation } => Boolean(row.evaluation));

  if (validRows.length === 0) {
    return <p className="panel">Save at least one site evaluation to view side-by-side comparison.</p>;
  }

  const criteria = validRows[0].evaluation.categories;

  return (
    <section className="panel print-surface">
      <div className="table-scroll">
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="sticky-col">Site Name</th>
              {criteria.map((criterion) => (
                <th key={criterion.id}>{criterion.label}</th>
              ))}
              <th>Weighted Total</th>
              <th>Recommendation</th>
              <th>Summary</th>
            </tr>
          </thead>
          <tbody>
            {validRows.map(({ site, evaluation }) => {
              const total = calculateWeightedScore(evaluation.categories);

              return (
                <tr key={site.id}>
                  <th className="sticky-col">{site.address}</th>
                  {criteria.map((criterion) => {
                    const score = evaluation.categories.find((category) => category.id === criterion.id)?.score ?? 0;
                    return (
                      <td key={`${site.id}-${criterion.id}`}>
                        <div className="score-cell">
                          <span className="score-bar-track">
                            <span
                              className="score-bar-fill"
                              style={{
                                width: `${(score / 5) * 100}%`,
                                background: scoreColor(score)
                              }}
                            />
                          </span>
                          <span className="score-value">{score}</span>
                        </div>
                      </td>
                    );
                  })}
                  <td>{total.toFixed(2)}</td>
                  <td>{evaluation.overallRecommendation || getRecommendationTier(total)}</td>
                  <td className="summary-cell">{evaluation.summaryParagraph}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
