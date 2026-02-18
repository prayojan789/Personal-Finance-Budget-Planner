/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage.js";

const ThemeContext = createContext(null);
const THEME_STORAGE_KEY = "budget-planner-theme";
const DEFAULT_THEME = "system";

const getSystemTheme = () => {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const addThemeTransition = () => {
  if (typeof window === "undefined" || !window.matchMedia) return;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const root = document.documentElement;
  root.classList.add("theme-transition");
  window.setTimeout(() => root.classList.remove("theme-transition"), 300);
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage(THEME_STORAGE_KEY, DEFAULT_THEME);
  const [resolvedTheme, setResolvedTheme] = useState(getSystemTheme());

  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (nextTheme) => {
      root.dataset.theme = nextTheme;
      root.style.colorScheme = nextTheme;
      addThemeTransition();
      setResolvedTheme(nextTheme);
    };

    if (theme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (event) => {
        applyTheme(event.matches ? "dark" : "light");
      };

      applyTheme(media.matches ? "dark" : "light");

      if (media.addEventListener) {
        media.addEventListener("change", handleChange);
      } else {
        media.addListener(handleChange);
      }

      return () => {
        if (media.removeEventListener) {
          media.removeEventListener("change", handleChange);
        } else {
          media.removeListener(handleChange);
        }
      };
    }

    applyTheme(theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
      isSystem: theme === "system",
    }),
    [theme, setTheme, resolvedTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
