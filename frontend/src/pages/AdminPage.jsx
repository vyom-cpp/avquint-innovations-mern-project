import { useCallback, useMemo, useState, useEffect, useRef } from "react";

import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Stack,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  CardActions,
  Divider,
  Pagination,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AccessTime from "@mui/icons-material/AccessTime";

import DashboardLayout from "../components/dashboard/DashboardLayout";

import {
  getAdminStats,
  getUsers,
  deleteUser,
  updateUserRole,
} from "../services/adminService";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

// clock hook
const useClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
};

const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const initRef = useRef(false);
  const now = useClock();

  const refreshData = useCallback(async () => {
    try {
      const [statsData, usersData] = await Promise.all([
        getAdminStats(),
        getUsers(),
      ]);

      setStats(statsData.stats);
      setUsers(usersData.users);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (!initRef.current) {
      initRef.current = true;
      refreshData();
    }
  }, [refreshData]);

  const filteredUsers = useMemo(() => {
    const filtered = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()),
    );
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [users, search, page, limit]);

  const filteredCount = useMemo(() => {
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()),
    ).length;
  }, [users, search]);

  const totalItems = filteredCount;
  const totalPages = Math.max(Math.ceil(filteredCount / limit), 1);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this user permanently?");
    if (!confirmed) return;
    try {
      await deleteUser(id);
      await refreshData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRoleChange = async (id, currentRole) => {
    try {
      await updateUserRole(id, currentRole === "admin" ? "user" : "admin");
      await refreshData();
    } catch (error) {
      console.error(error);
    }
  };

  if (!stats) {
    return (
      <DashboardLayout>
        <Typography>Loading…</Typography>
      </DashboardLayout>
    );
  }

  const cards = [
    { title: "Total Users", value: stats.totalUsers, color: "#378ADD" },
    { title: "Verified Users", value: stats.verifiedUsers, color: "#1D9E75" },
    { title: "Total Tasks", value: stats.totalTasks, color: "#EF9F27" },
    { title: "Completed Tasks", value: stats.completedTasks, color: "#7F77DD" },
    { title: "Pending Tasks", value: stats.pendingTasks, color: "#D9485F" },
  ];

  return (
    <DashboardLayout>
      <Box>
        {/* ── Header with clock ─────────────────────────── */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: { xs: 2, md: 2.5 },
            gap: 2,
          }}
        >
          <Box />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 0.75,
            }}
          >
            {/* Live clock */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                bgcolor: "background.paper",
                border: "0.5px solid",
                borderColor: "divider",
                borderRadius: "8px",
                px: 1.5,
                py: 0.6,
              }}
            >
              <AccessTime sx={{ fontSize: 13, color: "text.secondary" }} />
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "text.secondary",
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "0.02em",
                }}
              >
                {now.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* ── Stat cards ── */}
        <Grid container spacing={3} sx={{ mb: 3.5 }}>
          {cards.map((card) => (
            <Grid item xs={12} sm={6} lg={2.4} key={card.title}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  borderTop: `4px solid ${card.color}`,
                  height: "100%",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {card.title}
                </Typography>
                <Typography variant="h3" fontWeight={700} mt={2}>
                  {card.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* ── Users section ── */}
        <Paper elevation={0} sx={{ mt: 2, p: 3, borderRadius: 4 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={2}
            mb={2.5}
          >
            <Typography variant="h6" fontWeight={600}>
              Users
            </Typography>

            <TextField
              size="small"
              placeholder="Search users…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: { xs: "100%", sm: 320 } }}
            />
          </Stack>

          {/* ── Mobile card list ── */}
          {isMobile ? (
            <Stack spacing={2}>
              {filteredUsers.length === 0 ? (
                <Typography align="center" color="text.secondary">
                  No users found
                </Typography>
              ) : (
                filteredUsers.map((user) => (
                  <Card
                    key={user._id}
                    variant="outlined"
                    sx={{ borderRadius: 3 }}
                  >
                    <CardContent sx={{ pb: 1 }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        spacing={1}
                      >
                        <Box>
                          <Typography fontWeight={600}>{user.name}</Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ wordBreak: "break-all" }}
                          >
                            {user.email}
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={0.5} flexShrink={0}>
                          <Chip
                            label={user.role}
                            color={
                              user.role === "admin" ? "success" : "default"
                            }
                            size="small"
                          />
                          <Chip
                            label={user.isVerified ? "Verified" : "Pending"}
                            color={user.isVerified ? "success" : "warning"}
                            size="small"
                          />
                        </Stack>
                      </Stack>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        mt={1}
                        display="block"
                      >
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>

                    <Divider />

                    <CardActions sx={{ justifyContent: "flex-end", px: 2 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleRoleChange(user._id, user.role)}
                      >
                        {user.role === "admin" ? "Demote" : "Promote"}
                      </Button>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(user._id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </CardActions>
                  </Card>
                ))
              )}
            </Stack>
          ) : (
            /* ── Desktop table ── */
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "15%" }}>Name</TableCell>
                    <TableCell sx={{ width: "25%" }}>Email</TableCell>
                    <TableCell sx={{ width: "12%" }}>Role</TableCell>
                    <TableCell sx={{ width: "15%" }}>Verified</TableCell>
                    <TableCell sx={{ width: "15%" }}>Created</TableCell>
                    <TableCell sx={{ width: "18%", textAlign: "center" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          color={user.role === "admin" ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.isVerified ? "Verified" : "Pending"}
                          color={user.isVerified ? "success" : "warning"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() =>
                              handleRoleChange(user._id, user.role)
                            }
                          >
                            {user.role === "admin" ? "Demote" : "Promote"}
                          </Button>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(user._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}

                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* ── Pagination ── */}
        {totalItems > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: "space-between",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1.5,
              mt: { xs: 2, sm: 2.5 },
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textAlign: { xs: "center", sm: "left" } }}
            >
              Showing {(page - 1) * limit + 1}-
              {Math.min(page * limit, totalItems)} of {totalItems}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "center", sm: "flex-end" },
                gap: 1.5,
                flexWrap: "wrap",
              }}
            >
              <FormControl size="small" sx={{ minWidth: 96 }}>
                <Select
                  value={limit}
                  onChange={(e) => {
                    setPage(1);
                    setLimit(Number(e.target.value));
                  }}
                  sx={{
                    borderRadius: "8px",
                    fontSize: "0.8125rem",
                    bgcolor: "background.paper",
                  }}
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <MenuItem key={size} value={size}>
                      {size} / page
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {totalPages > 1 && (
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  size={isMobile ? "small" : "medium"}
                  siblingCount={isMobile ? 0 : 1}
                  boundaryCount={isMobile ? 0 : 1}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      borderRadius: "8px",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                    },
                    "& .Mui-selected": {
                      bgcolor: "text.primary !important",
                      color: "background.default",
                    },
                  }}
                />
              )}
            </Box>
          </Box>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default AdminPage;
