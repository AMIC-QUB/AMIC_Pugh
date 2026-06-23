export const APP_NAME = 'AMIC Pugh Matrix';
export const IMAGE_SIZE_LIMIT_BYTES = 5 * 1024 * 1024;

export const DIRECTIONS = {
  HIGHER: 'higher',
  LOWER: 'lower',
};

export const DEFAULT_CRITERION_CONFIG = {
  enabled: true,
  direction: DIRECTIONS.HIGHER,
  weight: 1,
  minFilter: '',
  maxFilter: '',
};
