import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  Pagination,
} from "@mui/material";
import {
  Search,
  Add,
  Delete,
  CheckCircle,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import CreateTaskDialog from "../components/tasks/CreateTaskDialog";
import { getTasks, toggleStatus, deleteTask } from "../services/taskService";

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

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const priorityMeta = (p) =>
  PRIORITIES.find((x) => x.value === p) ?? PRIORITIES[1];
const colorMeta = (id) =>
  NOTION_COLORS.find((c) => c.id === id) ?? NOTION_COLORS[0];
const fmt = (d, hasCustomTime) => {
  if (!d) return null;
  const dateObj = new Date(d);
  const baseOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  // Only include time if hasCustomTime is true
  if (hasCustomTime) {
    baseOptions.hour = "numeric";
    baseOptions.minute = "2-digit";
  }
  return dateObj.toLocaleString("en-US", baseOptions);
};

const TasksPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [modalOpen, setModal] = useState(false);

  // filter state
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("");
  const [priorityF, setPriorityF] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTasks({
        search,
        status: statusF,
        priority: priorityF,
        sort,
        page,
        limit,
      });
      const nextPages = Math.max(data.pages ?? 1, 1);
      setTasks(data.tasks ?? []);
      setTotal(data.total ?? 0);
      setPages(nextPages);

      if (page > nextPages) {
        setPage(nextPages);
      }
    } finally {
      setLoading(false);
    }
  }, [search, statusF, priorityF, sort, page, limit]);

  useEffect(() => {
    queueMicrotask(load);
  }, [load]);

  const handleToggle = async (id) => {
    await toggleStatus(id);
    load();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    load();
  };

  return (
    <DashboardLayout>
      {/* ── Header ──────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: { xs: 3, md: 3.5 },
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
            Tasks
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {total} task{total !== 1 ? "s" : ""} total
          </Typography>
        </Box>

        <Button
          variant="outlined"
          size="small"
          startIcon={<Add sx={{ fontSize: "15px !important" }} />}
          onClick={() => setModal(true)}
          sx={{
            flexShrink: 0,
            borderRadius: "8px",
            border: "0.5px solid",
            borderColor: "divider",
            color: "text.primary",
            bgcolor: "background.paper",
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.8125rem",
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

      {/* ── Filters ─────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          flexWrap: "wrap",
          alignItems: "center",
          mb: { xs: 3, md: 3.5 },
        }}
      >
        {/* Search */}
        <TextField
          placeholder="Search tasks..."
          size="small"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ fontSize: 16, color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 1,
            minWidth: 160,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              fontSize: "0.875rem",
            },
          }}
        />

        {/* Status filter */}
        <FormControl size="small" sx={{ minWidth: 110 }}>
          <Select
            value={statusF}
            onChange={(e) => {
              setPage(1);
              setStatusF(e.target.value);
            }}
            displayEmpty
            sx={{ borderRadius: "8px", fontSize: "0.8125rem" }}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>

        {/* Priority filter */}
        <FormControl size="small" sx={{ minWidth: 115 }}>
          <Select
            value={priorityF}
            onChange={(e) => {
              setPage(1);
              setPriorityF(e.target.value);
            }}
            displayEmpty
            sx={{ borderRadius: "8px", fontSize: "0.8125rem" }}
          >
            <MenuItem value="">All Priority</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </Select>
        </FormControl>

        {/* Sort */}
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <Select
            value={sort}
            onChange={(e) => {
              setPage(1);
              setSort(e.target.value);
            }}
            sx={{ borderRadius: "8px", fontSize: "0.8125rem" }}
          >
            <MenuItem value="-createdAt">Newest first</MenuItem>
            <MenuItem value="createdAt">Oldest first</MenuItem>
            <MenuItem value="dueDate">Due date</MenuItem>
            <MenuItem value="-priority">Priority</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* ── Task list ───────────────────────────────── */}
      <Box
        sx={{
          bgcolor: "background.paper",
          border: "0.5px solid",
          borderColor: "divider",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress size={24} sx={{ color: "text.secondary" }} />
          </Box>
        ) : tasks.length === 0 ? (
          <Box py={6} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              No tasks found. Create your first task!
            </Typography>
          </Box>
        ) : (
          tasks.map((task, i) => {
            const pm = priorityMeta(task.priority);
            const cm = colorMeta(task.color);
            const done = task.status === "completed";
            return (
              <Box key={task._id}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 1.25, sm: 1.5 },
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 1.25, sm: 1.5 },
                    transition: "background 0.12s",
                    "&:hover": { bgcolor: "action.hover" },
                    "&:hover .delete-btn": { opacity: 1 },
                  }}
                >
                  {/* Toggle button */}
                  <IconButton
                    size="small"
                    onClick={() => handleToggle(task._id)}
                    sx={{
                      flexShrink: 0,
                      p: 0.25,
                      color: done ? "#1D9E75" : "text.secondary",
                    }}
                  >
                    {done ? (
                      <CheckCircle sx={{ fontSize: 18 }} />
                    ) : (
                      <RadioButtonUnchecked sx={{ fontSize: 18 }} />
                    )}
                  </IconButton>

                  {/* Color dot */}
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: cm.bg,
                      border: `1.5px solid ${cm.text}`,
                      flexShrink: 0,
                    }}
                  />

                  {/* Content */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: done ? "text.secondary" : "text.primary",
                        textDecoration: done ? "line-through" : "none",
                        fontWeight: 450,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {task.title}
                    </Typography>
                    {task.description && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {task.description}
                      </Typography>
                    )}
                  </Box>

                  {/* Priority */}
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
                      flexShrink: 0,
                      display: { xs: "none", sm: "flex" },
                    }}
                  />

                  {/* Due date */}
                  {task.dueDate && (
                    <Typography
                      variant="caption"
                      sx={{
                        flexShrink: 0,
                        color:
                          task.isOverdue && !done
                            ? "error.main"
                            : "text.secondary",
                        display: { xs: "none", sm: "block" },
                      }}
                    >
                      {fmt(task.dueDate, task.hasCustomTime)}
                    </Typography>
                  )}

                  {/* Delete */}
                  <IconButton
                    size="small"
                    className="delete-btn"
                    onClick={() => handleDelete(task._id)}
                    sx={{
                      flexShrink: 0,
                      p: 0.25,
                      color: "text.secondary",
                      opacity: { xs: 1, sm: 0 },
                      transition: "opacity 0.15s, color 0.15s",
                      "&:hover": { color: "error.main" },
                    }}
                  >
                    <Delete sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
                {i < tasks.length - 1 && <Divider />}
              </Box>
            );
          })
        )}
      </Box>

      {total > 0 && (
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
            Showing {(page - 1) * limit + 1}-{Math.min(page * limit, total)} of{" "}
            {total}
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

            {pages > 1 && (
              <Pagination
                count={pages}
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

      <CreateTaskDialog
        open={modalOpen}
        onClose={() => setModal(false)}
        onTaskCreated={load}
      />
    </DashboardLayout>
  );
};

export default TasksPage;
