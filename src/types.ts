export interface Site {
  id: string;
  address: string;
  city: string;
  submarket: string;
  sizeSF: number;
  rentNRSF: number;
  estNNN: number;
  landlord: string;
  buildingType: string;
  keyPhysicalFeatures: string;
  coTenants: string;
  notes: string;
}

export interface ScoreCategory {
  id: string;
  label: string;
  score: 1 | 2 | 3 | 4 | 5;
  comments: string;
  weight: number;
}

export interface SiteEvaluation {
  siteId: string;
  categories: ScoreCategory[];
  overallRecommendation: string;
  summaryParagraph: string;
}

export const defaultCriteriaConfig: Omit<ScoreCategory, 'score' | 'comments'>[] = [
  { id: 'trade-area-strength', label: 'Trade Area Strength', weight: 0.2 },
  { id: 'access-parking', label: 'Access & Parking', weight: 0.15 },
  { id: 'visibility-signage', label: 'Visibility & Signage', weight: 0.15 },
  { id: 'competitive-landscape', label: 'Competitive Landscape', weight: 0.15 },
  { id: 'brand-fit', label: 'Brand Fit', weight: 0.2 },
  { id: 'economics', label: 'Economics', weight: 0.15 }
];

export const createDefaultCategories = (): ScoreCategory[] =>
  defaultCriteriaConfig.map((criterion) => ({
    ...criterion,
    score: 3,
    comments: ''
  }));
