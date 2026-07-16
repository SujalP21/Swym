import { AlertTriangle, DollarSign, HeartPulse, ShieldCheck, Store } from "lucide-react";
import { useEffect, useMemo } from "react";

import { RevenueByIndustryChart } from "@/components/charts/RevenueByIndustryChart";
import { RiskDistributionChart } from "@/components/charts/RiskDistributionChart";
import { RiskTrendChart } from "@/components/charts/RiskTrendChart";
import { EmptyState } from "@/components/common/EmptyState";
import { PageContainer } from "@/components/layout/PageContainer";
import { MerchantTable } from "@/components/merchant/MerchantTable";
import { KpiCard } from "@/components/metrics/KpiCard";
import { INDUSTRIES, RISK_CATEGORY_LABELS, MERCHANT_STATUS_LABELS } from "@/constants";
import { useDashboardStore } from "@/store/dashboardStore";
import type { DashboardFilters } from "@/types";
import { formatCurrency } from "@/utils/formatters";

export const Dashboard = () => {
  const {
    filters,
    loading,
    metrics,
    resetDashboard,
    resetFilters,
    rows,
    setFilters,
    loadDashboard,
  } = useDashboardStore();

  useEffect(() => {
    if (rows.length === 0) {
      void loadDashboard();
    }
  }, [loadDashboard, rows.length]);

  const visibleRows = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        row.merchant.name.toLowerCase().includes(normalizedSearch) ||
        row.merchant.industry.toLowerCase().includes(normalizedSearch) ||
        row.merchant.profile.ownerName.toLowerCase().includes(normalizedSearch);
      const matchesStatus = filters.status === "all" || row.merchant.status === filters.status;
      const matchesRisk =
        filters.riskCategory === "all" || row.riskScore.category === filters.riskCategory;
      const matchesIndustry = filters.industry === "all" || row.merchant.industry === filters.industry;

      return matchesSearch && matchesStatus && matchesRisk && matchesIndustry;
    });
  }, [filters, rows]);

  const healthyCount = rows.filter((row) => row.riskScore.category === "healthy").length;
  const highRiskCount = rows.filter((row) => row.riskScore.category === "high").length;
  const criticalCount = rows.filter((row) => row.riskScore.category === "critical").length;
  const revenueAtRisk = rows
    .filter((row) => row.riskScore.category === "high" || row.riskScore.category === "critical")
    .reduce((sum, row) => sum + row.merchant.monthlyRevenue * 12, 0);

  const updateFilter = <Key extends keyof DashboardFilters>(
    key: Key,
    value: DashboardFilters[Key],
  ) => {
    setFilters({ [key]: value });
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-slate-500">Customer Success Command Center</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-950">Merchant Churn Dashboard</h1>
          </div>
          <button
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => void resetDashboard()}
            type="button"
          >
            Reset mock data
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <KpiCard detail="All merchants in portfolio" icon={Store} label="Total Merchants" value={`${rows.length}`} />
          <KpiCard detail="Low churn signal" icon={ShieldCheck} label="Healthy" value={`${healthyCount}`} />
          <KpiCard detail="Needs CSM attention" icon={AlertTriangle} label="High Risk" value={`${highRiskCount}`} />
          <KpiCard detail="Escalate this week" icon={HeartPulse} label="Critical" value={`${criticalCount}`} />
          <KpiCard
            detail="Annualized revenue in high or critical risk"
            icon={DollarSign}
            label="Revenue at Risk"
            value={formatCurrency(revenueAtRisk)}
          />
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-5">
            <label className="md:col-span-2">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Search</span>
              <input
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                onChange={(event) => updateFilter("search", event.target.value)}
                placeholder="Merchant, industry, owner"
                type="search"
                value={filters.search}
              />
            </label>
            <label>
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Status</span>
              <select
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                onChange={(event) =>
                  updateFilter("status", event.target.value as DashboardFilters["status"])
                }
                value={filters.status}
              >
                <option value="all">All</option>
                {Object.entries(MERCHANT_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Risk</span>
              <select
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                onChange={(event) =>
                  updateFilter("riskCategory", event.target.value as DashboardFilters["riskCategory"])
                }
                value={filters.riskCategory}
              >
                <option value="all">All</option>
                {Object.entries(RISK_CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Industry</span>
              <select
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                onChange={(event) =>
                  updateFilter("industry", event.target.value as DashboardFilters["industry"])
                }
                value={filters.industry}
              >
                <option value="all">All</option>
                {INDUSTRIES.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-3 flex justify-end">
            <button className="text-sm font-medium text-slate-600 hover:text-slate-950" onClick={resetFilters} type="button">
              Clear filters
            </button>
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-3">
          <RiskDistributionChart rows={rows} />
          <RevenueByIndustryChart rows={rows} />
          <RiskTrendChart metrics={metrics} />
        </div>

        {loading ? (
          <EmptyState description="Loading merchant data from LocalStorage." title="Loading dashboard" />
        ) : visibleRows.length > 0 ? (
          <MerchantTable rows={visibleRows} />
        ) : (
          <EmptyState description="Try clearing search or filter criteria." title="No merchants found" />
        )}
      </div>
    </PageContainer>
  );
};
