import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { RISK_CATEGORY_LABELS } from "@/constants";
import type { MerchantDashboardRow, RiskCategory } from "@/types";

const colors: Record<RiskCategory, string> = {
  healthy: "#10b981",
  watch: "#f59e0b",
  high: "#f97316",
  critical: "#e11d48",
};

export const RiskDistributionChart = ({ rows }: { rows: readonly MerchantDashboardRow[] }) => {
  const data = Object.entries(RISK_CATEGORY_LABELS).map(([category, label]) => ({
    category: category as RiskCategory,
    label,
    value: rows.filter((row) => row.riskScore.category === category).length,
  }));

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-950">Risk Distribution</h2>
      <div className="mt-4 h-64">
        <ResponsiveContainer height="100%" width="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={55} nameKey="label" outerRadius={88}>
              {data.map((entry) => (
                <Cell fill={colors[entry.category]} key={entry.category} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
