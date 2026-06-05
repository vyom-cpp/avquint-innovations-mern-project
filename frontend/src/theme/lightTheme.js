import { createTheme } from "@mui/material/styles";

const productFontStack =
  "Inter, 'Helvetica Neue', Helvetica, Arial, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

export const notionColorsLight = {
  default: { bg: "#FFFFFF", text: "#373530" },
  gray: { bg: "#F1F1EF", text: "#787774" },
  brown: { bg: "#F3EEEE", text: "#976D57" },
  orange: { bg: "#F8ECDF", text: "#CC782F" },
  yellow: { bg: "#FAF3DD", text: "#C29343" },
  green: { bg: "#EEF3ED", text: "#548164" },
  blue: { bg: "#E9F3F7", text: "#487CA5" },
  purple: { bg: "#F6F3F8", text: "#8A67AB" },
  pink: { bg: "#F9F2F5", text: "#B35488" },
  red: { bg: "#FAECEC", text: "#C4554D" },
};

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#373530", light: "#787774", contrastText: "#FFFFFF" },
    secondary: { main: "#548164", contrastText: "#FFFFFF" },
    background: { default: "#FFFFFF", paper: "#F1F1EF" },
    text: { primary: "#373530", secondary: "#787774", disabled: "#C7C6C3" },
    divider: "#E9E9E7",
    action: {
      hover: "#F1F1EF",
      selected: "#FAF3DD",
      focus: "#E9F3F7",
      disabledBackground: "#F1F1EF",
    },
    notion: notionColorsLight,
    error: { main: "#C4554D", light: "#FAECEC", contrastText: "#FFFFFF" },
    warning: { main: "#CC782F", light: "#F8ECDF", contrastText: "#FFFFFF" },
    info: { main: "#487CA5", light: "#E9F3F7", contrastText: "#FFFFFF" },
    success: { main: "#548164", light: "#EEF3ED", contrastText: "#FFFFFF" },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: productFontStack,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: { fontWeight: 700, letterSpacing: "-0.03em" },
    h2: { fontWeight: 600, letterSpacing: "-0.02em" },
    h3: { fontWeight: 600, letterSpacing: "-0.015em" },
    h4: { fontWeight: 600, letterSpacing: "-0.01em" },
    h5: { fontWeight: 600, letterSpacing: "-0.01em" },
    h6: { fontWeight: 600, letterSpacing: "-0.005em" },
    body1: {
      fontSize: "0.9375rem",
      lineHeight: 1.6,
      letterSpacing: "-0.005em",
    },
    body2: { fontSize: "0.875rem", lineHeight: 1.5, letterSpacing: "-0.003em" },
    caption: {
      fontSize: "0.8125rem",
      color: "#787774",
      letterSpacing: "0.01em",
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
      letterSpacing: "-0.01em",
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          transition: "background-color 0.12s ease, border-color 0.12s ease",
          "&.Mui-focused": {
            backgroundColor: "#FFFFFF",
          },
          "& input:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0 100px #FFFFFF inset",
            WebkitTextFillColor: "#373530",
            caretColor: "#373530",
            borderRadius: "inherit",
            transition: "background-color 9999s ease-out 0s",
          },
          "& input::selection": {
            backgroundColor: "rgba(55, 53, 47, 0.14)",
          },
        },
      },
    },
  },
  shadows: [
    "none",
    "0px 1px 2px rgba(55, 53, 47, 0.06)",
    "0px 2px 8px rgba(55, 53, 47, 0.08)",
    "0px 4px 16px rgba(55, 53, 47, 0.10)",
    ...Array(21).fill("none"),
  ],
});

export default lightTheme;
