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
    <article className="panel site-card">
      <div>
        <h3>{site.address}</h3>
        <p>
          {site.city} · {site.submarket}
        </p>
        <p>
          {site.sizeSF.toLocaleString()} SF · ${site.rentNRSF.toFixed(2)} NR/SF · ${site.estNNN.toFixed(2)} NNN
        </p>
      </div>
      <div>
        <p>
          <strong>Landlord:</strong> {site.landlord}
        </p>
        <p>
          <strong>Type:</strong> {site.buildingType}
        </p>
      </div>
      <div>
        <p>
          <strong>Score:</strong> {score ? `${score.toFixed(2)} / 5` : 'Not scored'}
        </p>
        <p>
          <strong>Recommendation:</strong>{' '}
          {evaluation?.overallRecommendation || (score ? getRecommendationTier(score) : 'Pending')}
        </p>
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
