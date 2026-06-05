import {
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Typography,
} from "@mui/material";
import { Logout, AccountCircle } from "@mui/icons-material";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate("/login");
  };

  return (
    <>
      <Avatar
        sx={{
          cursor: "pointer",
          width: 34,
          height: 34,
          fontSize: "0.875rem",
          fontWeight: 600,
          bgcolor: "action.selected",
          color: "text.primary",
          border: "1.5px solid",
          borderColor: "divider",
          ml: 0.5,
          "&:hover": { borderColor: "text.secondary" },
          transition: "border-color 0.15s ease",
        }}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        {user?.name?.[0]?.toUpperCase()}
      </Avatar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              mt: 1,
              minWidth: 200,
              border: "0.5px solid",
              borderColor: "divider",
              borderRadius: 2,
              overflow: "visible",
              boxShadow: "0px 4px 16px rgba(0,0,0,0.08)",
            },
          },
        }}
      >
        {/* User info header */}
        <MenuItem disabled sx={{ opacity: "1 !important", py: 1.5, px: 2 }}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <AccountCircle sx={{ fontSize: 18, color: "text.secondary" }} />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={500} color="text.primary">
            {user?.name}
          </Typography>
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1,
            px: 2,
            color: "error.main",
            "&:hover": { bgcolor: "error.light" },
            borderRadius: 1,
            mx: 0.5,
          }}
        >
          <ListItemIcon sx={{ minWidth: 32 }}>
            <Logout sx={{ fontSize: 16, color: "error.main" }} />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={500} color="error.main">
            Log out
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
