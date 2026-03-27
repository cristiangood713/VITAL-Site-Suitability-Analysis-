import { Route, Routes } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { SiteDetailPage } from './pages/SiteDetailPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { Site } from './types';

type AppRouterProps = {
  sites: Site[];
  selectedSite?: Site;
  onAdd: () => void;
  onEdit: (siteId: string) => void;
  onDelete: (siteId: string) => void;
  onSaveSite: (site: Site) => void;
  onBack: () => void;
};

export function AppRouter(props: AppRouterProps): JSX.Element {
  return (
    <Routes>
      <Route
        path="/"
        element={<DashboardPage sites={props.sites} onAdd={props.onAdd} onEdit={props.onEdit} onDelete={props.onDelete} />}
      />
      <Route
        path="/site/:siteId"
        element={<SiteDetailPage site={props.selectedSite} onSaveSite={props.onSaveSite} onBack={props.onBack} />}
      />
      <Route path="/comparison" element={<ComparisonPage sites={props.sites} />} />
    </Routes>
  );
}
