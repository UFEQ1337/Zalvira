"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGameFavorites } from "@/hooks/use-game-favorites";

type GameItem = {
  id: string;
  title: string;
  provider: string;
  image: string;
  link: string;
  rating: number;
  featured: boolean;
  hot: boolean;
  new: boolean;
};

// W normalnej implementacji to by było pobierane z API
const featuredGames: GameItem[] = [
  {
    id: "game1",
    title: "Book of Fortune",
    provider: "Pragmatic Play",
    image: "/api/placeholder/400/300",
    link: "/games/book-of-fortune",
    rating: 4.8,
    featured: true,
    hot: true,
    new: false,
  },
  {
    id: "game2",
    title: "Sun of Egypt",
    provider: "Playson",
    image: "/api/placeholder/400/300",
    link: "/games/sun-of-egypt",
    rating: 4.5,
    featured: true,
    hot: false,
    new: true,
  },
  {
    id: "game3",
    title: "Wolf Gold",
    provider: "Pragmatic Play",
    image: "/api/placeholder/400/300",
    link: "/games/wolf-gold",
    rating: 4.7,
    featured: true,
    hot: true,
    new: false,
  },
  {
    id: "game4",
    title: "Gates of Olympus",
    provider: "Pragmatic Play",
    image: "/api/placeholder/400/300",
    link: "/games/gates-of-olympus",
    rating: 4.9,
    featured: true,
    hot: true,
    new: false,
  },
];

interface GameCardProps {
  game: GameItem;
}

function GameCard({ game }: GameCardProps) {
  const { isFavorite, toggleFavorite } = useGameFavorites(game.id);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-800 h-full flex flex-col"
    >
      <div className="relative">
        <Image
          src={game.image}
          alt={game.title}
          width={400}
          height={300}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button variant="default" size="sm" className="rounded-full">
            <Play className="mr-1 h-4 w-4" /> Zagraj teraz
          </Button>
        </div>
        <div className="absolute top-2 right-2 flex gap-1">
          {game.hot && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              HOT
            </span>
          )}
          {game.new && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
              NEW
            </span>
          )}
        </div>
      </div>
      <div className="p-4 flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{game.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
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
        <div className="mt-2 flex items-center text-sm">
          <div className="flex items-center">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
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
      <Link
        href={game.link}
        className="block p-3 bg-gray-100 dark:bg-gray-700 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center"
      >
        Zagraj teraz <ChevronRight className="inline-block ml-1 h-4 w-4" />
      </Link>
    </motion.div>
  );
}

export function FeaturedGames() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredGames.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
