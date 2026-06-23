import { useMemo } from 'react';
import { scoreDesigns } from '../utils/scoring';

export function useScoring(designs, criteriaConfig) {
  return useMemo(
    () => scoreDesigns(designs, criteriaConfig),
    [designs, criteriaConfig],
  );
}
