import type { DailyMetric, DashboardData, Merchant } from "@/types";

export interface DashboardRepository {
  getDashboardData(): Promise<DashboardData>;
  saveDashboardData(data: DashboardData): Promise<void>;
  getMerchants(): Promise<Merchant[]>;
  getMerchantById(id: string): Promise<Merchant | null>;
  getDailyMetrics(merchantId: string): Promise<DailyMetric[]>;
  createMerchant(merchant: Merchant): Promise<Merchant>;
  updateMerchant(id: string, updates: Partial<Merchant>): Promise<Merchant | null>;
  deleteMerchant(id: string): Promise<void>;
  reset(): Promise<DashboardData>;
}
