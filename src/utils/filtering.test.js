import { describe, expect, it } from 'vitest';
import { applyFilters } from './filtering';

describe('applyFilters', () => {
  it('keeps only designs within active numeric filters', () => {
    const designs = [
      { name: 'A', values: { mass: 10 } },
      { name: 'B', values: { mass: 20 } },
      { name: 'C', values: { mass: null } },
    ];
    const result = applyFilters(designs, {
      mass: { minFilter: '12', maxFilter: '22' },
    });

    expect(result.map((design) => design.name)).toEqual(['B']);
  });
});
