import { Site, SiteEvaluation } from '../types';
import { SiteDashboard } from '../components/SiteDashboard';

type DashboardPageProps = {
  sites: Site[];
  evaluations: SiteEvaluation[];
  onAdd: () => void;
  onEdit: (siteId: string) => void;
  onDelete: (siteId: string) => void;
};

export function DashboardPage({ sites, evaluations, onAdd, onEdit, onDelete }: DashboardPageProps): JSX.Element {
  return <SiteDashboard sites={sites} evaluations={evaluations} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />;
}
