"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface JackpotCounterProps {
  className?: string;
  initialValue?: number;
  incrementRate?: number;
}

export function JackpotCounter({
  className,
  initialValue = 1285764.52,
  incrementRate = 0.5,
}: JackpotCounterProps) {
  const [jackpot, setJackpot] = useState(initialValue);

  // Zwiększaj wartość jackpota co jakiś czas
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpot((prev) => {
        // Losowa wartość między 0.1 a incrementRate
        const increment = Math.random() * incrementRate + 0.1;
        return prev + increment;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [incrementRate]);

  // Formatowanie liczby z separatorami tysięcy i dwoma miejscami po przecinku
  const formatJackpot = (value: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div
      className={cn(
        "bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 dark:from-yellow-700/20 dark:to-yellow-500/20 rounded-lg p-4 shadow-sm",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            Główny Jackpot
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Aktualizowany na bieżąco
          </p>
        </div>

        <div className="flex items-center">
          <motion.div
            className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {formatJackpot(jackpot)}
          </motion.div>
          <motion.div
            className="ml-2 w-2 h-2 bg-yellow-500 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.8, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
            }}
          />
        </div>
      </div>
    </div>
  );
}
