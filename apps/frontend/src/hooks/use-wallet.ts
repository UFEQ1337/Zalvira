"use client";

import { useState, useEffect, useCallback } from "react";
import { walletService } from "@/lib/api/wallet-service";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/use-toast";

export function useWallet() {
  const [balance, setBalance] = useState(0);
  const [currency] = useState("PLN");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingTransactions, setPendingTransactions] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const fetchWalletData = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      // Pobieranie danych portfela z API
      const userResponse = await fetch("/api/user/profile");
      const userData = await userResponse.json();

      if (userData && userData.balance !== undefined) {
        setBalance(userData.balance);
      }

      // Pobieranie historii transakcji
      const transactionsData = await walletService.getTransactions();
      setTransactions(transactionsData);

      // Filtrowanie oczekujących transakcji
      const pendingTxs = transactionsData.filter(
        (tx) => tx.status === "pending"
      );
      setPendingTransactions(pendingTxs);
    } catch (err) {
      console.error("Error fetching wallet data:", err);
      setError("Nie udało się pobrać danych portfela");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Ładowanie danych przy montowaniu komponentu
  useEffect(() => {
    if (isAuthenticated) {
      fetchWalletData();
    }
  }, [isAuthenticated, fetchWalletData]);

  // Metody do dokonywania operacji na portfelu
  const deposit = async (amount: number) => {
    setIsLoading(true);
    try {
      const response = await walletService.deposit(amount);

      if (response) {
        setBalance(response.newBalance);
        toast({
          title: "Wpłata zrealizowana",
          description: `Pomyślnie wpłacono ${amount} ${currency} na Twoje konto.`,
          variant: "success",
        });
        await fetchWalletData();
        return response;
      }
    } catch (err) {
      console.error("Error depositing funds:", err);
      toast({
        title: "Błąd wpłaty",
        description:
          "Nie udało się zrealizować wpłaty. Spróbuj ponownie później.",
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const withdraw = async (amount: number) => {
    setIsLoading(true);
    try {
      if (amount > balance) {
        throw new Error("Insufficient funds");
      }

      const response = await walletService.withdraw(amount);

      if (response) {
        setBalance(response.newBalance);
        toast({
          title: "Wypłata zrealizowana",
          description: `Pomyślnie zlecono wypłatę ${amount} ${currency} z Twojego konta.`,
          variant: "success",
        });
        await fetchWalletData();
        return response;
      }
    } catch (err: any) {
      console.error("Error withdrawing funds:", err);
      toast({
        title: "Błąd wypłaty",
        description:
          err.message === "Insufficient funds"
            ? "Nie masz wystarczających środków, aby wykonać tę operację."
            : "Nie udało się zrealizować wypłaty. Spróbuj ponownie później.",
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const transfer = async (amount: number, recipient: string) => {
    setIsLoading(true);
    try {
      if (amount > balance) {
        throw new Error("Insufficient funds");
      }

      // Sprawdź, czy to email czy nazwa użytkownika
      const isEmail = recipient.includes("@");

      const transferData = {
        amount,
        [isEmail ? "recipientEmail" : "recipientUsername"]: recipient,
      };

      const response = await walletService.transfer(transferData);

      if (response) {
        setBalance(response.senderNewBalance);
        toast({
          title: "Przelew zrealizowany",
          description: `Pomyślnie przelano ${amount} ${currency} do użytkownika ${recipient}.`,
          variant: "success",
        });
        await fetchWalletData();
        return response;
      }
    } catch (err: any) {
      console.error("Error transferring funds:", err);
      toast({
        title: "Błąd przelewu",
        description:
          err.message === "Insufficient funds"
            ? "Nie masz wystarczających środków, aby wykonać tę operację."
            : "Nie udało się zrealizować przelewu. Spróbuj ponownie później.",
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    balance,
    currency,
    isLoading,
    error,
    pendingTransactions,
    transactions,
    deposit,
    withdraw,
    transfer,
    refresh: fetchWalletData,
  };
}
