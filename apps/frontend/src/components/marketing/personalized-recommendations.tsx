"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Star, Flame, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useGameFavorites } from "@/hooks/use-game-favorites";

type Game = {
  id: string;
  title: string;
  provider: string;
  image: string;
  link: string;
  rating: number;
  popularity: number; // 1-100
  isNew?: boolean;
  isHot?: boolean;
  category: string;
};

// Mock gry - w rzeczywistości będą pobierane z API
const allGames: Game[] = [
  {
    id: "game1",
    title: "Book of Fortune",
    provider: "Pragmatic Play",
    image: "/api/placeholder/400/300",
    link: "/games/book-of-fortune",
    rating: 4.8,
    popularity: 95,
    isHot: true,
    category: "slots",
  },
  {
    id: "game2",
    title: "Sweet Bonanza",
    provider: "Pragmatic Play",
    image: "/api/placeholder/400/300",
    link: "/games/sweet-bonanza",
    rating: 4.9,
    popularity: 98,
    isHot: true,
    category: "slots",
  },
  {
    id: "game3",
    title: "Wolf Gold",
    provider: "Pragmatic Play",
    image: "/api/placeholder/400/300",
    link: "/games/wolf-gold",
    rating: 4.7,
    popularity: 90,
    category: "slots",
  },
  {
    id: "game4",
    title: "Gates of Olympus",
    provider: "Pragmatic Play",
    image: "/api/placeholder/400/300",
    link: "/games/gates-of-olympus",
    rating: 4.9,
    popularity: 97,
    isHot: true,
    category: "slots",
  },
  {
    id: "game5",
    title: "Blackjack VIP",
    provider: "Evolution Gaming",
    image: "/api/placeholder/400/300",
    link: "/games/blackjack-vip",
    rating: 4.8,
    popularity: 88,
    category: "table",
  },
  {
    id: "game6",
    title: "European Roulette",
    provider: "Playtech",
    image: "/api/placeholder/400/300",
    link: "/games/european-roulette",
    rating: 4.7,
    popularity: 89,
    category: "table",
  },
  {
    id: "game7",
    title: "Dragon Tiger",
    provider: "Evolution Gaming",
    image: "/api/placeholder/400/300",
    link: "/games/dragon-tiger",
    rating: 4.6,
    popularity: 83,
    category: "live",
  },
  {
    id: "game8",
    title: "Golden Wealth Baccarat",
    provider: "Evolution Gaming",
    image: "/api/placeholder/400/300",
    link: "/games/golden-wealth-baccarat",
    rating: 4.5,
    popularity: 80,
    isNew: true,
    category: "live",
  },
];

function GameCard({ game }: { game: Game }) {
  const { isFavorite, toggleFavorite } = useGameFavorites(game.id);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md flex flex-col h-full"
    >
      <div className="relative">
        <Image
          src={game.image}
          alt={game.title}
          width={400}
          height={300}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-40" />
        <div className="absolute top-2 left-2 flex gap-1">
          {game.isHot && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <Flame className="h-3 w-3" /> Hot
            </Badge>
          )}
          {game.isNew && (
            <Badge variant="success" className="flex items-center gap-1">
              New
            </Badge>
          )}
        </div>
        <div className="absolute bottom-2 right-2 flex items-center text-white text-sm">
          <TrendingUp className="h-3 w-3 mr-1" />
          {game.popularity}%
        </div>
        <Button
          variant="default"
          size="sm"
          className="absolute bottom-2 left-2 bg-primary-500/90 hover:bg-primary-600"
        >
          <Play className="h-3 w-3 mr-1" /> Graj
        </Button>
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold">{game.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {game.provider}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite();
            }}
            className="text-gray-400 hover:text-yellow-500 dark:text-gray-500 dark:hover:text-yellow-400"
          >
            <Star
              className={`h-5 w-5 ${
                isFavorite ? "text-yellow-500 fill-yellow-500" : ""
              }`}
            />
          </button>
        </div>
        <div className="mt-2 flex items-center text-xs">
          <div className="flex items-center">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(game.rating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
          </div>
          <span className="ml-1 text-gray-600 dark:text-gray-400">
            {game.rating}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function PersonalizedRecommendations() {
  const { isAuthenticated, user } = useAuth();
  const [recommendations, setRecommendations] = useState<Game[]>([]);

  useEffect(() => {
    // Symulacja pobierania rekomendacji
    // W rzeczywistej aplikacji byłoby to pobierane z API

    if (isAuthenticated) {
      // Dla zalogowanych użytkowników, losowo wybierz 8 gier (mock)
      // W rzeczywistej implementacji byłyby to gry dobrane na podstawie preferencji użytkownika
      const shuffled = [...allGames].sort(() => 0.5 - Math.random());
      setRecommendations(shuffled.slice(0, 8));
    } else {
      // Dla niezalogowanych użytkowników, pokaż najpopularniejsze gry
      const topGames = [...allGames]
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 8);
      setRecommendations(topGames);
    }
  }, [isAuthenticated, user]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold">
          {isAuthenticated ? "Dla Ciebie" : "Popularne Gry"}
        </h2>
        <Link
          href="/games/recommended"
          className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center"
        >
          Zobacz więcej <TrendingUp className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {recommendations.map((game) => (
          <Link key={game.id} href={game.link}>
            <GameCard game={game} />
          </Link>
        ))}
      </div>
    </div>
  );
}
