import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/common/Badge";
import { RiskBadge } from "@/components/risk/RiskBadge";
import { ROUTES, RECOMMENDATION_PRIORITY_LABELS } from "@/constants";
import type { MerchantDashboardRow } from "@/types";
import { formatCurrency } from "@/utils/formatters";

const priorityTone = {
  low: "slate",
  medium: "blue",
  high: "amber",
  urgent: "red",
} as const;

export const MerchantTable = ({ rows }: { rows: readonly MerchantDashboardRow[] }) => {
  const [sorting, setSorting] = useState<SortingState>([{ id: "risk", desc: true }]);
  const columns = useMemo<ColumnDef<MerchantDashboardRow>[]>(
    () => [
      {
        id: "merchant",
        header: "Merchant",
        accessorFn: (row) => row.merchant.name,
        cell: ({ row }) => (
          <div>
            <Link
              className="font-medium text-slate-950 hover:text-sky-700"
              to={ROUTES.merchantPath(row.original.merchant.id)}
            >
              {row.original.merchant.name}
            </Link>
            <p className="text-xs text-slate-500">{row.original.merchant.profile.ownerName}</p>
          </div>
        ),
      },
      {
        id: "industry",
        header: "Industry",
        accessorFn: (row) => row.merchant.industry,
      },
      {
        id: "revenue",
        header: "Revenue",
        accessorFn: (row) => row.merchant.monthlyRevenue,
        cell: ({ row }) => formatCurrency(row.original.merchant.monthlyRevenue),
      },
      {
        id: "risk",
        header: "Risk Score",
        accessorFn: (row) => row.riskScore.totalScore,
        cell: ({ row }) => (
          <span className="font-semibold text-slate-950">{row.original.riskScore.totalScore}</span>
        ),
      },
      {
        id: "category",
        header: "Risk Category",
        accessorFn: (row) => row.riskScore.category,
        cell: ({ row }) => <RiskBadge category={row.original.riskScore.category} />,
      },
      {
        id: "priority",
        header: "Priority",
        accessorFn: (row) => row.priority.score,
        cell: ({ row }) => (
          <Badge tone={priorityTone[row.original.priority.category]}>
            {RECOMMENDATION_PRIORITY_LABELS[row.original.priority.category]} · {row.original.priority.score}
          </Badge>
        ),
      },
      {
        id: "recommendation",
        header: "Recommendation",
        accessorFn: (row) => row.recommendation?.title ?? "",
        cell: ({ row }) => (
          <span className="text-sm text-slate-600">
            {row.original.recommendation?.title ?? "No recommendation"}
          </span>
        ),
      },
    ],
    [],
  );
  const table = useReactTable({
    data: [...rows],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                    key={header.id}
                  >
                    <button
                      className="inline-flex items-center gap-2"
                      onClick={header.column.getToggleSortingHandler()}
                      type="button"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <ArrowUpDown aria-hidden="true" className="h-3.5 w-3.5" />
                    </button>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {table.getRowModel().rows.map((row) => (
              <tr className="hover:bg-slate-50" key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-700" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
