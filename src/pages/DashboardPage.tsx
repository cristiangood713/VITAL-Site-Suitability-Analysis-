import { Site } from '../types';
import { SiteDashboard } from '../components/SiteDashboard';

type DashboardPageProps = {
  sites: Site[];
  onAdd: () => void;
  onEdit: (siteId: string) => void;
  onDelete: (siteId: string) => void;
};

export function DashboardPage({ sites, onAdd, onEdit, onDelete }: DashboardPageProps): JSX.Element {
  return <SiteDashboard sites={sites} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />;
}
