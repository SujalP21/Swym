import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { formatCurrency } from "@/utils/formatters";
import type { MerchantDashboardRow } from "@/types";

export const RevenueByIndustryChart = ({ rows }: { rows: readonly MerchantDashboardRow[] }) => {
  const data = rows.reduce<Array<{ industry: string; revenue: number }>>((items, row) => {
    const existingItem = items.find((item) => item.industry === row.merchant.industry);

    if (existingItem) {
      existingItem.revenue += row.merchant.monthlyRevenue * 12;
      return items;
    }

    return [...items, { industry: row.merchant.industry, revenue: row.merchant.monthlyRevenue * 12 }];
  }, []);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-950">Revenue by Industry</h2>
      <div className="mt-4 h-64">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="industry" fontSize={11} tickLine={false} />
            <YAxis fontSize={11} tickFormatter={(value) => `$${Number(value) / 1000}k`} width={56} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Bar dataKey="revenue" fill="#0f172a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
