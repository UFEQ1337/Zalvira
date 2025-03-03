"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useWallet } from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "./mobile-menu";
import { UserDropdown } from "@/components/account/user-dropdown";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "@/components/ui/logo";
import { navigationConfig } from "@/config/navigation";
import { Search } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const { balance, currency } = useWallet();
  const [isScrolled, setIsScrolled] = useState(false);

  // Śledzenie przewijania strony
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-background-dark/80 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-6">
            <Logo />

            <nav className="hidden md:flex items-center space-x-1">
              {navigationConfig.mainMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                    pathname === item.href
                      ? "text-primary-500 dark:text-primary-400"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
                  }`}
                >
                  {pathname === item.href && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-primary-100 dark:bg-primary-900/20 rounded-md z-[-1]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" aria-label="Szukaj">
              <Search className="h-5 w-5" />
            </Button>

            <ThemeToggle />

            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center justify-center px-3 py-1.5 rounded-full bg-surface-light dark:bg-surface-dark">
                  <span className="text-sm font-medium mr-1">{balance}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {currency}
                  </span>
                </div>
                <UserDropdown user={user} />
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Logowanie</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">Rejestracja</Link>
                </Button>
              </div>
            )}

            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
