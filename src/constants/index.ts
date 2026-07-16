import type { Industry, MerchantStatus, RecommendationPriority, RiskCategory } from "@/types";

export const ROUTES = {
  dashboard: "/",
  merchantDetails: "merchant/:id",
  merchantPath: (id: string) => `/merchant/${id}`,
  settings: "settings",
  settingsPath: "/settings",
  notFound: "*",
} as const;

export const RISK_CATEGORIES = [
  "healthy",
  "watch",
  "high",
  "critical",
] as const satisfies readonly RiskCategory[];

export const MERCHANT_STATUS = [
  "healthy",
  "watch",
  "atRisk",
  "critical",
] as const satisfies readonly MerchantStatus[];

export const RECOMMENDATION_PRIORITY = [
  "low",
  "medium",
  "high",
  "urgent",
] as const satisfies readonly RecommendationPriority[];

export const INDUSTRIES = [
  "Apparel",
  "Beauty",
  "Electronics",
  "Food & Beverage",
  "Home Goods",
  "Jewelry",
  "Outdoor",
  "Wellness",
] as const satisfies readonly Industry[];

export const LOCAL_STORAGE_KEYS = {
  dashboardData: "merchant-churn-dashboard:dashboard-data",
} as const;

export const RISK_CATEGORY_LABELS: Record<RiskCategory, string> = {
  healthy: "Healthy",
  watch: "Watch",
  high: "High Risk",
  critical: "Critical",
};

export const MERCHANT_STATUS_LABELS: Record<MerchantStatus, string> = {
  healthy: "Healthy",
  watch: "Watch",
  atRisk: "At Risk",
  critical: "Critical",
};

export const RECOMMENDATION_PRIORITY_LABELS: Record<RecommendationPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};
