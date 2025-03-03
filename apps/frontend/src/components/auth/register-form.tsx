("use client");

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { authService } from "@/lib/auth/auth-service";

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Nazwa użytkownika musi mieć co najmniej 3 znaki" }),
    email: z.string().email({ message: "Wprowadź poprawny adres e-mail" }),
    password: z
      .string()
      .min(6, { message: "Hasło musi mieć co najmniej 6 znaków" }),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "Musisz zaakceptować regulamin",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są identyczne",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await authService.register({
        email: data.email,
        password: data.password,
        username: data.username,
      });

      if (response) {
        setSuccess(
          "Rejestracja przebiegła pomyślnie. Możesz się teraz zalogować."
        );
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        setError("Wystąpił błąd podczas rejestracji. Spróbuj ponownie.");
      }
    } catch (error) {
      console.error("Register error:", error);
      setError("Wystąpił błąd podczas rejestracji. Spróbuj ponownie.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Rejestracja</CardTitle>
        <CardDescription>Utwórz konto, aby rozpocząć grę</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert variant="success">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">Nazwa użytkownika</Label>
            <Input
              id="username"
              placeholder="Twoja nazwa"
              disabled={isLoading}
              {...form.register("username")}
            />
            {form.formState.errors.username && (
              <p className="text-sm text-red-500">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Adres e-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="twoj@email.com"
              disabled={isLoading}
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Hasło</Label>
            <Input
              id="password"
              type="password"
              disabled={isLoading}
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
            <Input
              id="confirmPassword"
              type="password"
              disabled={isLoading}
              {...form.register("confirmPassword")}
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="termsAccepted"
              disabled={isLoading}
              checked={form.watch("termsAccepted")}
              onCheckedChange={(checked) => {
                form.setValue("termsAccepted", checked as boolean);
              }}
            />
            <label
              htmlFor="termsAccepted"
              className="text-sm text-muted-foreground"
            >
              Akceptuję{" "}
              <Link
                href="/terms"
                className="font-medium text-primary-500 hover:underline"
              >
                regulamin
              </Link>{" "}
              i{" "}
              <Link
                href="/privacy"
                className="font-medium text-primary-500 hover:underline"
              >
                politykę prywatności
              </Link>
            </label>
          </div>
          {form.formState.errors.termsAccepted && (
            <p className="text-sm text-red-500">
              {form.formState.errors.termsAccepted.message}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Zarejestruj się
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Masz już konto?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-primary-500 hover:underline"
          >
            Zaloguj się
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

// src/components/auth/auth-guard.tsx
("use client");

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated, hasRole } from "@/lib/auth/session";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface AuthGuardProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkAuth() {
      try {
        const authenticated = await isAuthenticated();

        if (!authenticated) {
          if (!isPublicRoute(pathname)) {
            router.push(
              `/auth/login?returnUrl=${encodeURIComponent(pathname)}`
            );
          } else {
            setIsAuthorized(true);
          }
        } else {
          if (requireAdmin) {
            const isAdmin = await hasRole("admin");
            if (!isAdmin) {
              router.push("/");
            } else {
              setIsAuthorized(true);
            }
          } else {
            if (pathname.startsWith("/auth/") && pathname !== "/auth/logout") {
              router.push("/");
            } else {
              setIsAuthorized(true);
            }
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [pathname, router, requireAdmin]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthorized && !isPublicRoute(pathname)) {
    return null;
  }

  return <>{children}</>;
}

// Lista publicznie dostępnych tras
function isPublicRoute(pathname: string): boolean {
  const publicRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/",
    "/about",
    "/terms",
    "/privacy",
    "/contact",
    "/responsible-gaming",
  ];

  return (
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/blog/") ||
    pathname === "/blog"
  );
}
