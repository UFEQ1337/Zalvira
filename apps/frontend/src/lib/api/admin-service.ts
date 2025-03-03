import { apiClient } from "@/lib/api/client";
import { UserProfile } from "./user-service";
import { WalletTransaction } from "./wallet-service";
import { GameSession } from "./user-service";

export interface OverallStats {
  totalUsers: number;
  totalDeposits: number;
  totalGames: number;
}

const ADMIN_ENDPOINTS = {
  USERS: "/admin/users",
  USER_BY_ID: (id: number) => `/admin/users/${id}`,
  USER_WALLET: (id: number) => `/admin/users/${id}/wallet`,
  USER_GAMES: (id: number) => `/admin/users/${id}/games`,
  STATS: "/admin/stats",
};

export const adminService = {
  async getAllUsers(): Promise<UserProfile[]> {
    return apiClient.get<UserProfile[]>(ADMIN_ENDPOINTS.USERS);
  },

  async getUserById(id: number): Promise<UserProfile> {
    return apiClient.get<UserProfile>(ADMIN_ENDPOINTS.USER_BY_ID(id));
  },

  async updateUser(
    id: number,
    updateData: Partial<UserProfile>
  ): Promise<UserProfile> {
    return apiClient.patch<UserProfile>(
      ADMIN_ENDPOINTS.USER_BY_ID(id),
      updateData
    );
  },

  async deleteUser(id: number): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(
      ADMIN_ENDPOINTS.USER_BY_ID(id)
    );
  },

  async getUserWalletTransactions(id: number): Promise<WalletTransaction[]> {
    return apiClient.get<WalletTransaction[]>(ADMIN_ENDPOINTS.USER_WALLET(id));
  },

  async getUserGameSessions(id: number): Promise<GameSession[]> {
    return apiClient.get<GameSession[]>(ADMIN_ENDPOINTS.USER_GAMES(id));
  },

  async getOverallStats(): Promise<OverallStats> {
    return apiClient.get<OverallStats>(ADMIN_ENDPOINTS.STATS);
  },
};
