import { RECOMMENDATION_PRIORITY_LABELS } from "@/constants";
import type { Recommendation } from "@/types";
import { Badge } from "@/components/common/Badge";

const priorityTone = {
  low: "slate",
  medium: "blue",
  high: "amber",
  urgent: "red",
} as const;

export const RecommendationCard = ({
  recommendation,
}: {
  recommendation: Recommendation | undefined;
}) => {
  if (!recommendation) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-base font-semibold text-slate-950">Recommendation</h2>
        <p className="mt-2 text-sm text-slate-500">No recommendation available.</p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-950">{recommendation.title}</h2>
          <p className="mt-2 text-sm text-slate-600">{recommendation.description}</p>
        </div>
        <Badge tone={priorityTone[recommendation.priority]}>
          {RECOMMENDATION_PRIORITY_LABELS[recommendation.priority]}
        </Badge>
      </div>
      <p className="mt-4 text-sm text-slate-500">{recommendation.rationale}</p>
    </section>
  );
};
