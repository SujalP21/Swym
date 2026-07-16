import { RISK_CATEGORY_LABELS } from "@/constants";
import type { RiskCategory } from "@/types";
import { Badge } from "@/components/common/Badge";

const riskTone: Record<RiskCategory, "green" | "amber" | "red"> = {
  healthy: "green",
  watch: "amber",
  high: "red",
  critical: "red",
};

export const RiskBadge = ({ category }: { category: RiskCategory }) => (
  <Badge tone={riskTone[category]}>{RISK_CATEGORY_LABELS[category]}</Badge>
);
