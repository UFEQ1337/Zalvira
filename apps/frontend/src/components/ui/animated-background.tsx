("use client");

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  children: ReactNode;
}

export function AnimatedBackground({ children }: AnimatedBackgroundProps) {
  return (
    <div className="relative">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/10 to-background-dark/0 dark:from-primary-900/20 dark:to-background-dark/0" />

        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500 rounded-full opacity-10 dark:opacity-20 blur-3xl"
          animate={{
            x: [10, -10, 10],
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500 rounded-full opacity-10 dark:opacity-20 blur-3xl"
          animate={{
            x: [-10, 10, -10],
            y: [10, -10, 10],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      {children}
    </div>
  );
}
