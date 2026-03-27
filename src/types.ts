export type RecommendationStatus = 'Pending' | 'Pursue' | 'Pass' | 'On Hold' | 'LOI Submitted';

export interface SiteScores {
  locationVisibility: 1 | 2 | 3 | 4 | 5;
  parkingAccess: 1 | 2 | 3 | 4 | 5;
  buildingCondition: 1 | 2 | 3 | 4 | 5;
  coTenancyQuality: 1 | 2 | 3 | 4 | 5;
  rentToMarketRatio: 1 | 2 | 3 | 4 | 5;
}

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
  scores: SiteScores;
  compositeScore: number;
  recommendation: RecommendationStatus;
}
