import Cookies from "js-cookie";

export interface Session {
  token: string;
  userId: number;
  email: string;
  roles: string[];
  expires: Date;
}

const SESSION_COOKIE_KEY = "casino_session";

export async function getSession(): Promise<Session | null> {
  const sessionStr = Cookies.get(SESSION_COOKIE_KEY);

  if (!sessionStr) {
    return null;
  }

  try {
    const session = JSON.parse(sessionStr) as Session;

    // Sprawdź, czy token nie wygasł
    if (new Date(session.expires) < new Date()) {
      await clearSession();
      return null;
    }

    return session;
  } catch (error) {
    console.error("Error parsing session:", error);
    await clearSession();
    return null;
  }
}

export async function setSession(session: Session): Promise<void> {
  // Ustawienie cookie z datą wygaśnięcia
  const expiresInDays = Math.ceil(
    (new Date(session.expires).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  Cookies.set(SESSION_COOKIE_KEY, JSON.stringify(session), {
    expires: expiresInDays,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearSession(): Promise<void> {
  Cookies.remove(SESSION_COOKIE_KEY);
}

export async function refreshToken(): Promise<boolean> {
  // W tym przypadku backend nie ma endpointu do odświeżenia tokenu,
  // więc gdy token wygaśnie, wylogujemy użytkownika
  const session = await getSession();

  if (!session) {
    return false;
  }

  // Sprawdź, czy token niedługo wygaśnie (mniej niż 5 minut)
  const expiresIn = new Date(session.expires).getTime() - new Date().getTime();
  if (expiresIn < 5 * 60 * 1000) {
    await clearSession();
    return false;
  }

  return true;
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

export async function hasRole(role: string): Promise<boolean> {
  const session = await getSession();
  return session?.roles.includes(role) || false;
}
