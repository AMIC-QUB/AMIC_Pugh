import { useMemo } from 'react';
import { applyFilters } from '../utils/filtering';

export function useFiltering(designs, criteriaConfig) {
  return useMemo(
    () => applyFilters(designs, criteriaConfig),
    [designs, criteriaConfig],
  );
}
