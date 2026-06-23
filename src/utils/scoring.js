import { DIRECTIONS } from './constants';

export function normalizeValue(value, minimum, maximum, higherIsBetter) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  if (maximum === minimum) {
    return 1;
  }

  const normalized = higherIsBetter
    ? (value - minimum) / (maximum - minimum)
    : (maximum - value) / (maximum - minimum);

  return Math.max(0, Math.min(1, normalized));
}

export function computeStats(designs, criteria) {
  return Object.fromEntries(criteria.map((criterion) => {
    const values = designs
      .map((design) => design.values[criterion])
      .filter(Number.isFinite);

    return [criterion, {
      min: values.length > 0 ? Math.min(...values) : 0,
      max: values.length > 0 ? Math.max(...values) : 0,
    }];
  }));
}

export function rankDesigns(designs) {
  let previousScore = null;
  let rank = 0;

  return [...designs]
    .sort((first, second) => second.totalScore - first.totalScore || first.name.localeCompare(second.name))
    .map((design, index) => {
      if (design.totalScore !== previousScore) {
        rank = index + 1;
        previousScore = design.totalScore;
      }

      return { ...design, rank };
    });
}

export function scoreDesigns(designs, criteriaConfig) {
  const enabledCriteria = Object.keys(criteriaConfig)
    .filter((criterion) => criteriaConfig[criterion].enabled);

  if (enabledCriteria.length === 0) {
    return designs.map((design, index) => ({
      ...design,
      totalScore: 0,
      rank: index + 1,
      scores: {},
    }));
  }

  const stats = computeStats(designs, enabledCriteria);
  const weightTotal = enabledCriteria.reduce(
    (total, criterion) => total + Math.max(0, Number(criteriaConfig[criterion].weight) || 0),
    0,
  ) || 1;

  const scoredDesigns = designs.map((design) => {
    const scores = {};
    let weightedScore = 0;

    enabledCriteria.forEach((criterion) => {
      const config = criteriaConfig[criterion];
      const score = normalizeValue(
        design.values[criterion],
        stats[criterion].min,
        stats[criterion].max,
        config.direction === DIRECTIONS.HIGHER,
      );
      scores[criterion] = Number(score.toFixed(2));
      weightedScore += score * Math.max(0, Number(config.weight) || 0);
    });

    return {
      ...design,
      scores,
      totalScore: Number((weightedScore / weightTotal).toFixed(3)),
    };
  });

  return rankDesigns(scoredDesigns);
}
