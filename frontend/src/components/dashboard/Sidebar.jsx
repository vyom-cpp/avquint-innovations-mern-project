import { Box, Typography, Stack, ButtonBase, Tooltip } from "@mui/material";
import { Dashboard, Task, AdminPanelSettings } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const Sidebar = ({ onClose, collapsed = false }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useAuth();

  const navItems = [
    {
      label: "Dashboard",
      icon: <Dashboard sx={{ fontSize: 17 }} />,
      path: "/dashboard",
    },
    {
      label: "Tasks",
      icon: <Task sx={{ fontSize: 17 }} />,
      path: "/tasks",
    },
  ];

  if (user?.role === "admin") {
    navItems.push({
      label: "Admin",
      icon: <AdminPanelSettings sx={{ fontSize: 17 }} />,
      path: "/admin",
    });
  }

  const handleNav = (path) => {
    navigate(path);
    onClose?.();
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: collapsed ? "20px 10px" : "20px 12px",
        bgcolor: "background.paper",
        overflowY: "auto",
        transition: "padding 0.18s ease",
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        letterSpacing="-0.03em"
        noWrap
        sx={{
          px: collapsed ? 0 : 1.5,
          mb: 3,
          color: "text.primary",
          fontSize: collapsed ? "0.875rem" : "1rem",
          textAlign: collapsed ? "center" : "left",
        }}
      >
        {collapsed ? "TF" : "TaskFlow"}
      </Typography>

      <Stack spacing={0.5}>
        {navItems.map(({ label, icon, path }) => {
          const active = location.pathname === path;

          return (
            <Tooltip
              key={path}
              title={collapsed ? label : ""}
              placement="right"
              arrow
            >
              <ButtonBase
                onClick={() => handleNav(path)}
                sx={{
                  width: "100%",
                  minHeight: 36,
                  display: "flex",
                  alignItems: "center",
                  gap: collapsed ? 0 : 1.5,
                  px: collapsed ? 0 : 1.5,
                  py: 0.75,
                  borderRadius: "6px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  color: active ? "text.primary" : "text.secondary",
                  bgcolor: active ? "action.hover" : "transparent",
                  fontSize: "0.875rem",
                  fontWeight: active ? 500 : 400,
                  transition: "background 0.12s, color 0.12s",
                  "&:hover": {
                    bgcolor: "action.hover",
                    color: "text.primary",
                  },
                }}
              >
                {icon}
                {!collapsed && label}
              </ButtonBase>
            </Tooltip>
          );
        })}
      </Stack>
    </Box>
  );
};

export default Sidebar;
