import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}

export const KpiCard = ({ label, value, detail, icon: Icon }: KpiCardProps) => (
  <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-700">
        <Icon aria-hidden="true" className="h-5 w-5" />
      </div>
    </div>
    <p className="mt-3 text-xs text-slate-500">{detail}</p>
  </section>
);
