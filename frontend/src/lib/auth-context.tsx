import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getMe,
  login as apiLogin,
  logout as apiLogout,
  type AuthUser,
  isStaff,
} from "@/lib/api/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isStaff: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken =
        window.localStorage.getItem('authToken') ||
        window.sessionStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await getMe();
      setUser(res.user);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    refresh().finally(() => setIsLoading(false));
  }, [refresh, token]);

  const login = useCallback(async (email: string, password: string, rememberMe?: boolean) => {
    const res = await apiLogin(email, password, rememberMe);
    setUser(res.user);
    if (res.token && typeof window !== 'undefined') {
      if (rememberMe) {
        window.localStorage.setItem('authToken', res.token);
      } else {
        window.sessionStorage.setItem('authToken', res.token);
      }
      setToken(res.token);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('authToken');
        window.sessionStorage.removeItem('authToken');
      }
      setUser(null);
      setToken(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      isStaff: isStaff(user),
      login,
      logout,
      refresh,
    }),
    [user, isLoading, login, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
