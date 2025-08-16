import { computeLivability, computePriceConfidence } from '../src/scoring';

describe('scoring utils', () => {
  it('computes livability', () => {
    const result = computeLivability({ transit: 1, safety: 1, amenity: 1, trust: 1 });
    expect(result).toBeCloseTo(1);
  });

  it('computes price confidence', () => {
    const result = computePriceConfidence(100, 5);
    expect(result).toBeGreaterThan(0);
  });
});
