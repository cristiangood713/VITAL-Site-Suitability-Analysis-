import { Site, SiteEvaluation } from './types';

const SITE_STORAGE_KEY = 'vital.sites';
const EVAL_STORAGE_KEY = 'vital.evaluations';

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const safeParse = <T>(input: string | null, fallback: T): T => {
  if (!input) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(input) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const safeWrite = <T>(key: string, value: T): void => {
  if (!isBrowser) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Graceful no-op fallback if storage is full/blocked.
  }
};

export const getSites = (): Site[] => {
  if (!isBrowser) {
    return [];
  }

  const parsed = safeParse<unknown>(window.localStorage.getItem(SITE_STORAGE_KEY), []);
  return Array.isArray(parsed) ? (parsed as Site[]) : [];
};

export const saveSite = (site: Site): Site[] => {
  const currentSites = getSites();
  const nextSites = currentSites.some((current) => current.id === site.id)
    ? currentSites.map((current) => (current.id === site.id ? site : current))
    : [...currentSites, site];

  safeWrite(SITE_STORAGE_KEY, nextSites);
  return nextSites;
};

export const deleteSite = (siteId: string): Site[] => {
  const nextSites = getSites().filter((site) => site.id !== siteId);
  safeWrite(SITE_STORAGE_KEY, nextSites);

  const nextEvaluations = getEvaluations().filter((evaluation) => evaluation.siteId !== siteId);
  safeWrite(EVAL_STORAGE_KEY, nextEvaluations);

  return nextSites;
};

export const getEvaluations = (): SiteEvaluation[] => {
  if (!isBrowser) {
    return [];
  }

  const parsed = safeParse<unknown>(window.localStorage.getItem(EVAL_STORAGE_KEY), []);
  return Array.isArray(parsed) ? (parsed as SiteEvaluation[]) : [];
};

export const saveEvaluation = (evaluation: SiteEvaluation): SiteEvaluation[] => {
  const currentEvaluations = getEvaluations();
  const nextEvaluations = currentEvaluations.some((current) => current.siteId === evaluation.siteId)
    ? currentEvaluations.map((current) => (current.siteId === evaluation.siteId ? evaluation : current))
    : [...currentEvaluations, evaluation];

  safeWrite(EVAL_STORAGE_KEY, nextEvaluations);
  return nextEvaluations;
};
