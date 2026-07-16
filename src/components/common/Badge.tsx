import type { PropsWithChildren } from "react";

type BadgeTone = "green" | "amber" | "red" | "slate" | "blue";

const toneClasses: Record<BadgeTone, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  red: "bg-rose-50 text-rose-700 ring-rose-200",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
  blue: "bg-sky-50 text-sky-700 ring-sky-200",
};

interface BadgeProps extends PropsWithChildren {
  tone?: BadgeTone;
}

export const Badge = ({ children, tone = "slate" }: BadgeProps) => (
  <span
    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${toneClasses[tone]}`}
  >
    {children}
  </span>
);
