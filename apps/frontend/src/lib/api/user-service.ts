/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api/client";
import { WalletTransaction } from "./wallet-service";

export interface UserProfile {
  id: number;
  email: string;
  username: string;
  balance: number;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GameSession {
  id: number;
  userId: number;
  result: string;
  gameType: string;
  details: any;
  createdAt: string;
}

export interface UpdateUserProfileDto {
  username?: string;
  email?: string;
  password?: string;
}

export interface GameSessionsResponse {
  data: GameSession[];
  total: number;
}

const USER_ENDPOINTS = {
  PROFILE: "/user/profile",
  WALLET: "/user/wallet",
  GAMES: "/user/games",
};

export const userService = {
  async getProfile(): Promise<UserProfile> {
    return apiClient.get<UserProfile>(USER_ENDPOINTS.PROFILE);
  },

  async updateProfile(updateData: UpdateUserProfileDto): Promise<UserProfile> {
    return apiClient.patch<UserProfile>(USER_ENDPOINTS.PROFILE, updateData);
  },

  async getWalletTransactions(): Promise<WalletTransaction[]> {
    return apiClient.get<WalletTransaction[]>(USER_ENDPOINTS.WALLET);
  },

  async getGameSessions(
    page: number = 1,
    limit: number = 10
  ): Promise<GameSessionsResponse> {
    return apiClient.get<GameSessionsResponse>(USER_ENDPOINTS.GAMES, {
      params: { page, limit },
    });
  },
};
