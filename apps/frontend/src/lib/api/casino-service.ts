/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api/client";

// Interfejsy DTO
export interface StartGameDto {
  bet: number;
}

export interface PlaySlotMachineDto {
  bet: number;
}

export interface PlayBlackjackDto {
  bet: number;
}

export interface PlayRouletteDto {
  bet: number;
  chosenNumber: number;
}

export interface PlayDiceDto {
  bet: number;
  chosenSum: number;
}

export interface PlayBaccaratDto {
  bet: number;
  betOn: "player" | "banker";
}

export interface PlayScratchCardDto {
  bet: number;
}

export interface AdvancedBlackjackDto {
  bet: number;
  action: "hit" | "stand";
}

// Interfejsy odpowiedzi
export interface GameStatusResponse {
  status: string;
  games: {
    name: string;
    available: boolean;
  }[];
}

export interface SlotMachineResponse {
  outcome: string;
  reels: string[];
  payout: number;
  sessionId: number;
}

export interface BlackjackResponse {
  outcome: string;
  playerCards: number[];
  dealerCards: number[];
  payout: number;
  sessionId: number;
}

export interface RouletteResponse {
  outcome: string;
  winningNumber: number;
  payout: number;
  sessionId: number;
}

export interface DiceResponse {
  outcome: string;
  dice: number[];
  sum: number;
  payout: number;
  sessionId: number;
}

export interface BaccaratResponse {
  outcome: string;
  winner: "player" | "banker";
  payout: number;
  sessionId: number;
}

export interface ScratchCardResponse {
  outcome: string;
  cards: string[];
  payout: number;
  sessionId: number;
}

export interface AdvancedBlackjackResponse {
  result: string;
  playerCards: number[];
  dealerCards: number[];
  payout: number;
  sessionId: number;
}

// Endpoints dla Casino API
const CASINO_ENDPOINTS = {
  START: "/casino/start",
  SLOT_MACHINE: "/casino/slot-machine",
  BLACKJACK: "/casino/blackjack",
  ROULETTE: "/casino/roulette",
  DICE: "/casino/dice",
  BACCARAT: "/casino/baccarat",
  SCRATCH_CARD: "/casino/scratch-card",
  ADVANCED_BLACKJACK: "/casino/advanced-blackjack",
  STATUS: "/casino/status",
};

// Implementacja serwisu Casino
export const casinoService = {
  async getStatus(): Promise<GameStatusResponse> {
    return apiClient.get<GameStatusResponse>(CASINO_ENDPOINTS.STATUS);
  },

  async startGame(bet: number): Promise<any> {
    return apiClient.post(CASINO_ENDPOINTS.START, { bet });
  },

  async playSlotMachine(bet: number): Promise<SlotMachineResponse> {
    return apiClient.post<SlotMachineResponse>(CASINO_ENDPOINTS.SLOT_MACHINE, {
      bet,
    });
  },

  async playBlackjack(bet: number): Promise<BlackjackResponse> {
    return apiClient.post<BlackjackResponse>(CASINO_ENDPOINTS.BLACKJACK, {
      bet,
    });
  },

  async playRoulette(
    bet: number,
    chosenNumber: number
  ): Promise<RouletteResponse> {
    return apiClient.post<RouletteResponse>(CASINO_ENDPOINTS.ROULETTE, {
      bet,
      chosenNumber,
    });
  },

  async playDice(bet: number, chosenSum: number): Promise<DiceResponse> {
    return apiClient.post<DiceResponse>(CASINO_ENDPOINTS.DICE, {
      bet,
      chosenSum,
    });
  },

  async playBaccarat(
    bet: number,
    betOn: "player" | "banker"
  ): Promise<BaccaratResponse> {
    return apiClient.post<BaccaratResponse>(CASINO_ENDPOINTS.BACCARAT, {
      bet,
      betOn,
    });
  },

  async playScratchCard(bet: number): Promise<ScratchCardResponse> {
    return apiClient.post<ScratchCardResponse>(CASINO_ENDPOINTS.SCRATCH_CARD, {
      bet,
    });
  },

  async playAdvancedBlackjack(
    bet: number,
    action: "hit" | "stand"
  ): Promise<AdvancedBlackjackResponse> {
    return apiClient.post<AdvancedBlackjackResponse>(
      CASINO_ENDPOINTS.ADVANCED_BLACKJACK,
      { bet, action }
    );
  },
};
