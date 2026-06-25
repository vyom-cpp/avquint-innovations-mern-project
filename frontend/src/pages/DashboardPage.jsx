import {
  Box,
  Typography,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import {
  Add,
  Assignment,
  CheckCircle,
  Pending,
  TrendingUp,
  AccessTime,
  FiberManualRecord,
} from "@mui/icons-material";
import { useEffect, useState, useCallback } from "react";
import StatsCard from "../components/dashboard/StatsCard";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import CreateTaskDialog from "../components/tasks/CreateTaskDialog";
import { getDashboardStats } from "../services/dashboardService";
import { toggleStatus } from "../services/taskService";

// ── constants ────────────────────────────────────────────
const CARD_COLORS = {
  total: "#378ADD",
  completed: "#1D9E75",
  pending: "#EF9F27",
  completion: "#7F77DD",
};

const NOTION_COLORS = [
  { id: "default", bg: "#F1F1EF", text: "#787774", label: "Gray" },
  { id: "brown", bg: "#F3EEEE", text: "#976D57", label: "Brown" },
  { id: "orange", bg: "#F8ECDF", text: "#CC782F", label: "Orange" },
  { id: "yellow", bg: "#FAF3DD", text: "#C29343", label: "Yellow" },
  { id: "green", bg: "#EEF3ED", text: "#548164", label: "Green" },
  { id: "blue", bg: "#E9F3F7", text: "#487CA5", label: "Blue" },
  { id: "purple", bg: "#F6F3F8", text: "#8A67AB", label: "Purple" },
  { id: "pink", bg: "#F9F2F5", text: "#B35488", label: "Pink" },
  { id: "red", bg: "#FAECEC", text: "#C4554D", label: "Red" },
];

const PRIORITIES = [
  { value: "high", label: "High", bg: "#FAECEC", color: "#C4554D" },
  { value: "medium", label: "Medium", bg: "#FAF3DD", color: "#C29343" },
  { value: "low", label: "Low", bg: "#EEF3ED", color: "#548164" },
];

// ── clock hook ───────────────────────────────────────────
const useClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
};

// ── helpers ──────────────────────────────────────────────
const fmt = (d) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

const priorityMeta = (p) =>
  PRIORITIES.find((x) => x.value === p) ?? PRIORITIES[1];

const colorMeta = (id) =>
  NOTION_COLORS.find((c) => c.id === id) ?? NOTION_COLORS[0];

// ── component ────────────────────────────────────────────
const DashboardPage = () => {
  const now = useClock();

  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [modalOpen, setModal] = useState(false);

  const refresh = useCallback(async () => {
    const data = await getDashboardStats();
    setStats(data);
    setRecent(data.recentTasks ?? []);
  }, []);

  useEffect(() => {
    queueMicrotask(refresh);
  }, [refresh]);

  const handleToggle = async (id) => {
    await toggleStatus(id);
    refresh();
  };

  return (
    <DashboardLayout>
      {/* ── Header ─────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: { xs: 2.5, md: 3 },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
            letterSpacing="-0.03em"
            color="text.primary"
            lineHeight={1.2}
          >
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Here's what's happening with your tasks today.
          </Typography>
        </Box>

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

          {/* Create Task */}
          <Button
            variant="outlined"
            size="small"
            startIcon={<Add sx={{ fontSize: "15px !important" }} />}
            onClick={() => setModal(true)}
            sx={{
              borderRadius: "8px",
              border: "0.5px solid",
              borderColor: "divider",
              color: "text.primary",
              bgcolor: "background.paper",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.8125rem",
              letterSpacing: "-0.01em",
              px: 1.5,
              py: 0.6,
              whiteSpace: "nowrap",
              "&:hover": {
                bgcolor: "action.hover",
                borderColor: "text.secondary",
              },
            }}
          >
            Create Task
          </Button>
        </Box>
      </Box>

      {/* ── Stat cards — strict 2×2 on mobile ──────── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
          },
          gap: { xs: 1.5, sm: 2, md: 2.5 },
          mb: { xs: 3, md: 5 },
        }}
      >
        {[
          {
            title: "Total Tasks",
            value: stats?.stats?.totalTasks ?? 0,
            icon: <Assignment />,
            color: CARD_COLORS.total,
          },
          {
            title: "Completed",
            value: stats?.stats?.completedTasks ?? 0,
            icon: <CheckCircle />,
            color: CARD_COLORS.completed,
          },
          {
            title: "Pending",
            value: stats?.stats?.pendingTasks ?? 0,
            icon: <Pending />,
            color: CARD_COLORS.pending,
          },
          {
            title: "Completion %",
            value: `${stats?.stats?.completionPercentage ?? 0}%`,
            icon: <TrendingUp />,
            color: CARD_COLORS.completion,
          },
        ].map((card) => (
          <StatsCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            accentColor={card.color}
          />
        ))}
      </Box>

      {/* ── Recent tasks from backend ───────────────── */}
      {recent.length > 0 && (
        <Box
          sx={{
            bgcolor: "background.paper",
            border: "0.5px solid",
            borderColor: "divider",
            borderRadius: "10px",
            p: { xs: 2, sm: 2.5 },
            mt: { xs: 0, md: 0.5 },
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1.5}
          >
            <Typography variant="body2" fontWeight={600} color="text.primary">
              Recent Tasks
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              component="a"
              href="/tasks"
              sx={{
                textDecoration: "none",
                "&:hover": { color: "text.primary" },
              }}
            >
              View all →
            </Typography>
          </Box>

          {recent.map((task, i) => {
            const pm = priorityMeta(task.priority);
            const cm = colorMeta(task.color);
            return (
              <Box key={task._id}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    py: 1.25,
                    px: 1,
                    mx: -1,
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "background 0.12s",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                  onClick={() => handleToggle(task._id)}
                >
                  {/* Status dot */}
                  <FiberManualRecord
                    sx={{
                      fontSize: 10,
                      color:
                        task.status === "completed"
                          ? CARD_COLORS.completed
                          : CARD_COLORS.pending,
                      flexShrink: 0,
                    }}
                  />

                  {/* Title */}
                  <Typography
                    variant="body2"
                    sx={{
                      flex: 1,
                      color:
                        task.status === "completed"
                          ? "text.secondary"
                          : "text.primary",
                      textDecoration:
                        task.status === "completed" ? "line-through" : "none",
                      fontWeight: 450,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {task.title}
                  </Typography>

                  {/* Color tag */}
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: cm.bg,
                      border: `1.5px solid ${cm.text}`,
                      flexShrink: 0,
                      display: { xs: "none", sm: "block" },
                    }}
                  />

                  {/* Priority chip */}
                  <Chip
                    label={pm.label}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.68rem",
                      fontWeight: 600,
                      bgcolor: pm.bg,
                      color: pm.color,
                      border: "none",
                      display: { xs: "none", sm: "flex" },
                    }}
                  />

                  {/* Due date */}
                  {task.dueDate && (
                    <Typography
                      variant="caption"
                      color={task.isOverdue ? "error.main" : "text.secondary"}
                      sx={{
                        flexShrink: 0,
                        display: { xs: "none", sm: "block" },
                      }}
                    >
                      {fmt(task.dueDate)}
                    </Typography>
                  )}
                </Box>
                {i < recent.length - 1 && <Divider />}
              </Box>
            );
          })}
        </Box>
      )}

      <CreateTaskDialog
        open={modalOpen}
        onClose={() => setModal(false)}
        onTaskCreated={refresh}
      />
    </DashboardLayout>
  );
};

export default DashboardPage;
