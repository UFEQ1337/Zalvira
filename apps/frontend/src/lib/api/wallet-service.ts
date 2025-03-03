import { apiClient } from "@/lib/api/client";

export interface DepositDto {
  amount: number;
}

export interface WithdrawDto {
  amount: number;
}

export interface TransferDto {
  amount: number;
  recipientEmail?: string;
  recipientUsername?: string;
}

export interface WalletResponse {
  message: string;
  newBalance: number;
}

export interface TransferResponse {
  message: string;
  senderNewBalance: number;
  recipientId: number;
}

export interface WalletTransaction {
  status: string;
  id: number;
  userId: number;
  type: string;
  amount: number;
  createdAt: string;
}

const WALLET_ENDPOINTS = {
  DEPOSIT: "/wallet/deposit",
  WITHDRAW: "/wallet/withdraw",
  TRANSFER: "/wallet/transfer",
  TRANSACTIONS: "/user/wallet",
};

export const walletService = {
  async deposit(amount: number): Promise<WalletResponse> {
    return apiClient.post<WalletResponse>(WALLET_ENDPOINTS.DEPOSIT, { amount });
  },

  async withdraw(amount: number): Promise<WalletResponse> {
    return apiClient.post<WalletResponse>(WALLET_ENDPOINTS.WITHDRAW, {
      amount,
    });
  },

  async transfer(transferDto: TransferDto): Promise<TransferResponse> {
    return apiClient.post<TransferResponse>(
      WALLET_ENDPOINTS.TRANSFER,
      transferDto
    );
  },

  async getTransactions(): Promise<WalletTransaction[]> {
    return apiClient.get<WalletTransaction[]>(WALLET_ENDPOINTS.TRANSACTIONS);
  },
};
