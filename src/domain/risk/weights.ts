import type { RiskCategory } from "@/types";

export type RiskSignalKey =
  | "transactionTrend"
  | "loginActivity"
  | "supportTickets"
  | "refundRate"
  | "featureUsage"
  | "inactivity";

export interface RiskConfig {
  weights: Record<RiskSignalKey, number>;
  thresholds: {
    transactionDrop: number;
    healthyLoginCount: number;
    supportTicketsHealthy: number;
    supportTicketsHigh: number;
    refundRateHigh: number;
    featureUsageHigh: number;
    inactivityDaysHigh: number;
  };
}

export const DEFAULT_RISK_CONFIG: RiskConfig = {
  weights: {
    transactionTrend: 0.25,
    loginActivity: 0.15,
    supportTickets: 0.16,
    refundRate: 0.16,
    featureUsage: 0.12,
    inactivity: 0.16,
  },
  thresholds: {
    transactionDrop: 0.45,
    healthyLoginCount: 14,
    supportTicketsHealthy: 2,
    supportTicketsHigh: 12,
    refundRateHigh: 0.14,
    featureUsageHigh: 30,
    inactivityDaysHigh: 30,
  },
};

export const getRiskCategory = (score: number): RiskCategory => {
  if (score >= 80) {
    return "critical";
  }

  if (score >= 60) {
    return "high";
  }

  if (score >= 35) {
    return "watch";
  }

  return "healthy";
};
