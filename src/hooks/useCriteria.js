import { useCallback, useMemo, useState } from 'react';
import { DEFAULT_CRITERION_CONFIG } from '../utils/constants';
import { computeStats } from '../utils/scoring';

export function useCriteria(designs, criteria) {
  const [criteriaConfig, setCriteriaConfig] = useState({});

  const resetCriteria = useCallback((nextCriteria) => {
    setCriteriaConfig(Object.fromEntries(
      nextCriteria.map((criterion) => [criterion, { ...DEFAULT_CRITERION_CONFIG }]),
    ));
  }, []);

  const updateCriterion = useCallback((criterion, property, value) => {
    setCriteriaConfig((current) => ({
      ...current,
      [criterion]: { ...current[criterion], [property]: value },
    }));
  }, []);

  const setAllEnabled = useCallback((enabled) => {
    setCriteriaConfig((current) => Object.fromEntries(
      Object.entries(current).map(([criterion, config]) => [criterion, { ...config, enabled }]),
    ));
  }, []);

  const clearFilters = useCallback(() => {
    setCriteriaConfig((current) => Object.fromEntries(
      Object.entries(current).map(([criterion, config]) => [criterion, {
        ...config,
        minFilter: '',
        maxFilter: '',
      }]),
    ));
  }, []);

  const stats = useMemo(() => computeStats(designs, criteria), [designs, criteria]);

  return {
    clearFilters,
    criteriaConfig,
    resetCriteria,
    setAllEnabled,
    stats,
    updateCriterion,
  };
}
