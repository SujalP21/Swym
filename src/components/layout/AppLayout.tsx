import { Outlet } from "react-router-dom";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export const AppLayout = () => (
  <div className="min-h-screen bg-slate-50 text-slate-950">
    <Sidebar />
    <div className="min-h-screen lg:pl-64">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  </div>
);
