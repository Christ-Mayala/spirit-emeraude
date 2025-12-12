import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type {
  AuthLoginResponse,
  AuthProfileResponse,
  LoginPayload,
  RegisterPayload,
} from "@/features/auth/AuthTypes";
import { api } from "@/core/api/api";

interface AuthContextValue {
  user: AuthProfileResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_STORAGE_KEY = "spiritemeraude:authToken";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthProfileResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    setToken(storedToken);

    void (async () => {
      try {
        const profile = await api.auth.profile(storedToken);
        setUser(profile);
      } catch {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (payload: LoginPayload) => {
    const { token: jwt, user } = (await api.auth.login(
      payload,
    )) as AuthLoginResponse;

    window.localStorage.setItem(TOKEN_STORAGE_KEY, jwt);
    setToken(jwt);
    setUser(user);
  };

  const register = async (payload: RegisterPayload) => {
    await api.auth.register(payload);
  };

  const logout = () => {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    if (!token) return;
    const profile = await api.auth.profile(token);
    setUser(profile);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isLoading,
      login,
      register,
      logout,
      refreshProfile,
    }),
    [user, token, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return ctx;
}
