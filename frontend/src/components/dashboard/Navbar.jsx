import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  DarkMode,
  LightMode,
  Menu as MenuIcon,
  MenuOpen,
} from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import UserMenu from "./UserMenu";
import { useThemeMode } from "../../theme/ThemeContext";

const Navbar = ({ onMenuClick, isMobile, sidebarCollapsed }) => {
  const { mode, toggleTheme } = useThemeMode();
  const location = useLocation();
  const pageTitle = location.pathname.startsWith("/tasks") ? "Tasks" : "Dashboard";

  return (
    <AppBar
      elevation={0}
      color="transparent"
      position="sticky"
      sx={{
        top: 0,
        zIndex: (t) => t.zIndex.drawer - 1,
        borderBottom: "0.5px solid",
        borderColor: "divider",
        bgcolor: "background.default",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "52px !important",
          px: { xs: 1.5, md: 3 },
          gap: 0,
        }}
      >
        <Tooltip title="Toggle sidebar" arrow>
          <IconButton
            size="small"
            onClick={onMenuClick}
            aria-label="Toggle sidebar"
            sx={{
              mr: 1,
              width: 36,
              height: 36,
              color: "text.secondary",
              flexShrink: 0,
              "&:hover": { bgcolor: "action.hover", color: "text.primary" },
            }}
          >
            {isMobile || sidebarCollapsed ? (
              <MenuIcon sx={{ fontSize: 20 }} />
            ) : (
              <MenuOpen sx={{ fontSize: 20 }} />
            )}
          </IconButton>
        </Tooltip>

        {/* Page title */}
        <Typography
          variant="h6"
          fontWeight={600}
          letterSpacing="-0.02em"
          noWrap
          sx={{ color: "text.primary", fontSize: "0.9375rem", flexShrink: 0 }}
        >
          {pageTitle}
        </Typography>

        {/* Push everything else to the right */}
        <Box sx={{ flex: 1 }} />

        {/* Theme toggle */}
        <Tooltip title={mode === "dark" ? "Light mode" : "Dark mode"} arrow>
          <IconButton
            onClick={toggleTheme}
            size="small"
            sx={{
              width: 32,
              height: 32,
              color: "text.secondary",
              flexShrink: 0,
              "&:hover": { bgcolor: "action.hover", color: "text.primary" },
            }}
          >
            {mode === "dark" ? (
              <LightMode sx={{ fontSize: 17 }} />
            ) : (
              <DarkMode sx={{ fontSize: 17 }} />
            )}
          </IconButton>
        </Tooltip>

        {/* Avatar — rightmost, no ml auto needed because spacer Box handles it */}
        <Box sx={{ ml: 0.5, flexShrink: 0 }}>
          <UserMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
