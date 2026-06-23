import { describe, expect, it } from 'vitest';
import { computeStats, normalizeValue, scoreDesigns } from './scoring';

const designs = [
  { id: 'one', name: 'One', values: { mass: 10, strength: 50 } },
  { id: 'two', name: 'Two', values: { mass: 20, strength: 100 } },
  { id: 'three', name: 'Three', values: { mass: null, strength: 75 } },
];

describe('scoring engine', () => {
  it('normalises higher and lower values with the Python-equivalent behaviour', () => {
    expect(normalizeValue(50, 0, 100, true)).toBe(0.5);
    expect(normalizeValue(0, 0, 100, false)).toBe(1);
    expect(normalizeValue(50, 50, 50, true)).toBe(1);
    expect(normalizeValue(null, 0, 100, true)).toBe(0);
  });

  it('calculates criterion statistics from numeric values only', () => {
    expect(computeStats(designs, ['mass'])).toEqual({ mass: { min: 10, max: 20 } });
  });

  it('scores, sorts, and ranks designs using weighted criteria', () => {
    const result = scoreDesigns(designs, {
      mass: { enabled: true, direction: 'lower', weight: 2 },
      strength: { enabled: true, direction: 'higher', weight: 1 },
    });
    expect(result.map((design) => design.name)).toEqual(['One', 'Two', 'Three']);
    expect(result[0]).toMatchObject({ rank: 1, totalScore: 0.667, scores: { mass: 1, strength: 0 } });
    expect(result[2].scores.mass).toBe(0);
  });
});
