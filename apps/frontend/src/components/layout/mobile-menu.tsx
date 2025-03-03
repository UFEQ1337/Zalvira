"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useWallet } from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { authService } from "@/lib/auth/auth-service";
import {
  Menu,
  X,
  ChevronRight,
  LogOut,
  User,
  Wallet,
  History,
  Settings,
  Gift,
  Home,
  CreditCard,
  LucideIcon,
} from "lucide-react";

// Definiowanie typów dla nawigacji
interface NavItem {
  label: string;
  href: string;
  icon?: string;
  action?: string;
}

interface NavItemWithIcon {
  label: string;
  href: string;
  icon: LucideIcon;
  action?: string;
}

// Konfiguracja nawigacji
const navigationConfig = {
  mainMenuItems: [
    { label: "Strona Główna", href: "/" },
    { label: "Sloty", href: "/slots" },
    { label: "Kasyno na żywo", href: "/live-casino" },
    { label: "Gry stołowe", href: "/table-games" },
    { label: "Promocje", href: "/promotions" },
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

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { balance, currency } = useWallet();
  const pathname = usePathname();
  const router = useRouter();

  // Dodaj ikony do elementów nawigacji
  const mainMenuWithIcons: NavItemWithIcon[] = [
    { label: "Strona Główna", href: "/", icon: Home },
    ...navigationConfig.mainMenuItems
      .filter((item: NavItem) => item.href !== "/")
      .map((item: NavItem) => ({
        ...item,
        icon: getIconForPath(item.href),
      })),
  ];

  const accountMenuItems: NavItemWithIcon[] = [
    { label: "Profil", href: "/account/profile", icon: User },
    { label: "Portfel", href: "/account/wallet", icon: Wallet },
    { label: "Historia gier", href: "/account/history", icon: History },
    { label: "Bonusy", href: "/account/bonuses", icon: Gift },
    { label: "Ustawienia", href: "/account/settings", icon: Settings },
    { label: "Wyloguj", href: "#", icon: LogOut, action: "logout" },
  ];

  // Helper do przydzielania ikon na podstawie ścieżki
  function getIconForPath(path: string): LucideIcon {
    if (path.includes("slots")) return CreditCard;
    if (path.includes("live-casino")) return CreditCard;
    if (path.includes("table-games")) return CreditCard;
    if (path.includes("promotions")) return Gift;
    return ChevronRight;
  }

  const handleNavigation = (item: NavItemWithIcon) => {
    if (item.action === "logout") {
      handleLogout();
    } else {
      router.push(item.href);
      setOpen(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Otwórz menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="p-0 flex flex-col h-full">
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
            <span className="sr-only">Zamknij menu</span>
          </Button>
        </div>

        {isAuthenticated && (
          <div className="p-4 bg-primary-500/10 dark:bg-primary-900/20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-primary-500 text-white flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">{user?.username || "Użytkownik"}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </div>
            <div className="mt-3 p-2 bg-white dark:bg-background-dark rounded-md flex justify-between items-center">
              <span className="text-sm">Saldo:</span>
              <span className="font-bold text-primary-500">
                {balance} {currency}
              </span>
            </div>
          </div>
        )}

        <nav className="flex-grow overflow-y-auto p-4">
          <ul className="space-y-1">
            {mainMenuWithIcons.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <button
                    onClick={() => handleNavigation(item)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? "bg-primary-500/10 text-primary-500 dark:bg-primary-900/20 dark:text-primary-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {isAuthenticated && (
            <>
              <Separator className="my-4" />
              <p className="mb-2 px-3 text-sm font-semibold text-gray-500 dark:text-gray-400">
                Twoje konto
              </p>
              <ul className="space-y-1">
                {accountMenuItems.map((item) => (
                  <li key={item.href}>
                    <button
                      onClick={() => handleNavigation(item)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                        pathname === item.href
                          ? "bg-primary-500/10 text-primary-500 dark:bg-primary-900/20 dark:text-primary-400"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {!isAuthenticated && (
            <div className="mt-6 p-4 flex flex-col space-y-3">
              <Button asChild onClick={() => setOpen(false)}>
                <Link href="/auth/login">Zaloguj się</Link>
              </Button>
              <Button variant="outline" asChild onClick={() => setOpen(false)}>
                <Link href="/auth/register">Zarejestruj się</Link>
              </Button>
            </div>
          )}
        </nav>

        <div className="p-4 border-t">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Zalvira Casino
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
