"use client";

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
import { authService } from "@/lib/auth/auth-service";

const loginSchema = z.object({
  email: z.string().email({ message: "Wprowadź poprawny adres e-mail" }),
  password: z
    .string()
    .min(6, { message: "Hasło musi mieć co najmniej 6 znaków" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const success = await authService.login({
        email: data.email,
        password: data.password,
      });

      if (success) {
        router.push("/");
        router.refresh();
      } else {
        setError("Nieprawidłowe dane logowania. Spróbuj ponownie.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Wystąpił błąd podczas logowania. Spróbuj ponownie.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Logowanie</CardTitle>
        <CardDescription>
          Wprowadź swoje dane, aby się zalogować
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Hasło</Label>
              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium text-primary-500 hover:underline"
              >
                Zapomniałeś hasła?
              </Link>
            </div>
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Zaloguj się
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Lub zaloguj się za pomocą
          </p>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" className="w-full" disabled={isLoading}>
              <Icons.google className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button variant="outline" className="w-full" disabled={isLoading}>
              <Icons.facebook className="mr-2 h-4 w-4" />
              Facebook
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Nie masz jeszcze konta?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-primary-500 hover:underline"
          >
            Zarejestruj się
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
