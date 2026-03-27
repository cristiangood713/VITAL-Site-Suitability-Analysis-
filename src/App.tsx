import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppRouter } from './router';
import { deleteSite, getEvaluations, getSites, saveEvaluation, saveSite } from './storage';
import { Site, SiteEvaluation } from './types';

function extractSiteId(pathname: string): string | undefined {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] === 'site' && parts[1]) {
    return parts[1];
  }

  return undefined;
}

function AppShell(): JSX.Element {
  const [sites, setSites] = useState<Site[]>(() => getSites());
  const [evaluations, setEvaluations] = useState<SiteEvaluation[]>(() => getEvaluations());
  const navigate = useNavigate();
  const location = useLocation();
  const siteId = extractSiteId(location.pathname);

  const selectedSite = useMemo(() => sites.find((site) => site.id === siteId), [siteId, sites]);
  const selectedEvaluation = useMemo(
    () => evaluations.find((evaluation) => evaluation.siteId === siteId),
    [siteId, evaluations]
  );

  const handleSaveSite = (site: Site) => {
    setSites(saveSite(site));
    navigate(`/site/${site.id}`);
  };

  const handleDeleteSite = (id: string) => {
    setSites(deleteSite(id));
    setEvaluations(getEvaluations());
    if (siteId === id) {
      navigate('/');
    }
  };

  const handleSaveEvaluation = (evaluation: SiteEvaluation) => {
    setEvaluations(saveEvaluation(evaluation));
  };

  return (
    <div className="app-container">
      <header>
        <h1>VITAL Site Suitability Analysis</h1>
        <nav>
          <Link className={location.pathname === '/' ? 'active' : ''} to="/">
            Dashboard
          </Link>
          <Link className={location.pathname.startsWith('/site') ? 'active' : ''} to={siteId ? `/site/${siteId}` : '/site/new'}>
            Site Detail
          </Link>
          <Link className={location.pathname === '/comparison' ? 'active' : ''} to="/comparison">
            Comparison
          </Link>
        </nav>
      </header>
      <main>
        <AppRouter
          sites={sites}
          evaluations={evaluations}
          selectedSite={selectedSite}
          selectedEvaluation={selectedEvaluation}
          onAdd={() => navigate('/site/new')}
          onEdit={(id) => navigate(`/site/${id}`)}
          onDelete={handleDeleteSite}
          onSaveSite={handleSaveSite}
          onSaveEvaluation={handleSaveEvaluation}
          onBack={() => navigate('/')}
        />
      </main>
    </div>
  );
}

export default AppShell;
