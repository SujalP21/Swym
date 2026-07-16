import { ArrowLeft, CalendarDays, DollarSign, Mail, UserRound } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { EmptyState } from "@/components/common/EmptyState";
import { PageContainer } from "@/components/layout/PageContainer";
import { RecommendationCard } from "@/components/recommendation/RecommendationCard";
import { RiskBadge } from "@/components/risk/RiskBadge";
import { RiskContributorList } from "@/components/risk/RiskContributorList";
import { MERCHANT_STATUS_LABELS, RECOMMENDATION_PRIORITY_LABELS, ROUTES } from "@/constants";
import { getMerchantMetrics } from "@/domain/merchant/helpers";
import { useDashboardStore } from "@/store/dashboardStore";
import type { MerchantStatus } from "@/types";
import { formatCurrency, formatDate, formatPercent } from "@/utils/formatters";

export const MerchantDetails = () => {
  const { id } = useParams();
  const { loadDashboard, metrics, rows, updateMerchant } = useDashboardStore();
  const row = rows.find((item) => item.merchant.id === id);

  useEffect(() => {
    if (rows.length === 0) {
      void loadDashboard();
    }
  }, [loadDashboard, rows.length]);

  if (!row) {
    return (
      <PageContainer>
        <EmptyState
          description="The merchant may have been removed or dashboard data is still loading."
          title="Merchant not found"
        />
      </PageContainer>
    );
  }

  const merchantMetrics = getMerchantMetrics(row.merchant.id, metrics);
  const latestMetric = merchantMetrics.at(-1);

  return (
    <PageContainer>
      <div className="space-y-6">
        <Link className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950" to={ROUTES.dashboard}>
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold text-slate-950">{row.merchant.name}</h1>
                <RiskBadge category={row.riskScore.category} />
              </div>
              <p className="mt-2 text-sm text-slate-500">
                {row.merchant.industry} · Customer since {formatDate(row.merchant.profile.joinedAt)}
              </p>
            </div>
            <label className="w-full max-w-xs">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Merchant status</span>
              <select
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                onChange={(event) =>
                  void updateMerchant(row.merchant.id, {
                    status: event.target.value as MerchantStatus,
                  })
                }
                value={row.merchant.status}
              >
                {Object.entries(MERCHANT_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <DollarSign aria-hidden="true" className="h-5 w-5 text-slate-500" />
            <p className="mt-3 text-sm text-slate-500">Monthly revenue</p>
            <p className="mt-1 text-xl font-semibold text-slate-950">
              {formatCurrency(row.merchant.monthlyRevenue)}
            </p>
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <CalendarDays aria-hidden="true" className="h-5 w-5 text-slate-500" />
            <p className="mt-3 text-sm text-slate-500">Last activity</p>
            <p className="mt-1 text-xl font-semibold text-slate-950">
              {formatDate(row.merchant.lastActivityAt)}
            </p>
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <UserRound aria-hidden="true" className="h-5 w-5 text-slate-500" />
            <p className="mt-3 text-sm text-slate-500">Owner</p>
            <p className="mt-1 text-xl font-semibold text-slate-950">
              {row.merchant.profile.ownerName}
            </p>
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <Mail aria-hidden="true" className="h-5 w-5 text-slate-500" />
            <p className="mt-3 text-sm text-slate-500">Contact</p>
            <p className="mt-1 break-all text-sm font-semibold text-slate-950">
              {row.merchant.profile.ownerEmail}
            </p>
          </section>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-950">Risk Explanation</h2>
              <p className="text-sm font-medium text-slate-600">
                Score {row.riskScore.totalScore} · Confidence {formatPercent(row.riskScore.confidence)}
              </p>
            </div>
            <RiskContributorList contributors={row.riskScore.contributors} />
          </section>
          <div className="space-y-4">
            <RecommendationCard recommendation={row.recommendation} />
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-slate-950">Priority</h2>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{row.priority.score}</p>
              <p className="mt-1 text-sm text-slate-500">
                {RECOMMENDATION_PRIORITY_LABELS[row.priority.category]} priority based on risk and revenue.
              </p>
            </section>
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-slate-950">Activity Summary</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Transactions</dt>
                  <dd className="font-medium text-slate-950">{latestMetric?.transactionCount ?? 0}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Gross revenue</dt>
                  <dd className="font-medium text-slate-950">
                    {formatCurrency(latestMetric?.grossRevenue ?? 0)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Logins</dt>
                  <dd className="font-medium text-slate-950">{latestMetric?.loginCount ?? 0}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Support tickets</dt>
                  <dd className="font-medium text-slate-950">
                    {latestMetric?.supportTicketCount ?? 0}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Refund rate</dt>
                  <dd className="font-medium text-slate-950">
                    {formatPercent(latestMetric?.refundRate ?? 0)}
                  </dd>
                </div>
              </dl>
            </section>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
