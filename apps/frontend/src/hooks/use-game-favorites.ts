"use client";

import { useState, useEffect, useCallback } from "react";

export function useGameFavorites(gameId: string) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Sprawdź, czy gra jest ulubiona przy montowaniu
  useEffect(() => {
    const checkIfFavorite = () => {
      const favoritesString = localStorage.getItem("favoriteGames");
      if (favoritesString) {
        const favorites = JSON.parse(favoritesString);
        setIsFavorite(favorites.includes(gameId));
      }
    };

    checkIfFavorite();
  }, [gameId]);

  const toggleFavorite = useCallback(() => {
    setIsFavorite((current) => {
      const newState = !current;

      // Pobierz aktualne ulubione
      const favoritesString = localStorage.getItem("favoriteGames");
      let favorites: string[] = [];

      if (favoritesString) {
        favorites = JSON.parse(favoritesString);
      }

      // Dodaj lub usuń grę z ulubionych
      if (newState) {
        if (!favorites.includes(gameId)) {
          favorites.push(gameId);
        }
      } else {
        favorites = favorites.filter((id) => id !== gameId);
      }

      // Zapisz zaktualizowaną listę
      localStorage.setItem("favoriteGames", JSON.stringify(favorites));

      return newState;
    });
  }, [gameId]);

  return { isFavorite, toggleFavorite };
}
