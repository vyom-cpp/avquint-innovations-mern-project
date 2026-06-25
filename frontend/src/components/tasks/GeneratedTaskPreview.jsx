import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Typography,
} from "@mui/material";
import { memo } from "react";

const GeneratedTaskPreview = ({
  tasks,
  selectedTasks,
  setSelectedTasks,
  onCreateSelected,
  creating,
  priorityMeta,
  colorMeta,
  formatDueDate,
  formatDueTime,
}) => {
  if (tasks.length === 0) return null;

  const handleToggleTask = (index) => {
    setSelectedTasks((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    );
  };

  const handleSelectAll = () => {
    setSelectedTasks(tasks.map((_, index) => index));
  };

  const handleClearAll = () => {
    setSelectedTasks([]);
  };

  return (
    <Box sx={{ mt: 2, mb: 2.5 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          mb: 1,
        }}
      >
        <Typography
          variant="caption"
          fontWeight={500}
          color="text.secondary"
          sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
        >
          Generated Tasks
        </Typography>
        <Box sx={{ display: "flex", gap: 0.75, flexShrink: 0 }}>
          <Button
            size="small"
            onClick={handleSelectAll}
            sx={{
              minWidth: 0,
              px: 0.75,
              py: 0.25,
              color: "text.secondary",
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Select All
          </Button>
          <Button
            size="small"
            onClick={handleClearAll}
            sx={{
              minWidth: 0,
              px: 0.75,
              py: 0.25,
              color: "text.secondary",
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Clear All
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {tasks.map((task, index) => {
          const selected = selectedTasks.includes(index);
          const priority = priorityMeta(task.priority);
          const color = task.color ? colorMeta(task.color) : null;

          return (
            <Card
              key={`${task.title}-${index}`}
              elevation={0}
              sx={{
                border: "0.5px solid",
                borderColor: "divider",
                borderRadius: "8px",
                bgcolor: "background.paper",
              }}
            >
              <CardContent
                sx={{
                  p: 1.25,
                  "&:last-child": { pb: 1.25 },
                  display: "flex",
                  gap: 1,
                  alignItems: "flex-start",
                }}
              >
                <Checkbox
                  checked={selected}
                  onChange={() => handleToggleTask(index)}
                  size="small"
                  sx={{ p: 0.25, mt: -0.25 }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={500} color="text.primary">
                    {task.title}
                  </Typography>
                  {task.description && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 0.25 }}
                    >
                      {task.description}
                    </Typography>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 0.75,
                      mt: 1,
                    }}
                  >
                    <Chip
                      label={priority.label}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        bgcolor: priority.bg,
                        color: priority.color,
                        border: "none",
                      }}
                    />
                    {task.dueDate && (
                      <Typography variant="caption" color="text.secondary">
                        {formatDueDate(task.dueDate)}
                      </Typography>
                    )}
                    {task.hasCustomTime && task.dueDate && (
                      <Typography variant="caption" color="text.secondary">
                        {formatDueTime(task.dueDate)}
                      </Typography>
                    )}
                    {color && (
                      <Chip
                        label={color.label}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "0.68rem",
                          fontWeight: 600,
                          bgcolor: color.bg,
                          color: color.text,
                          border: "none",
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Button
        onClick={onCreateSelected}
        disabled={selectedTasks.length === 0 || creating}
        fullWidth
        disableElevation
        variant="contained"
        sx={{
          mt: 1.5,
          bgcolor: "text.primary",
          color: "background.default",
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
          "&:hover": { bgcolor: "text.primary", opacity: 0.85 },
          "&.Mui-disabled": {
            bgcolor: "action.disabledBackground",
            color: "text.disabled",
          },
        }}
      >
        {creating ? "Creating..." : "Create Selected Tasks"}
      </Button>
    </Box>
  );
};

export default memo(GeneratedTaskPreview);
