import { Site, SiteEvaluation } from '../types';
import { calculateWeightedScore, getRecommendationTier, getScoreColor } from '../utils/scoring';

type ComparisonTableProps = {
  sites: Site[];
  evaluations: SiteEvaluation[];
};

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
      <h1>Comparison View</h1>
      <div className="table-scroll">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Criteria</th>
              {validRows.map(({ site }) => (
                <th key={site.id}>{site.address}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {criteria.map((criterion) => (
              <tr key={criterion.id}>
                <th>{criterion.label}</th>
                {validRows.map(({ site, evaluation }) => {
                  const score = evaluation.categories.find((category) => category.id === criterion.id)?.score ?? 0;
                  return (
                    <td key={`${site.id}-${criterion.id}`} style={{ color: getScoreColor(score) }}>
                      {score}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <th>Weighted Total</th>
              {validRows.map(({ site, evaluation }) => {
                const total = calculateWeightedScore(evaluation.categories);
                return <td key={`${site.id}-total`}>{total.toFixed(2)}</td>;
              })}
            </tr>
            <tr>
              <th>Recommendation</th>
              {validRows.map(({ site, evaluation }) => {
                const total = calculateWeightedScore(evaluation.categories);
                return (
                  <td key={`${site.id}-recommendation`}>
                    {evaluation.overallRecommendation || getRecommendationTier(total)}
                  </td>
                );
              })}
            </tr>
            <tr>
              <th>Summary</th>
              {validRows.map(({ site, evaluation }) => (
                <td key={`${site.id}-summary`} className="summary-cell">
                  {evaluation.summaryParagraph}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
