import { Site, SiteEvaluation } from '../types';
import { SiteCard } from './SiteCard';

type SiteDashboardProps = {
  sites: Site[];
  evaluations: SiteEvaluation[];
  onAdd: () => void;
  onEdit: (siteId: string) => void;
  onDelete: (siteId: string) => void;
};

export function SiteDashboard({ sites, evaluations, onAdd, onEdit, onDelete }: SiteDashboardProps): JSX.Element {
  const evaluationMap = new Map(evaluations.map((evaluation) => [evaluation.siteId, evaluation]));

  return (
    <section>
      <div className="toolbar">
        <h1>Site Dashboard</h1>
        <button onClick={onAdd}>Add Site</button>
      </div>
      {sites.length === 0 ? (
        <p className="panel">No sites saved yet. Add your first candidate site to get started.</p>
      ) : (
        <div className="site-list">
          {sites.map((site) => (
            <SiteCard
              key={site.id}
              site={site}
              evaluation={evaluationMap.get(site.id)}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
