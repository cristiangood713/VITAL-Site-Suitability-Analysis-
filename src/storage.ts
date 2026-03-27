import { RecommendationStatus, Site, SiteScores } from './types';

const SITE_STORAGE_KEY = 'vital.sites';

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const defaultScores: SiteScores = {
  locationVisibility: 3,
  parkingAccess: 3,
  buildingCondition: 3,
  coTenancyQuality: 3,
  rentToMarketRatio: 3
};

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

const scoreWeights = {
  locationVisibility: 0.25,
  parkingAccess: 0.2,
  buildingCondition: 0.2,
  coTenancyQuality: 0.2,
  rentToMarketRatio: 0.15
} as const;

export const calculateCompositeScore = (scores: SiteScores): number => {
  const weighted =
    scores.locationVisibility * scoreWeights.locationVisibility +
    scores.parkingAccess * scoreWeights.parkingAccess +
    scores.buildingCondition * scoreWeights.buildingCondition +
    scores.coTenancyQuality * scoreWeights.coTenancyQuality +
    scores.rentToMarketRatio * scoreWeights.rentToMarketRatio;

  return Number((weighted * 20).toFixed(2));
};

const normalizeRecommendation = (recommendation: unknown): RecommendationStatus => {
  const allowed: RecommendationStatus[] = ['Pending', 'Pursue', 'Pass', 'On Hold', 'LOI Submitted'];
  return allowed.includes(recommendation as RecommendationStatus)
    ? (recommendation as RecommendationStatus)
    : 'Pending';
};

const normalizeSite = (site: Partial<Site> & { id: string }): Site => {
  const scores: SiteScores = {
    ...defaultScores,
    ...(site.scores ?? {})
  };

  return {
    id: site.id,
    address: site.address ?? '',
    city: site.city ?? '',
    submarket: site.submarket ?? '',
    sizeSF: Number(site.sizeSF ?? 0),
    rentNRSF: Number(site.rentNRSF ?? 0),
    estNNN: Number(site.estNNN ?? 0),
    landlord: site.landlord ?? '',
    buildingType: site.buildingType ?? '',
    keyPhysicalFeatures: site.keyPhysicalFeatures ?? '',
    coTenants: site.coTenants ?? '',
    notes: site.notes ?? '',
    scores,
    compositeScore: Number(site.compositeScore ?? calculateCompositeScore(scores)),
    recommendation: normalizeRecommendation(site.recommendation)
  };
};

export const getSites = (): Site[] => {
  if (!isBrowser) {
    return [];
  }

  const parsed = safeParse<unknown>(window.localStorage.getItem(SITE_STORAGE_KEY), []);
  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .filter((site): site is Partial<Site> & { id: string } => Boolean(site && typeof (site as Site).id === 'string'))
    .map(normalizeSite);
};

export const saveSite = (site: Site): Site[] => {
  const normalized = normalizeSite(site);
  const currentSites = getSites();
  const nextSites = currentSites.some((current) => current.id === normalized.id)
    ? currentSites.map((current) => (current.id === normalized.id ? normalized : current))
    : [...currentSites, normalized];

  safeWrite(SITE_STORAGE_KEY, nextSites);
  return nextSites;
};

export const deleteSite = (siteId: string): Site[] => {
  const nextSites = getSites().filter((site) => site.id !== siteId);
  safeWrite(SITE_STORAGE_KEY, nextSites);
  return nextSites;
};

export const getDefaultScores = (): SiteScores => ({ ...defaultScores });
