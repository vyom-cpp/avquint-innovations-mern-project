import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  useTheme,
  useMediaQuery,
  Slide,
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
import { forwardRef, useEffect, useState, useCallback } from "react";
import StatsCard from "../components/dashboard/StatsCard";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { getDashboardStats } from "../services/dashboardService";
import { createTask, toggleStatus } from "../services/taskService";

const SlideUp = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

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

const defaultForm = {
  title: "",
  description: "",
  priority: "medium",
  color: "default",
  dueDate: "",
  dueTime: "",
};

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const now = useClock();

  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [modalOpen, setModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    const data = await getDashboardStats();
    setStats(data);
    setRecent(data.recentTasks ?? []);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleCreate = async () => {
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      const payload = { ...form };

      if (form.dueDate) {
        const [yyyy, mm, dd] = form.dueDate.split("-").map(Number);

        if (form.dueTime) {
          const [hours, minutes] = form.dueTime.split(":").map(Number);
          const finalDate = new Date(yyyy, mm - 1, dd, hours, minutes, 0);
          payload.dueDate = finalDate.toISOString();
          payload.hasCustomTime = true;
        } else {
          const finalDate = new Date(yyyy, mm - 1, dd, 23, 59, 0);
          payload.dueDate = finalDate.toISOString();
          payload.hasCustomTime = false;
        }
      }

      delete payload.dueTime;

      await createTask(payload);
      setModal(false);
      setForm(defaultForm);
      refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    await toggleStatus(id);
    refresh();
  };

  const todayStr = (() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  })();

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

      {/* ── Create Task modal ───────────────────────── */}
      <Dialog
        open={modalOpen}
        onClose={() => {
          setModal(false);
          setForm(defaultForm);
        }}
        fullScreen={isMobile}
        TransitionComponent={isMobile ? SlideUp : undefined}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: isMobile ? "20px 20px 0 0" : "12px",
            border: "0.5px solid",
            borderColor: "divider",
            m: 0,
            position: isMobile ? "fixed" : "relative",
            bottom: isMobile ? 0 : "auto",
            left: isMobile ? 0 : "auto",
            right: isMobile ? 0 : "auto",
            width: isMobile ? "100%" : 460,
            maxWidth: "100%",
            maxHeight: isMobile ? "92dvh" : "90vh",
            overflowY: "auto",
          },
        }}
      >
        {isMobile && (
          <Box
            sx={{
              width: 36,
              height: 4,
              borderRadius: 2,
              bgcolor: "divider",
              mx: "auto",
              mt: 1.5,
              mb: 0.5,
            }}
          />
        )}

        <DialogTitle
          sx={{
            fontSize: "1rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            pt: isMobile ? 1 : 2.5,
            pb: 1,
            px: 2.5,
          }}
        >
          Create Task
        </DialogTitle>

        <DialogContent sx={{ px: 2.5, pb: 1, pt: "4px !important" }}>
          <TextField
            label="Title"
            placeholder="Task title..."
            fullWidth
            size="small"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            sx={{ mb: 2, mt: 0.5 }}
          />

          <TextField
            label="Description"
            placeholder="Add a description..."
            fullWidth
            multiline
            rows={2}
            size="small"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            sx={{ mb: 2 }}
          />

          <Typography
            variant="caption"
            fontWeight={500}
            color="text.secondary"
            sx={{
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              display: "block",
              mb: 1,
            }}
          >
            Due Date & Time
          </Typography>

          {/* Date + Time side by side */}
          <Box sx={{ display: "flex", gap: 1.5, mb: 1 }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 0.5, fontSize: "0.72rem" }}
              >
                Date
              </Typography>
              <TextField
                type="date"
                size="small"
                fullWidth
                inputProps={{ min: todayStr }}
                value={form.dueDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dueDate: e.target.value }))
                }
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 0.5, fontSize: "0.72rem" }}
              >
                Time (optional)
              </Typography>
              <TextField
                type="time"
                size="small"
                fullWidth
                inputProps={{ step: 300 }}
                value={form.dueTime}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dueTime: e.target.value }))
                }
                disabled={!form.dueDate}
                sx={{
                  "& input[type='time']::-webkit-calendar-picker-indicator": {
                    opacity: 0.5,
                    cursor: "pointer",
                  },
                }}
              />
            </Box>
          </Box>

          {/* Helper text below the row */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 2.5 }}
          >
            {!form.dueDate
              ? "Pick a date first to enable the time field"
              : form.dueTime
                ? `Reminder at ${form.dueTime}`
                : "No time set — defaults to 11:59 PM"}
          </Typography>

          <Typography
            variant="caption"
            fontWeight={500}
            color="text.secondary"
            sx={{
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              display: "block",
              mb: 1,
            }}
          >
            Priority
          </Typography>
          <ToggleButtonGroup
            exclusive
            value={form.priority}
            onChange={(_, v) => v && setForm((f) => ({ ...f, priority: v }))}
            sx={{ mb: 2.5, display: "flex", gap: 1 }}
          >
            {PRIORITIES.map((p) => (
              <ToggleButton
                key={p.value}
                value={p.value}
                sx={{
                  flex: 1,
                  py: 0.75,
                  borderRadius: "8px !important",
                  border: "0.5px solid !important",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "none",
                  letterSpacing: 0,
                  bgcolor: p.bg,
                  color: p.color,
                  borderColor: `${p.color}55 !important`,
                  "&.Mui-selected, &.Mui-selected:hover": {
                    bgcolor: p.bg,
                    color: p.color,
                    boxShadow: `inset 0 0 0 1.5px ${p.color}`,
                  },
                  "&:hover": { bgcolor: p.bg, opacity: 0.8 },
                }}
              >
                {p.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Typography
            variant="caption"
            fontWeight={500}
            color="text.secondary"
            sx={{
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              display: "block",
              mb: 1,
            }}
          >
            Color Tag
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={0.75} mb={1}>
            {NOTION_COLORS.map((c) => (
              <Chip
                key={c.id}
                label={c.label}
                size="small"
                onClick={() => setForm((f) => ({ ...f, color: c.id }))}
                sx={{
                  height: 24,
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  bgcolor: c.bg,
                  color: c.text,
                  border: "1.5px solid",
                  borderColor: form.color === c.id ? c.text : "transparent",
                  cursor: "pointer",
                  transition: "border-color 0.12s",
                  "&:hover": { opacity: 0.8 },
                }}
              />
            ))}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 2.5, pb: isMobile ? 3 : 2.5, pt: 1, gap: 1 }}>
          <Button
            onClick={() => {
              setModal(false);
              setForm(defaultForm);
            }}
            fullWidth
            sx={{
              border: "0.5px solid",
              borderColor: "divider",
              borderRadius: "8px",
              color: "text.secondary",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!form.title.trim() || loading}
            fullWidth
            disableElevation
            variant="contained"
            sx={{
              bgcolor: "text.primary",
              color: "background.default",
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              "&:hover": { bgcolor: "text.primary", opacity: 0.85 },
              "&.Mui-disabled": {
                bgcolor: "action.disabledBackground",
                color: "text.disabled",
              },
            }}
          >
            {loading ? "Creating..." : "Create Task"}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default DashboardPage;
