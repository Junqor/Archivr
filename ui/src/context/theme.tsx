import { useContext, createContext, useState } from "react";
import { THEME } from "@/types/theme";

// Searches for theme in localStorage, then the browser default, then defaults to dark
function getThemeFromBrowser() {
  const theme = parseInt(localStorage.getItem("Theme") ?? "") as THEME;
  if (!isNaN(theme)) return theme;
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches
  ) {
    return THEME.LIGHT;
  }
  return THEME.DARK;
}

export type TThemeContext = {
  theme: THEME;
  setTheme: (theme: THEME) => void;
};

const ThemeContext = createContext<TThemeContext | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeState, setThemeState] = useState<THEME>();

  const setTheme = (theme: THEME) => {
    localStorage.setItem("Theme", theme.toString());
    setThemeState(theme);
    if (theme == THEME.DARK) {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
    }
  };

  if (themeState == undefined) {
    setTheme(getThemeFromBrowser());
  }

  return (
    <ThemeContext.Provider
      value={{
        theme: themeState != undefined ? themeState : THEME.DARK,
        setTheme: setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside a ThemeProvider");
  }
  return context;
}
