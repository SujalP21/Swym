import type { Merchant, PriorityResult, RecommendationPriority, RiskScore } from "@/types";
import { calculateBusinessValue } from "@/domain/merchant/helpers";

const categoryFromPriority = (score: number): RecommendationPriority => {
  if (score >= 80) {
    return "urgent";
  }

  if (score >= 58) {
    return "high";
  }

  if (score >= 32) {
    return "medium";
  }

  return "low";
};

export const calculatePriority = (merchant: Merchant, riskScore: RiskScore): PriorityResult => {
  const businessValue = calculateBusinessValue(merchant);
  const normalizedValue = Math.min(1, businessValue / 600000);
  const score = Math.round(riskScore.totalScore * (0.65 + normalizedValue * 0.35));

  return {
    score,
    category: categoryFromPriority(score),
  };
};
