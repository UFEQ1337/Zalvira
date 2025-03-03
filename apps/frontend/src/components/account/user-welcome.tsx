"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Wallet, Gift, History } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { formatCurrency } from "@/lib/utils";

export function UserWelcome() {
  const { user, isAuthenticated } = useAuth();
  const { balance, currency } = useWallet();
  const [greeting, setGreeting] = useState("Dzień dobry");

  // Ustawienie odpowiedniego powitania zależnie od pory dnia
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Dzień dobry");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Witaj ponownie");
    } else {
      setGreeting("Dobry wieczór");
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-2">Witaj w Zalvira Casino!</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Zarejestruj się lub zaloguj, aby rozpocząć grę i zdobyć bonus
          powitalny.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/auth/register">Zarejestruj się</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/auth/login">Zaloguj się</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-light dark:bg-surface-dark rounded-lg p-6 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            {greeting},{" "}
            <span className="text-primary-500">
              {user?.username || "użytkowniku"}
            </span>
            !
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Co chcesz dziś zagrać?
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="bg-primary-500/10 dark:bg-primary-500/20 rounded-md px-4 py-2 flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary-500" />
            <span className="font-medium">
              {formatCurrency(balance, currency)}
            </span>
          </div>

          <Button variant="outline" size="sm" asChild>
            <Link href="/account/wallet" className="flex items-center gap-1">
              <Gift className="h-4 w-4" />
              <span>Doładuj</span>
            </Link>
          </Button>

          <Button variant="ghost" size="sm" asChild>
            <Link href="/account/history" className="flex items-center gap-1">
              <History className="h-4 w-4" />
              <span>Historia</span>
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
