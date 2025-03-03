"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CircleDollarSign,
  Dice1,
  Joystick,
  Users,
  Table,
  CreditCard,
} from "lucide-react";

type CategoryItem = {
  name: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
};

const categories: CategoryItem[] = [
  {
    name: "Sloty",
    description: "Klasyczne i nowoczesne automaty",
    icon: <Joystick size={24} />,
    href: "/slots",
    color: "from-primary-400 to-primary-600",
  },
  {
    name: "Blackjack",
    description: "Graj do 21 punktów",
    icon: <CreditCard size={24} />,
    href: "/table-games/blackjack",
    color: "from-green-400 to-green-600",
  },
  {
    name: "Ruletka",
    description: "Europejska i amerykańska",
    icon: <CircleDollarSign size={24} />,
    href: "/table-games/roulette",
    color: "from-red-400 to-red-600",
  },
  {
    name: "Kości",
    description: "Gry z kostkami do gry",
    icon: <Dice1 size={24} />,
    href: "/table-games/dice",
    color: "from-amber-400 to-amber-600",
  },
  {
    name: "Poker",
    description: "Texas Hold'em i inne",
    icon: <Table size={24} />,
    href: "/table-games/poker",
    color: "from-blue-400 to-blue-600",
  },
  {
    name: "Kasyno na żywo",
    description: "Graj z prawdziwymi krupierami",
    icon: <Users size={24} />,
    href: "/live-casino",
    color: "from-purple-400 to-purple-600",
  },
];

export function GameCategories() {
  return (
    <div className="py-4">
      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-secondary-300 to-primary-500 bg-clip-text text-transparent">
        Kategorie gier
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category, index) => (
          <Link href={category.href} key={category.name}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90 group-hover:opacity-100 transition-opacity`}
              />

              <div className="relative z-10 p-6 flex items-center space-x-4 text-white">
                <div className="p-3 rounded-full bg-white bg-opacity-20 backdrop-blur-sm">
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{category.name}</h3>
                  <p className="text-sm text-white/80">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.div
                  className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center"
                  whileHover={{ scale: 1.2 }}
                >
                  →
                </motion.div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
