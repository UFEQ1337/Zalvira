"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, Gift, Zap, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromotionsBannerProps {
  className?: string;
}

export function PromotionsBanner({ className }: PromotionsBannerProps) {
  return (
    <div className={cn("container mx-auto px-4", className)}>
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-accent-700 to-accent-500">
        {/* Tło z efektem */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-20" />
          <div className="absolute left-0 bottom-0 w-3/4 h-1/2">
            <svg
              viewBox="0 0 1000 1000"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full opacity-10"
            >
              <defs>
                <linearGradient id="a" gradientTransform="rotate(90)">
                  <stop offset="0%" stopColor="#FFF" />
                  <stop offset="100%" stopColor="#FFF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,1000 C250,900 300,800 500,700 C700,600 750,400 900,300 C950,100 1000,0 1000,0 L1000,1000 L0,1000 Z"
                fill="url(#a)"
              />
            </svg>
          </div>
        </div>

        {/* Zawartość bannera */}
        <div className="relative z-10 px-6 py-8 md:px-12 md:py-12 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              Bonus Weekendowy
            </h3>
            <p className="text-base md:text-lg mb-4 max-w-lg">
              Doładuj swoje konto w weekend i zgarnij dodatkowe 50% do 500 PLN.
              Promocja ważna tylko do końca niedzieli!
            </p>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-white/90 text-sm">
                <Gift className="mr-1 h-4 w-4" />
                <span>Bonus 50%</span>
              </div>
              <div className="flex items-center text-white/90 text-sm">
                <Zap className="mr-1 h-4 w-4" />
                <span>Obrót 20x</span>
              </div>
              <div className="flex items-center text-white/90 text-sm">
                <Clock className="mr-1 h-4 w-4" />
                <span>2 dni pozostało</span>
              </div>
            </div>

            <Button
              asChild
              size="lg"
              className="bg-white text-accent-700 hover:bg-white/90"
            >
              <Link href="/promotions/weekend-bonus">
                Odbierz bonus <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <motion.div
            className="flex-shrink-0"
            initial={{ scale: 0.9, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <div className="relative w-32 h-32 md:w-40 md:h-40">
              <div className="absolute inset-0 rounded-full bg-white bg-opacity-20 animate-pulse" />
              <div className="absolute inset-2 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-bold text-white mb-1">
                    +50%
                  </div>
                  <div className="text-xs md:text-sm text-white">BONUS</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
