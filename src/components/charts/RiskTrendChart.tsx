import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { DailyMetric } from "@/types";

export const RiskTrendChart = ({ metrics }: { metrics: readonly DailyMetric[] }) => {
  const dates = [...new Set(metrics.map((metric) => metric.date))].sort();
  const data = dates.map((date) => {
    const dateMetrics = metrics.filter((metric) => metric.date === date);
    const averageRefundRate =
      dateMetrics.reduce((sum, metric) => sum + metric.refundRate, 0) / Math.max(dateMetrics.length, 1);
    const averageSupportTickets =
      dateMetrics.reduce((sum, metric) => sum + metric.supportTicketCount, 0) /
      Math.max(dateMetrics.length, 1);
    const averageLogins =
      dateMetrics.reduce((sum, metric) => sum + metric.loginCount, 0) / Math.max(dateMetrics.length, 1);

    return {
      date: new Date(date).toLocaleDateString("en-US", { month: "short" }),
      riskIndex: Math.round(averageRefundRate * 280 + averageSupportTickets * 5 + Math.max(0, 16 - averageLogins) * 2),
    };
  });

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-950">Merchant Risk Trend</h2>
      <div className="mt-4 h-64">
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" fontSize={11} tickLine={false} />
            <YAxis domain={[0, 100]} fontSize={11} width={36} />
            <Tooltip />
            <Line dataKey="riskIndex" dot={false} stroke="#e11d48" strokeWidth={2} type="monotone" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
