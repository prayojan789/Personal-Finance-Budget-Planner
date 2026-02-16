/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import useLocalStorage from "../hooks/useLocalStorage.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage("budget-planner-user", null);
  const [session, setSession] = useLocalStorage("budget-planner-session", null);
  const activityTimeout = useRef(null);
  const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

  const createSession = useCallback(() => {
    const now = new Date().toISOString();
    return { startedAt: now, lastActiveAt: now };
  }, []);

  const parseTimestamp = (value) => {
    if (!value) return null;
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
  };

  const isSessionExpired = useCallback(
    (currentSession) => {
      const lastActive = parseTimestamp(currentSession?.lastActiveAt);
      if (!lastActive) return true;
      return Date.now() - lastActive > SESSION_TIMEOUT_MS;
    },
    [SESSION_TIMEOUT_MS]
  );

  const refreshActivity = useCallback(() => {
    if (!user) return;
    setSession((prev) => {
      if (!prev?.startedAt) return createSession();
      return { ...prev, lastActiveAt: new Date().toISOString() };
    });
  }, [user, setSession, createSession]);

  useEffect(() => {
    if (!user) {
      if (session) setSession(null);
      return;
    }

    if (!user.email || !user.name) {
      setUser(null);
      setSession(null);
      return;
    }

    if (!session?.startedAt) {
      setSession(createSession());
      return;
    }

    if (isSessionExpired(session)) {
      setUser(null);
      setSession(null);
      return;
    }

    refreshActivity();
  }, [user, session, setSession, setUser, createSession, isSessionExpired, refreshActivity]);

  useEffect(() => {
    if (!user) return undefined;

    const scheduleRefresh = () => {
      if (activityTimeout.current) {
        clearTimeout(activityTimeout.current);
      }

      activityTimeout.current = setTimeout(() => {
        refreshActivity();
      }, 500);
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        scheduleRefresh();
      }
    };

    window.addEventListener("click", scheduleRefresh);
    window.addEventListener("keydown", scheduleRefresh);
    window.addEventListener("focus", scheduleRefresh);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("click", scheduleRefresh);
      window.removeEventListener("keydown", scheduleRefresh);
      window.removeEventListener("focus", scheduleRefresh);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (activityTimeout.current) {
        clearTimeout(activityTimeout.current);
      }
    };
  }, [user, refreshActivity]);

  const login = (email, password) => {
    // Mock authentication - in real app, this would call an API
    if (email && password.length >= 6) {
      const mockUser = {
        email,
        name: email.split("@")[0],
      };
      setUser(mockUser);
      setSession(createSession());
      return { success: true, user: mockUser };
    }
    return { success: false, error: "Invalid credentials" };
  };

  const register = (name, email, password) => {
    // Mock registration - in real app, this would call an API
    if (name && email && password.length >= 6) {
      const mockUser = {
        email,
        name,
      };
      setUser(mockUser);
      setSession(createSession());
      return { success: true, user: mockUser };
    }
    return { success: false, error: "Invalid registration data" };
  };

  const logout = () => {
    setUser(null);
    setSession(null);
  };

  const value = {
    user,
    session,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
