export const DEFAULT_PREFIX = 'padding';
export const DEFAULT_RANDOMNESS_LEVEL = 50;
export const SCROLL_DELAY_MS = 150;
export const API_TIMEOUT_MS = 10000;

export const PADDING_RANGES = {
  LOW: [0, 4, 8],
  MEDIUM_LOW: [0, 4, 8, 12, 16],
  MEDIUM: [0, 4, 8, 12, 16, 20, 24],
  MEDIUM_HIGH: [0, 4, 8, 12, 16, 20, 24, 28, 32],
  HIGH: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48],
};

export const SPACING_RANGES = {
  LOW: [0, 4, 8],
  MEDIUM_LOW: [0, 4, 8, 12],
  MEDIUM: [0, 4, 8, 12, 16, 20],
  MEDIUM_HIGH: [0, 4, 8, 12, 16, 20, 24],
  HIGH: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40],
};

export const getPaddingRange = (level: number): number[] => {
  if (level <= 20) return PADDING_RANGES.LOW;
  if (level <= 40) return PADDING_RANGES.MEDIUM_LOW;
  if (level <= 60) return PADDING_RANGES.MEDIUM;
  if (level <= 80) return PADDING_RANGES.MEDIUM_HIGH;
  return PADDING_RANGES.HIGH;
};

export const getSpacingRange = (level: number): number[] => {
  if (level <= 20) return SPACING_RANGES.LOW;
  if (level <= 40) return SPACING_RANGES.MEDIUM_LOW;
  if (level <= 60) return SPACING_RANGES.MEDIUM;
  if (level <= 80) return SPACING_RANGES.MEDIUM_HIGH;
  return SPACING_RANGES.HIGH;
};

export const getPaddingRangeMax = (level: number): number => {
  if (level <= 20) return 8;
  if (level <= 40) return 16;
  if (level <= 60) return 24;
  if (level <= 80) return 32;
  return 48;
};
