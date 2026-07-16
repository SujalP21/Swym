import { create } from "zustand";

import { getMerchantMetrics } from "@/domain/merchant/helpers";
import { calculatePriority } from "@/domain/prioritization/priority";
import { generateRecommendations, selectNextBestAction } from "@/domain/recommendation/engine";
import { calculateRiskScores } from "@/domain/risk/score";
import { LocalStorageRepository } from "@/repository/LocalStorageRepository";
import type { DashboardFilters, DashboardState } from "@/types";
import type { DailyMetric, Merchant, MerchantDashboardRow } from "@/types";

const initialFilters: DashboardFilters = {
  status: "all",
  riskCategory: "all",
  search: "",
  industry: "all",
};

interface DashboardStore extends DashboardState {
  merchants: Merchant[];
  metrics: DailyMetric[];
  rows: MerchantDashboardRow[];
  error: string | null;
  loadDashboard: () => Promise<void>;
  resetDashboard: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setSelectedMerchantId: (merchantId: string | null) => void;
  setFilters: (filters: Partial<DashboardFilters>) => void;
  resetFilters: () => void;
  updateMerchant: (id: string, updates: Partial<Merchant>) => Promise<void>;
}

const repository = new LocalStorageRepository();

const createRows = (
  merchants: readonly Merchant[],
  metrics: readonly DailyMetric[],
): MerchantDashboardRow[] => {
  const riskScores = calculateRiskScores(merchants, metrics);

  return merchants.map((merchant) => {
    const merchantMetrics = getMerchantMetrics(merchant.id, metrics);
    const riskScore = riskScores.find((score) => score.merchantId === merchant.id);

    if (!riskScore) {
      throw new Error(`Risk score missing for merchant ${merchant.id}`);
    }

    const recommendations = generateRecommendations(riskScore, merchant, merchantMetrics);

    return {
      merchant,
      latestMetric: merchantMetrics.at(-1),
      riskScore,
      recommendation: selectNextBestAction(recommendations),
      priority: calculatePriority(merchant, riskScore),
    };
  });
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  loading: false,
  selectedMerchantId: null,
  filters: initialFilters,
  merchants: [],
  metrics: [],
  rows: [],
  error: null,
  loadDashboard: async () => {
    set({ loading: true, error: null });

    try {
      const data = await repository.getDashboardData();
      set({
        merchants: data.merchants,
        metrics: data.metrics,
        rows: createRows(data.merchants, data.metrics),
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unable to load dashboard data.",
        loading: false,
      });
    }
  },
  resetDashboard: async () => {
    set({ loading: true, error: null });
    const data = await repository.reset();
    set({
      merchants: data.merchants,
      metrics: data.metrics,
      rows: createRows(data.merchants, data.metrics),
      loading: false,
    });
  },
  setLoading: (loading) => set({ loading }),
  setSelectedMerchantId: (selectedMerchantId) => set({ selectedMerchantId }),
  setFilters: (filters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters,
      },
    })),
  resetFilters: () => set({ filters: initialFilters }),
  updateMerchant: async (id, updates) => {
    const updatedMerchant = await repository.updateMerchant(id, updates);

    if (!updatedMerchant) {
      return;
    }

    set((state) => {
      const merchants = state.merchants.map((merchant) =>
        merchant.id === id ? updatedMerchant : merchant,
      );

      return {
        merchants,
        rows: createRows(merchants, state.metrics),
      };
    });
  },
}));
