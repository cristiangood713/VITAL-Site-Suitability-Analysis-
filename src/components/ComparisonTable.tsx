import { Site } from '../types';

type ComparisonTableProps = {
  sites: Site[];
};

function isBestValue(field: 'sizeSF' | 'rentNRSF' | 'estNNN' | 'compositeScore', value: number, sites: Site[]): boolean {
  const values = sites.map((site) => site[field]);
  if (values.length === 0) {
    return false;
  }

  if (field === 'sizeSF' || field === 'compositeScore') {
    return value === Math.max(...values);
  }

  return value === Math.min(...values);
}

export function ComparisonTable({ sites }: ComparisonTableProps): JSX.Element {
  if (sites.length === 0) {
    return <p className="panel">No sites available yet. Add at least one site to compare.</p>;
  }

  return (
    <section className="panel print-surface">
      <div className="table-scroll">
        <table className="comparison-table comparison-table-sites">
          <thead>
            <tr>
              <th className="sticky-col">Field</th>
              {sites.map((site) => (
                <th key={site.id}>{site.address || 'Untitled Site'}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="sticky-col">City</th>
              {sites.map((site) => (
                <td key={`${site.id}-city`}>{site.city || '—'}</td>
              ))}
            </tr>
            <tr>
              <th className="sticky-col">Submarket</th>
              {sites.map((site) => (
                <td key={`${site.id}-submarket`}>{site.submarket || '—'}</td>
              ))}
            </tr>
            <tr>
              <th className="sticky-col">Size (SF)</th>
              {sites.map((site) => (
                <td key={`${site.id}-size`} className={isBestValue('sizeSF', site.sizeSF, sites) ? 'best-value' : ''}>
                  {site.sizeSF.toLocaleString()}
                </td>
              ))}
            </tr>
            <tr>
              <th className="sticky-col">Rent ($/NRSF)</th>
              {sites.map((site) => (
                <td key={`${site.id}-rent`} className={isBestValue('rentNRSF', site.rentNRSF, sites) ? 'best-value' : ''}>
                  ${site.rentNRSF.toFixed(2)}
                </td>
              ))}
            </tr>
            <tr>
              <th className="sticky-col">NNN ($/SF)</th>
              {sites.map((site) => (
                <td key={`${site.id}-nnn`} className={isBestValue('estNNN', site.estNNN, sites) ? 'best-value' : ''}>
                  ${site.estNNN.toFixed(2)}
                </td>
              ))}
            </tr>
            <tr>
              <th className="sticky-col">Composite Score</th>
              {sites.map((site) => (
                <td
                  key={`${site.id}-score`}
                  className={isBestValue('compositeScore', site.compositeScore, sites) ? 'best-value' : ''}
                >
                  {site.compositeScore.toFixed(2)} / 100
                </td>
              ))}
            </tr>
            <tr>
              <th className="sticky-col">Recommendation</th>
              {sites.map((site) => (
                <td key={`${site.id}-recommendation`}>{site.recommendation}</td>
              ))}
            </tr>
            <tr>
              <th className="sticky-col">Landlord</th>
              {sites.map((site) => (
                <td key={`${site.id}-landlord`}>{site.landlord || '—'}</td>
              ))}
            </tr>
            <tr>
              <th className="sticky-col">Building Type</th>
              {sites.map((site) => (
                <td key={`${site.id}-building`}>{site.buildingType || '—'}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
