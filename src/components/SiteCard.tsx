import { Site, SiteEvaluation } from '../types';
import { calculateWeightedScore, getRecommendationTier } from '../utils/scoring';

type SiteCardProps = {
  site: Site;
  evaluation?: SiteEvaluation;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function SiteCard({ site, evaluation, onEdit, onDelete }: SiteCardProps): JSX.Element {
  const score = evaluation ? calculateWeightedScore(evaluation.categories) : null;

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
            {site.landlord}
          </p>
          <p>
            <span className="label-caps">Building Type</span>
            {site.buildingType}
          </p>
        </div>
      </div>
      <div className="site-info-grid">
        <div className="site-score">
          <span className="label-caps">Score</span>
          <strong>{score ? `${score.toFixed(2)} / 5` : 'Not scored'}</strong>
        </div>
        <div>
          <span className="label-caps">Recommendation</span>
          <p>{evaluation?.overallRecommendation || (score ? getRecommendationTier(score) : 'Pending')}</p>
        </div>
      </div>
      <div className="actions-row">
        <button onClick={() => onEdit(site.id)}>Edit</button>
        <button className="button-danger" onClick={() => onDelete(site.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}
