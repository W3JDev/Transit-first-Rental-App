import { SCORE_WEIGHTS } from './constants';

export function computeLivability(scores: {
  transit: number;
  safety: number;
  amenity: number;
  trust: number;
}): number {
  return (
    scores.transit * SCORE_WEIGHTS.transit +
    scores.safety * SCORE_WEIGHTS.safety +
    scores.amenity * SCORE_WEIGHTS.amenity +
    scores.trust * SCORE_WEIGHTS.trust
  );
}

export function computePriceConfidence(variance: number, recencyDays: number): number {
  const vScore = 1 - Math.min(variance / 1000, 1);
  const rScore = Math.max(1 - recencyDays / 30, 0);
  return Number(((vScore + rScore) / 2).toFixed(2));
}
