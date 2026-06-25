import { useMemo, useState } from "react";

import {
  ThemeProvider,
} from "@mui/material/styles";

import CssBaseline from "@mui/material/CssBaseline";

import lightTheme from "./lightTheme";
import darkTheme from "./darkTheme";
import ThemeContextCustom from "./themeContext";

export const ThemeProviderCustom = ({
  children,
}) => {
  const [mode, setMode] =
    useState(
      localStorage.getItem(
        "theme"
      ) || "light"
    );

  const toggleTheme = () => {
    const newMode =
      mode === "light"
        ? "dark"
        : "light";

    setMode(newMode);

    localStorage.setItem(
      "theme",
      newMode
    );
  };

  const theme = useMemo(
    () =>
      mode === "light"
        ? lightTheme
        : darkTheme,
    [mode]
  );

  return (
    <ThemeContextCustom.Provider
      value={{
        mode,
        toggleTheme,
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContextCustom.Provider>
  );
};
