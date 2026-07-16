import { LayoutDashboard, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

import { ROUTES } from "@/constants";

const navigationItems = [
  { label: "Dashboard", to: ROUTES.dashboard, icon: LayoutDashboard, end: true },
  { label: "Settings", to: ROUTES.settingsPath, icon: Settings, end: false },
];

export const Sidebar = () => (
  <aside className="border-b border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:border-b-0 lg:border-r">
    <div className="flex h-16 items-center px-6">
      <span className="text-base font-semibold text-slate-950">Swym</span>
    </div>
    <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:space-y-1 lg:overflow-visible">
      {navigationItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                isActive ? "bg-slate-100 text-slate-950" : "text-slate-600 hover:bg-slate-50",
              ].join(" ")
            }
            end={item.end}
            key={item.to}
            to={item.to}
          >
            <Icon aria-hidden="true" className="h-4 w-4" />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  </aside>
);
