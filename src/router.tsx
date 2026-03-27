import { Route, Routes } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { SiteDetailPage } from './pages/SiteDetailPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { Site, SiteEvaluation } from './types';

type AppRouterProps = {
  sites: Site[];
  evaluations: SiteEvaluation[];
  selectedSite?: Site;
  selectedEvaluation?: SiteEvaluation;
  onAdd: () => void;
  onEdit: (siteId: string) => void;
  onDelete: (siteId: string) => void;
  onSaveSite: (site: Site) => void;
  onSaveEvaluation: (evaluation: SiteEvaluation) => void;
  onBack: () => void;
};

export function AppRouter(props: AppRouterProps): JSX.Element {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <DashboardPage
            sites={props.sites}
            evaluations={props.evaluations}
            onAdd={props.onAdd}
            onEdit={props.onEdit}
            onDelete={props.onDelete}
          />
        }
      />
      <Route
        path="/site/:siteId"
        element={
          <SiteDetailPage
            site={props.selectedSite}
            evaluation={props.selectedEvaluation}
            onSaveSite={props.onSaveSite}
            onSaveEvaluation={props.onSaveEvaluation}
            onBack={props.onBack}
          />
        }
      />
      <Route path="/comparison" element={<ComparisonPage sites={props.sites} evaluations={props.evaluations} />} />
    </Routes>
  );
}
