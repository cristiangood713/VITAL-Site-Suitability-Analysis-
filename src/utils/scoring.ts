import { ScoreCategory } from '../types';

export const calculateWeightedScore = (categories: ScoreCategory[]): number => {
  if (!categories.length) {
    return 0;
  }

  const totalWeight = categories.reduce((acc, category) => acc + category.weight, 0);
  if (totalWeight === 0) {
    return 0;
  }

  const weightedSum = categories.reduce((acc, category) => acc + category.score * category.weight, 0);
  return Number((weightedSum / totalWeight).toFixed(2));
};

export const getScoreColor = (score: number): string => {
  if (score <= 2) {
    return 'var(--score-low)';
  }

  if (score === 3) {
    return 'var(--score-mid)';
  }

  return 'var(--score-high)';
};

export const getRecommendationTier = (score: number): string => {
  if (score >= 4.25) {
    return 'Strong Go';
  }

  if (score >= 3.25) {
    return 'Conditional Go';
  }

  return 'No-Go';
};
