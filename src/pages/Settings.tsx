import { PageContainer } from "@/components/layout/PageContainer";
import { useDashboardStore } from "@/store/dashboardStore";

export const Settings = () => {
  const resetDashboard = useDashboardStore((state) => state.resetDashboard);

  return (
    <PageContainer>
      <div className="max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">Settings</h1>
        <p className="mt-2 text-sm text-slate-500">
          Reset the LocalStorage-backed mock dataset to its original MVP seed state.
        </p>
        <button
          className="mt-5 rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          onClick={() => void resetDashboard()}
          type="button"
        >
          Reset mock data
        </button>
      </div>
    </PageContainer>
  );
};
