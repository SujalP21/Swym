import type { DailyMetric, Merchant, RiskFactor, RiskScore } from "@/types";
import {
  averageMetric,
  daysSinceLastActivity,
  getMerchantMetrics,
  revenueTrend,
} from "@/domain/merchant/helpers";
import {
  normalizeCount,
  normalizeDaysSinceActivity,
  normalizePercentage,
  normalizeRelativeChange,
} from "@/domain/risk/normalize";
import { DEFAULT_RISK_CONFIG, getRiskCategory, type RiskConfig, type RiskSignalKey } from "@/domain/risk/weights";

interface SignalDefinition {
  key: RiskSignalKey;
  signalName: string;
  normalizedValue: number;
  explanation: string;
}

const toContributor = (
  signal: SignalDefinition,
  weight: number,
  totalWeight: number,
): RiskFactor => {
  const contribution = totalWeight > 0 ? signal.normalizedValue * (weight / totalWeight) * 100 : 0;

  return {
    id: signal.key,
    signalName: signal.signalName,
    normalizedValue: signal.normalizedValue,
    weight,
    contribution,
    explanation: signal.explanation,
  };
};

export const calculateRisk = (
  merchant: Merchant,
  allMetrics: readonly DailyMetric[],
  config: RiskConfig = DEFAULT_RISK_CONFIG,
): RiskScore => {
  const metrics = getMerchantMetrics(merchant.id, allMetrics);
  const trend = revenueTrend(metrics);
  const avgLoginCount = averageMetric(metrics, (metric) => metric.loginCount);
  const avgSupportTickets = averageMetric(metrics, (metric) => metric.supportTicketCount);
  const avgRefundRate = averageMetric(metrics, (metric) => metric.refundRate);
  const avgFeatureUsage = averageMetric(metrics, (metric) => metric.featureUsageCount);
  const inactiveDays = daysSinceLastActivity(merchant);

  const signals: SignalDefinition[] = [
    {
      key: "transactionTrend",
      signalName: "Transaction Trend",
      normalizedValue: normalizeRelativeChange(trend, config.thresholds.transactionDrop),
      explanation: `Revenue trend is ${(trend * 100).toFixed(1)}% across the sampled period.`,
    },
    {
      key: "loginActivity",
      signalName: "Login Activity",
      normalizedValue: normalizeCount(avgLoginCount, config.thresholds.healthyLoginCount, 0, true),
      explanation: `Average login count is ${avgLoginCount.toFixed(1)} per period.`,
    },
    {
      key: "supportTickets",
      signalName: "Support Tickets",
      normalizedValue: normalizeCount(
        avgSupportTickets,
        config.thresholds.supportTicketsHealthy,
        config.thresholds.supportTicketsHigh,
      ),
      explanation: `Average support ticket volume is ${avgSupportTickets.toFixed(1)} per period.`,
    },
    {
      key: "refundRate",
      signalName: "Refund Rate",
      normalizedValue: normalizePercentage(avgRefundRate, config.thresholds.refundRateHigh),
      explanation: `Average refund rate is ${(avgRefundRate * 100).toFixed(1)}%.`,
    },
    {
      key: "featureUsage",
      signalName: "Feature Usage",
      normalizedValue: normalizePercentage(
        avgFeatureUsage,
        config.thresholds.featureUsageHigh,
        true,
      ),
      explanation: `Average feature usage count is ${avgFeatureUsage.toFixed(1)}.`,
    },
    {
      key: "inactivity",
      signalName: "Inactivity",
      normalizedValue: normalizeDaysSinceActivity(inactiveDays, config.thresholds.inactivityDaysHigh),
      explanation: `Last activity was ${inactiveDays} days ago.`,
    },
  ];

  const totalWeight = Object.values(config.weights).reduce((sum, weight) => sum + weight, 0);
  const contributors = signals.map((signal) =>
    toContributor(signal, config.weights[signal.key], totalWeight),
  );
  const totalScore = Math.round(
    contributors.reduce((sum, contributor) => sum + contributor.contribution, 0),
  );

  return {
    merchantId: merchant.id,
    totalScore,
    category: getRiskCategory(totalScore),
    confidence: metrics.length > 0 ? 0.95 : 0.55,
    contributors,
  };
};

export const calculateRiskScores = (
  merchants: readonly Merchant[],
  metrics: readonly DailyMetric[],
): RiskScore[] => merchants.map((merchant) => calculateRisk(merchant, metrics));
