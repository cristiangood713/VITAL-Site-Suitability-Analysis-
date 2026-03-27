import { RecommendationStatus, Site } from '../types';

type SiteCardProps = {
  site: Site;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

function getScoreBadgeClass(score: number): string {
  if (score >= 80) {
    return 'badge badge-green';
  }

  if (score >= 60) {
    return 'badge badge-amber';
  }

  return 'badge badge-red';
}

function getRecommendationClass(recommendation: RecommendationStatus): string {
  if (recommendation === 'Pursue') {
    return 'badge badge-green';
  }
  if (recommendation === 'Pass') {
    return 'badge badge-red';
  }
  if (recommendation === 'LOI Submitted') {
    return 'badge badge-blue';
  }
  return 'badge badge-amber';
}

export function SiteCard({ site, onEdit, onDelete }: SiteCardProps): JSX.Element {
  return (
    <article className="panel card site-card">
      <div className="site-info-grid">
        <div className="site-meta">
          <h3>{site.address}</h3>
          <p>
            {site.city} · {site.submarket}
          </p>
          <p>
            {site.sizeSF.toLocaleString()} SF · ${site.rentNRSF.toFixed(2)} NR/SF · ${site.estNNN.toFixed(2)} NNN
          </p>
        </div>
        <div className="site-meta">
          <p>
            <span className="label-caps">Landlord</span>
            {site.landlord || '—'}
          </p>
          <p>
            <span className="label-caps">Building Type</span>
            {site.buildingType || '—'}
          </p>
        </div>
      </div>
      <div className="site-info-grid">
        <div>
          <span className="label-caps">Composite Score</span>
          <p>
            <span className={getScoreBadgeClass(site.compositeScore)}>{site.compositeScore.toFixed(2)} / 100</span>
          </p>
        </div>
        <div>
          <span className="label-caps">Recommendation</span>
          <p>
            <span className={getRecommendationClass(site.recommendation)}>{site.recommendation}</span>
          </p>
        </div>
      </div>
      <div className="actions-row card-actions">
        <button onClick={() => onEdit(site.id)}>Edit</button>
        <button className="button-danger delete-button" onClick={() => onDelete(site.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}
