export function applyFilters(designs, criteriaConfig) {
  return designs.filter((design) => Object.entries(criteriaConfig).every(([criterion, config]) => {
    const value = design.values[criterion];
    const minimum = config.minFilter === '' ? null : Number(config.minFilter);
    const maximum = config.maxFilter === '' ? null : Number(config.maxFilter);

    // Missing values cannot satisfy an active numeric filter.
    if ((minimum !== null || maximum !== null) && !Number.isFinite(value)) {
      return false;
    }

    return (minimum === null || value >= minimum) && (maximum === null || value <= maximum);
  }));
}
