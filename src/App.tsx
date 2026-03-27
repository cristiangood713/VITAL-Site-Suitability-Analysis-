import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppRouter } from './router';
import { deleteSite, getSites, saveSite } from './storage';
import { Site } from './types';

function extractSiteId(pathname: string): string | undefined {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] === 'site' && parts[1]) {
    return parts[1];
  }

  return undefined;
}

function AppShell(): JSX.Element {
  const [sites, setSites] = useState<Site[]>(() => getSites());
  const navigate = useNavigate();
  const location = useLocation();
  const siteId = extractSiteId(location.pathname);

  const selectedSite = useMemo(() => sites.find((site) => site.id === siteId), [siteId, sites]);

  const handleSaveSite = (site: Site) => {
    setSites(saveSite(site));
    navigate(`/site/${site.id}`);
  };

  const handleDeleteSite = (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this site?');
    if (!confirmed) {
      return;
    }

    setSites(deleteSite(id));
    if (siteId === id) {
      navigate('/');
    }
  };

  return (
    <div className="app-shell">
      <header className="top-nav">
        <div className="top-nav-inner">
          <div className="brand-mark">VITAL — Site Analysis</div>
          <nav className="nav-links">
            <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">
              Dashboard
            </Link>
            <Link className={`nav-link ${location.pathname.startsWith('/site') ? 'active' : ''}`} to="/site/new">
              Add Site
            </Link>
            <Link className={`nav-link ${location.pathname === '/comparison' ? 'active' : ''}`} to="/comparison">
              Comparison
            </Link>
          </nav>
        </div>
      </header>
      <main className="app-container">
        <AppRouter
          sites={sites}
          selectedSite={selectedSite}
          onAdd={() => navigate('/site/new')}
          onEdit={(id) => navigate(`/site/${id}`)}
          onDelete={handleDeleteSite}
          onSaveSite={handleSaveSite}
          onBack={() => navigate('/')}
        />
      </main>
    </div>
  );
}

export default AppShell;
