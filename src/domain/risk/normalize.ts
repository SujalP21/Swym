export const UNKNOWN_SIGNAL_VALUE = 0.5;

export const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export const normalizePercentage = (
  value: number | undefined,
  highRiskAt: number,
  inverted = false,
): number => {
  if (value === undefined || Number.isNaN(value)) {
    return UNKNOWN_SIGNAL_VALUE;
  }

  const normalized = clamp01(value / highRiskAt);
  return inverted ? 1 - normalized : normalized;
};

export const normalizeRelativeChange = (value: number | undefined, highRiskDrop: number): number => {
  if (value === undefined || Number.isNaN(value)) {
    return UNKNOWN_SIGNAL_VALUE;
  }

  return clamp01(Math.max(0, -value) / highRiskDrop);
};

export const normalizeCount = (
  value: number | undefined,
  healthyAt: number,
  highRiskAt: number,
  lowerIsRisk = false,
): number => {
  if (value === undefined || Number.isNaN(value)) {
    return UNKNOWN_SIGNAL_VALUE;
  }

  if (lowerIsRisk) {
    return clamp01((healthyAt - value) / Math.max(healthyAt, 1));
  }

  return clamp01((value - healthyAt) / Math.max(highRiskAt - healthyAt, 1));
};

export const normalizeDaysSinceActivity = (days: number | undefined, highRiskAt: number): number => {
  if (days === undefined || Number.isNaN(days)) {
    return UNKNOWN_SIGNAL_VALUE;
  }

  return clamp01(days / highRiskAt);
};
