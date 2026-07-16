import type { DailyMetric, Merchant, Recommendation, RecommendationPriority, RiskScore } from "@/types";

export interface RecommendationRule {
  id: string;
  title: string;
  description: string;
  priority: RecommendationPriority;
  urgency: number;
  expectedImpact: number;
  likelihoodOfSuccess: number;
  matches: (riskScore: RiskScore, merchant: Merchant, metrics: readonly DailyMetric[]) => boolean;
  rationale: (riskScore: RiskScore, merchant: Merchant, metrics: readonly DailyMetric[]) => string;
}

const contributor = (riskScore: RiskScore, id: string): number =>
  riskScore.contributors.find((item) => item.id === id)?.normalizedValue ?? 0;

export const RECOMMENDATION_RULES: readonly RecommendationRule[] = [
  {
    id: "executive-save-plan",
    title: "Launch executive save plan",
    description: "Escalate to the CSM owner and schedule a same-week business review.",
    priority: "urgent",
    urgency: 0.95,
    expectedImpact: 0.9,
    likelihoodOfSuccess: 0.68,
    matches: (riskScore) => riskScore.category === "critical",
    rationale: (riskScore) => `Critical risk score of ${riskScore.totalScore} needs immediate owner attention.`,
  },
  {
    id: "recover-revenue-trend",
    title: "Recover transaction momentum",
    description: "Review recent transaction drop and agree on one activation campaign.",
    priority: "high",
    urgency: 0.82,
    expectedImpact: 0.84,
    likelihoodOfSuccess: 0.7,
    matches: (riskScore) => contributor(riskScore, "transactionTrend") >= 0.55,
    rationale: () => "Transaction decline is the strongest current churn signal.",
  },
  {
    id: "reduce-support-friction",
    title: "Resolve support friction",
    description: "Audit open ticket themes and close the highest-volume blocker.",
    priority: "high",
    urgency: 0.76,
    expectedImpact: 0.78,
    likelihoodOfSuccess: 0.74,
    matches: (riskScore) => contributor(riskScore, "supportTickets") >= 0.5,
    rationale: () => "Support burden is elevated and may be eroding merchant trust.",
  },
  {
    id: "refund-root-cause",
    title: "Investigate refund spike",
    description: "Identify refund drivers and recommend the smallest corrective workflow change.",
    priority: "medium",
    urgency: 0.64,
    expectedImpact: 0.72,
    likelihoodOfSuccess: 0.7,
    matches: (riskScore) => contributor(riskScore, "refundRate") >= 0.5,
    rationale: () => "Refund rate is above a healthy operating range.",
  },
  {
    id: "feature-adoption-play",
    title: "Run feature adoption play",
    description: "Recommend one underused feature tied to the merchant's industry workflow.",
    priority: "medium",
    urgency: 0.52,
    expectedImpact: 0.7,
    likelihoodOfSuccess: 0.82,
    matches: (riskScore) => contributor(riskScore, "featureUsage") >= 0.45,
    rationale: () => "Low feature usage reduces product stickiness.",
  },
  {
    id: "healthy-check-in",
    title: "Send proactive check-in",
    description: "Keep the merchant engaged with a lightweight success touchpoint.",
    priority: "low",
    urgency: 0.3,
    expectedImpact: 0.45,
    likelihoodOfSuccess: 0.86,
    matches: () => true,
    rationale: () => "No single severe risk signal dominates, so maintain engagement.",
  },
];

export const toRecommendation = (
  rule: RecommendationRule,
  riskScore: RiskScore,
  merchant: Merchant,
  metrics: readonly DailyMetric[],
): Recommendation => ({
  id: `${merchant.id}:${rule.id}`,
  merchantId: merchant.id,
  title: rule.title,
  description: rule.description,
  priority: rule.priority,
  urgency: rule.urgency,
  expectedImpact: rule.expectedImpact,
  likelihoodOfSuccess: rule.likelihoodOfSuccess,
  rationale: rule.rationale(riskScore, merchant, metrics),
});
