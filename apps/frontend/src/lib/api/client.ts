/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_BASE_URL, API_TIMEOUT } from "@/config/site";
import { getSession, refreshToken } from "@/lib/auth/session";

type FetchOptions = RequestInit & {
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  skipTokenRefresh?: boolean;
};

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function fetchWithAuth(
  endpoint: string,
  options: FetchOptions = {}
) {
  const {
    params,
    timeout = API_TIMEOUT,
    skipTokenRefresh = false,
    ...fetchOptions
  } = options;

  // Konstrukcja URL z ewentualnymi parametrami
  let url = `${API_BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }

  // Przygotuj nagłówki z tokenem autoryzacji
  const session = await getSession();
  const headers = new Headers(fetchOptions.headers);

  if (session?.token) {
    headers.set("Authorization", `Bearer ${session.token}`);
  }

  headers.set("Content-Type", "application/json");

  // Dodaj timeout do fetch
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Obsługa 401 Unauthorized - odświeżenie tokena i ponowienie próby
    if (response.status === 401 && !skipTokenRefresh) {
      const refreshed = await refreshToken();
      if (refreshed) {
        return fetchWithAuth(endpoint, {
          ...options,
          skipTokenRefresh: true,
        });
      }
    }

    // Parsowanie odpowiedzi
    let data;
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new ApiError(
        data.message || "Wystąpił błąd podczas komunikacji z serwerem",
        response.status,
        data
      );
    }

    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error.name === "AbortError") {
      throw new ApiError("Przekroczono czas oczekiwania na odpowiedź", 408, {});
    }

    throw new ApiError(error.message || "Nieznany błąd", 500, {});
  }
}

// Metody pomocnicze
export const apiClient = {
  get: <T = any>(endpoint: string, options?: FetchOptions): Promise<T> =>
    fetchWithAuth(endpoint, { method: "GET", ...options }),

  post: <T = any>(
    endpoint: string,
    data?: any,
    options?: FetchOptions
  ): Promise<T> =>
    fetchWithAuth(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),

  put: <T = any>(
    endpoint: string,
    data?: any,
    options?: FetchOptions
  ): Promise<T> =>
    fetchWithAuth(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),

  patch: <T = any>(
    endpoint: string,
    data?: any,
    options?: FetchOptions
  ): Promise<T> =>
    fetchWithAuth(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),

  delete: <T = any>(endpoint: string, options?: FetchOptions): Promise<T> =>
    fetchWithAuth(endpoint, { method: "DELETE", ...options }),
};
