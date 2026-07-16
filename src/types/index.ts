export type MerchantStatus = "healthy" | "watch" | "atRisk" | "critical";

export type RecommendationPriority = "low" | "medium" | "high" | "urgent";

export type RiskCategory = "healthy" | "watch" | "high" | "critical";

export type Industry =
  | "Apparel"
  | "Beauty"
  | "Electronics"
  | "Food & Beverage"
  | "Home Goods"
  | "Jewelry"
  | "Outdoor"
  | "Wellness";

export interface MerchantProfile {
  id: string;
  merchantId: string;
  businessName: string;
  industry: Industry;
  ownerName: string;
  ownerEmail: string;
  joinedAt: string;
  lastContactedAt: string;
}

export interface Merchant {
  id: string;
  name: string;
  industry: Industry;
  status: MerchantStatus;
  monthlyRevenue: number;
  lastActivityAt: string;
  notes?: string;
  profile: MerchantProfile;
}

export interface DailyMetric {
  merchantId: string;
  date: string;
  transactionCount: number;
  grossRevenue: number;
  refundCount: number;
  supportTicketCount: number;
  loginCount: number;
  featureUsageCount: number;
  refundRate: number;
}

export interface RiskFactor {
  id: string;
  signalName: string;
  normalizedValue: number;
  weight: number;
  contribution: number;
  explanation: string;
}

export interface RiskScore {
  merchantId: string;
  totalScore: number;
  category: RiskCategory;
  confidence: number;
  contributors: RiskFactor[];
}

export interface Recommendation {
  id: string;
  merchantId: string;
  title: string;
  description: string;
  priority: RecommendationPriority;
  urgency: number;
  expectedImpact: number;
  likelihoodOfSuccess: number;
  rationale: string;
}

export interface PriorityResult {
  score: number;
  category: RecommendationPriority;
}

export interface DashboardFilters {
  status: MerchantStatus | "all";
  riskCategory: RiskCategory | "all";
  search: string;
  industry: Industry | "all";
}

export interface DashboardState {
  loading: boolean;
  selectedMerchantId: string | null;
  filters: DashboardFilters;
}

export interface DashboardData {
  merchants: Merchant[];
  metrics: DailyMetric[];
}

export interface MerchantDashboardRow {
  merchant: Merchant;
  latestMetric?: DailyMetric;
  riskScore: RiskScore;
  recommendation?: Recommendation;
  priority: PriorityResult;
}
