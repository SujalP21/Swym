import { Search } from "lucide-react";

import { useDashboardStore } from "@/store/dashboardStore";

export const Header = () => (
  <header className="border-b border-slate-200 bg-white">
    <div className="flex h-16 items-center justify-between gap-4 px-6">
      <p className="text-sm font-medium text-slate-600">Merchant Churn Dashboard</p>
      <div className="hidden items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-500 md:flex">
        <Search aria-hidden="true" className="h-4 w-4" />
        <span>{useDashboardStore.getState().rows.length} merchants</span>
      </div>
    </div>
  </header>
);
