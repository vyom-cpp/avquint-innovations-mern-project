import {
  Box,
  Container,
  Paper,
  Stack,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";

import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import { useThemeMode } from "../theme/ThemeContext";

const AuthLayout = ({
  title,
  subtitle,
  children,
}) => {
  const {
    mode,
    toggleTheme,
  } = useThemeMode();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        bgcolor: "background.default",
        transition: "all 0.2s ease",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            transition:
              "all 0.2s ease",
          }}
        >
          <Stack spacing={3}>
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h5"
                fontWeight={700}
              >
                TaskFlow
              </Typography>

              <Tooltip
                title={
                  mode === "light"
                    ? "Dark Mode"
                    : "Light Mode"
                }
              >
                <IconButton
                  onClick={
                    toggleTheme
                  }
                >
                  {mode ===
                  "light" ? (
                    <DarkModeIcon />
                  ) : (
                    <LightModeIcon />
                  )}
                </IconButton>
              </Tooltip>
            </Box>

            <Box>
              <Typography
                variant="h4"
                fontWeight={700}
              >
                {title}
              </Typography>

              <Typography
                color="text.secondary"
              >
                {subtitle}
              </Typography>
            </Box>

            {children}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;