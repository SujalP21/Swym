import { LOCAL_STORAGE_KEYS } from "@/constants";
import { seedDashboardData } from "@/repository/data/mockMerchants";
import type { DashboardRepository } from "@/repository/DashboardRepository";
import type { DailyMetric, DashboardData, Merchant } from "@/types";

export class LocalStorageRepository implements DashboardRepository {
  async getDashboardData(): Promise<DashboardData> {
    return this.readData();
  }

  async saveDashboardData(data: DashboardData): Promise<void> {
    this.writeData(data);
  }

  async getMerchants(): Promise<Merchant[]> {
    return this.readData().merchants;
  }

  async getMerchantById(id: string): Promise<Merchant | null> {
    return this.readData().merchants.find((merchant) => merchant.id === id) ?? null;
  }

  async getDailyMetrics(merchantId: string): Promise<DailyMetric[]> {
    return this.readData().metrics.filter((metric) => metric.merchantId === merchantId);
  }

  async createMerchant(merchant: Merchant): Promise<Merchant> {
    const data = this.readData();
    this.writeData({
      ...data,
      merchants: [...data.merchants, merchant],
    });
    return merchant;
  }

  async updateMerchant(id: string, updates: Partial<Merchant>): Promise<Merchant | null> {
    const data = this.readData();
    const currentMerchant = data.merchants.find((merchant) => merchant.id === id);

    if (!currentMerchant) {
      return null;
    }

    const updatedMerchant = {
      ...currentMerchant,
      ...updates,
      profile: {
        ...currentMerchant.profile,
        ...updates.profile,
      },
    };
    this.writeData({
      ...data,
      merchants: data.merchants.map((merchant) =>
        merchant.id === id ? updatedMerchant : merchant,
      ),
    });

    return updatedMerchant;
  }

  async deleteMerchant(id: string): Promise<void> {
    const data = this.readData();
    this.writeData({
      merchants: data.merchants.filter((merchant) => merchant.id !== id),
      metrics: data.metrics.filter((metric) => metric.merchantId !== id),
    });
  }

  async reset(): Promise<DashboardData> {
    this.writeData(seedDashboardData);
    return seedDashboardData;
  }

  private readData(): DashboardData {
    const serializedData = window.localStorage.getItem(LOCAL_STORAGE_KEYS.dashboardData);

    if (!serializedData) {
      this.writeData(seedDashboardData);
      return seedDashboardData;
    }

    return JSON.parse(serializedData) as DashboardData;
  }

  private writeData(data: DashboardData): void {
    window.localStorage.setItem(LOCAL_STORAGE_KEYS.dashboardData, JSON.stringify(data));
  }
}
