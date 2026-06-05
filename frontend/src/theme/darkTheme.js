import { createTheme } from "@mui/material/styles";

const productFontStack =
  "Inter, 'Helvetica Neue', Helvetica, Arial, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

export const notionColorsDark = {
  default: { bg: "#191919", text: "#D4D4D4" },
  gray: { bg: "#252525", text: "#9B9B9B" },
  brown: { bg: "#2E2724", text: "#A27763" },
  orange: { bg: "#36291F", text: "#CB7B37" },
  yellow: { bg: "#372E20", text: "#C19138" },
  green: { bg: "#242B26", text: "#4F9768" },
  blue: { bg: "#1F282D", text: "#447ACB" },
  purple: { bg: "#2A2430", text: "#865DBB" },
  pink: { bg: "#2E2328", text: "#BA4A78" },
  red: { bg: "#2E2323", text: "#BE524B" },
};

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#D4D4D4", light: "#FFFFFF", contrastText: "#191919" },
    secondary: { main: "#4F9768", contrastText: "#191919" },
    background: { default: "#191919", paper: "#252525" },
    text: { primary: "#D4D4D4", secondary: "#9B9B9B", disabled: "#3F3F3F" },
    divider: "#2E2E2E",
    action: {
      hover: "#252525",
      selected: "#372E20",
      focus: "#1F282D",
      disabledBackground: "#252525",
    },
    notion: notionColorsDark,
    error: { main: "#BE524B", light: "#2E2323", contrastText: "#191919" },
    warning: { main: "#CB7B37", light: "#36291F", contrastText: "#191919" },
    info: { main: "#447ACB", light: "#1F282D", contrastText: "#191919" },
    success: { main: "#4F9768", light: "#242B26", contrastText: "#191919" },
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
      color: "#9B9B9B",
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
          backgroundColor: "#191919",
          transition: "background-color 0.12s ease, border-color 0.12s ease",
          "&.Mui-focused": {
            backgroundColor: "#191919",
          },
          "& input:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0 100px #191919 inset",
            WebkitTextFillColor: "#D4D4D4",
            caretColor: "#D4D4D4",
            borderRadius: "inherit",
            transition: "background-color 9999s ease-out 0s",
          },
          "& input::selection": {
            backgroundColor: "rgba(212, 212, 212, 0.18)",
          },
        },
      },
    },
  },
  shadows: [
    "none",
    "0px 1px 2px rgba(0,0,0,0.3)",
    "0px 2px 8px rgba(0,0,0,0.4)",
    "0px 4px 16px rgba(0,0,0,0.5)",
    ...Array(21).fill("none"),
  ],
});

export default darkTheme;
