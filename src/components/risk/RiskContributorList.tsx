import type { RiskFactor } from "@/types";

export const RiskContributorList = ({ contributors }: { contributors: readonly RiskFactor[] }) => (
  <div className="space-y-3">
    {contributors.map((contributor) => (
      <div className="rounded-lg border border-slate-200 bg-white p-4" key={contributor.id}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-950">{contributor.signalName}</h3>
            <p className="mt-1 text-sm text-slate-500">{contributor.explanation}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-950">
              {Math.round(contributor.contribution)}
            </p>
            <p className="text-xs text-slate-500">points</p>
          </div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-slate-800"
            style={{ width: `${Math.round(contributor.normalizedValue * 100)}%` }}
          />
        </div>
      </div>
    ))}
  </div>
);
