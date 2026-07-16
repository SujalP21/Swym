import type { DailyMetric, Merchant, Recommendation, RiskScore } from "@/types";
import { RECOMMENDATION_RULES, toRecommendation } from "@/domain/recommendation/rules";

const recommendationScore = (recommendation: Recommendation): number =>
  recommendation.urgency * 0.4 +
  recommendation.expectedImpact * 0.4 +
  recommendation.likelihoodOfSuccess * 0.2;

export const generateRecommendations = (
  riskScore: RiskScore,
  merchant: Merchant,
  metrics: readonly DailyMetric[],
): Recommendation[] =>
  RECOMMENDATION_RULES.filter((rule) => rule.matches(riskScore, merchant, metrics)).map((rule) =>
    toRecommendation(rule, riskScore, merchant, metrics),
  );

export const selectNextBestAction = (
  recommendations: readonly Recommendation[],
): Recommendation | undefined =>
  [...recommendations].sort((left, right) => recommendationScore(right) - recommendationScore(left))[0];
