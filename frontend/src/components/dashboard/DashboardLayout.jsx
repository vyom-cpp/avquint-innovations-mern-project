import { Box, Drawer, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const SIDEBAR_W = 240;
const SIDEBAR_COLLAPSED_W = 72;

const DashboardLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_W;

  const handleMenuClick = () => {
    if (isMobile) {
      setDrawerOpen((p) => !p);
      return;
    }

    setSidebarCollapsed((p) => !p);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* Desktop: fixed sidebar */}
      {!isMobile && (
        <Box
          sx={{
            width: sidebarWidth,
            flexShrink: 0,
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            borderRight: "0.5px solid",
            borderColor: "divider",
            zIndex: theme.zIndex.drawer,
            bgcolor: "background.paper",
            transition: "width 0.18s ease",
          }}
        >
          <Sidebar collapsed={sidebarCollapsed} />
        </Box>
      )}

      {/* Mobile: temporary Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        variant="temporary"
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: SIDEBAR_W,
            borderRight: "0.5px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            boxShadow: "none",
          },
        }}
      >
        <Sidebar onClose={() => setDrawerOpen(false)} />
      </Drawer>

      {/* Main */}
      <Box
        sx={{
          flex: 1,
          ml: { xs: 0, md: `${sidebarWidth}px` },
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          minWidth: 0, // prevent flex overflow
          transition: "margin-left 0.18s ease",
        }}
      >
        <Navbar
          isMobile={isMobile}
          onMenuClick={handleMenuClick}
          sidebarCollapsed={sidebarCollapsed}
        />
        <Box component="main" sx={{ flex: 1, p: { xs: 2, sm: 3, md: 4 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
