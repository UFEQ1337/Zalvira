"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getSession, isAuthenticated, hasRole } from "@/lib/auth/session";
import { authService } from "@/lib/auth/auth-service";

export interface User {
  id: number;
  email: string;
  username?: string;
  roles: string[];
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();

  const loadUser = useCallback(async () => {
    setLoading(true);
    try {
      const authenticated = await isAuthenticated();
      setIsAuth(authenticated);

      if (authenticated) {
        const session = await getSession();
        if (session) {
          setUser({
            id: session.userId,
            email: session.email,
            roles: session.roles,
          });
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Error loading user:", err);
      setError("Nie udało się załadować danych użytkownika");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const success = await authService.login({ email, password });

      if (success) {
        await loadUser();
        return true;
      } else {
        setError("Nieprawidłowe dane logowania");
        return false;
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Wystąpił błąd podczas logowania");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuth(false);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const checkIsAdmin = useCallback(async () => {
    return await hasRole("admin");
  }, []);

  return {
    user,
    isAuthenticated: isAuth,
    loading,
    error,
    login,
    logout,
    checkIsAdmin,
    refreshUser: loadUser,
  };
}
