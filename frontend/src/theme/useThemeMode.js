import { useContext } from "react";
import ThemeContextCustom from "./themeContext";

export const useThemeMode = () => useContext(ThemeContextCustom);
