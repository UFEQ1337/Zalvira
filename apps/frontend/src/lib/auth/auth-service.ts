import { apiClient } from "@/lib/api/client";
import { setSession, clearSession } from "@/lib/auth/session";

export interface RegisterDto {
  email: string;
  password: string;
  username?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface RegisterResponse {
  message: string;
  userId: number;
}

const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
};

export const authService = {
  async login(loginDto: LoginDto): Promise<boolean> {
    try {
      const response = await apiClient.post<AuthResponse>(
        AUTH_ENDPOINTS.LOGIN,
        loginDto
      );

      if (response.access_token) {
        // Dekoduj token JWT aby uzyskać dane użytkownika
        const base64Url = response.access_token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(window.atob(base64));

        await setSession({
          token: response.access_token,
          userId: payload.sub,
          email: payload.email,
          roles: payload.roles || ["user"],
          expires: new Date(payload.exp * 1000),
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  },

  async register(registerDto: RegisterDto): Promise<RegisterResponse | null> {
    try {
      return await apiClient.post<RegisterResponse>(
        AUTH_ENDPOINTS.REGISTER,
        registerDto
      );
    } catch (error) {
      console.error("Register error:", error);
      return null;
    }
  },

  async logout(): Promise<void> {
    await clearSession();
  },
};
