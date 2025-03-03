export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
export const API_TIMEOUT = 30000; // 30 sekund

export const siteConfig = {
  name: "Zalvira Casino",
  description:
    "Najlepsze kasyno online z setkami gier, bonusami i szybkimi wypłatami.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  logoText: "ZALVIRA",
  locale: "pl",
  themeColor: "#6200EA",
  ogImage: "/images/og-image.jpg",

  // Konfiguracja nawigacji
  mainNav: [
    { title: "Strona Główna", href: "/" },
    { title: "Sloty", href: "/slots" },
    { title: "Kasyno na żywo", href: "/live-casino" },
    { title: "Gry stołowe", href: "/table-games" },
    { title: "Jackpoty", href: "/jackpots" },
    { title: "Promocje", href: "/promotions" },
  ],

  // Konfiguracja linków w stopce
  footerLinks: [
    {
      title: "Gry",
      links: [
        { title: "Sloty", href: "/slots" },
        { title: "Blackjack", href: "/table-games/blackjack" },
        { title: "Ruletka", href: "/table-games/roulette" },
        { title: "Kasyno na żywo", href: "/live-casino" },
        { title: "Jackpoty", href: "/jackpots" },
      ],
    },
    {
      title: "O nas",
      links: [
        { title: "O Zalvira", href: "/about" },
        { title: "Regulamin", href: "/terms" },
        { title: "Polityka prywatności", href: "/privacy" },
        { title: "Odpowiedzialna gra", href: "/responsible-gaming" },
        { title: "Kontakt", href: "/contact" },
      ],
    },
    {
      title: "Konto",
      links: [
        { title: "Profil", href: "/account/profile" },
        { title: "Portfel", href: "/account/wallet" },
        { title: "Historia gier", href: "/account/history" },
        { title: "Bonusy", href: "/account/bonuses" },
        { title: "Ustawienia", href: "/account/settings" },
      ],
    },
  ],

  // Konfiguracja typów gier
  gameTypes: [
    { name: "slot-machine", label: "Automaty", path: "/slots" },
    { name: "blackjack", label: "Blackjack", path: "/table-games/blackjack" },
    { name: "roulette", label: "Ruletka", path: "/table-games/roulette" },
    { name: "dice", label: "Kości", path: "/table-games/dice" },
    { name: "baccarat", label: "Baccarat", path: "/table-games/baccarat" },
    { name: "scratch-card", label: "Zdrapki", path: "/scratch-cards" },
  ],

  // Konfiguracja metod płatności
  paymentMethods: [
    { name: "Visa/Mastercard", icon: "credit-card" },
    { name: "BLIK", icon: "blik" },
    { name: "Przelewy24", icon: "bank" },
    { name: "Skrill", icon: "wallet" },
    { name: "Neteller", icon: "wallet" },
    { name: "Bitcoin", icon: "bitcoin" },
  ],

  // Konfiguracja limitów wpłat/wypłat
  depositLimits: {
    min: 10,
    max: 10000,
  },

  withdrawalLimits: {
    min: 20,
    max: 5000,
  },
};

// src/config/features.ts
export const featuresConfig = {
  registration: true,
  liveCasino: true,
  responsibleGaming: true,
  chat: true,
  cryptocurrencies: true,
  mobileApps: false,
  tournaments: true,
  achievements: true,
  vipProgram: true,
  darkModeDefault: true,
};

// src/config/navigation.ts
export const navigationConfig = {
  mainMenuItems: [
    { label: "Strona Główna", href: "/" },
    { label: "Sloty", href: "/slots" },
    { label: "Kasyno na żywo", href: "/live-casino" },
    { label: "Gry stołowe", href: "/table-games" },
    { label: "Promocje", href: "/promotions" },
  ],

  gamesSubmenu: [
    { label: "Sloty", href: "/slots", icon: "slots" },
    { label: "Blackjack", href: "/table-games/blackjack", icon: "cards" },
    { label: "Ruletka", href: "/table-games/roulette", icon: "roulette" },
    { label: "Kości", href: "/table-games/dice", icon: "dice" },
    { label: "Baccarat", href: "/table-games/baccarat", icon: "cards" },
    { label: "Zdrapki", href: "/scratch-cards", icon: "ticket" },
  ],

  accountSubmenu: [
    { label: "Profil", href: "/account/profile", icon: "user" },
    { label: "Portfel", href: "/account/wallet", icon: "wallet" },
    { label: "Historia gier", href: "/account/history", icon: "history" },
    { label: "Bonusy", href: "/account/bonuses", icon: "gift" },
    { label: "Ustawienia", href: "/account/settings", icon: "settings" },
    { label: "Wyloguj", href: "#", action: "logout", icon: "log-out" },
  ],
};
