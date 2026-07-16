import type { DailyMetric, Merchant } from "@/types";

const millisecondsPerDay = 24 * 60 * 60 * 1000;

export const getMerchantMetrics = (
  merchantId: string,
  metrics: readonly DailyMetric[],
): DailyMetric[] =>
  metrics
    .filter((metric) => metric.merchantId === merchantId)
    .sort((left, right) => left.date.localeCompare(right.date));

export const getLatestMetric = (metrics: readonly DailyMetric[]): DailyMetric | undefined =>
  [...metrics].sort((left, right) => right.date.localeCompare(left.date))[0];

export const calculateBusinessValue = (merchant: Merchant): number => merchant.monthlyRevenue * 12;

export const daysSinceLastActivity = (merchant: Merchant, asOf = new Date("2026-07-16")): number => {
  const activityTime = new Date(merchant.lastActivityAt).getTime();
  return Math.max(0, Math.floor((asOf.getTime() - activityTime) / millisecondsPerDay));
};

export const revenueTrend = (metrics: readonly DailyMetric[]): number => {
  if (metrics.length < 2) {
    return 0;
  }

  const sorted = [...metrics].sort((left, right) => left.date.localeCompare(right.date));
  const midpoint = Math.floor(sorted.length / 2);
  const baseline = sorted.slice(0, midpoint).reduce((sum, metric) => sum + metric.grossRevenue, 0);
  const recent = sorted.slice(midpoint).reduce((sum, metric) => sum + metric.grossRevenue, 0);

  return baseline === 0 ? 0 : (recent - baseline) / baseline;
};

export const averageMetric = (
  metrics: readonly DailyMetric[],
  selector: (metric: DailyMetric) => number,
): number => {
  if (metrics.length === 0) {
    return 0;
  }

  return metrics.reduce((sum, metric) => sum + selector(metric), 0) / metrics.length;
};
