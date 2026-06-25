import {
  Box,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { memo } from "react";
import ColorSelector from "./ColorSelector";

const ManualTaskForm = ({
  form,
  setForm,
  priorities,
  colors,
  pickerTextFieldSx,
}) => (
  <>
    <TextField
      label="Title"
      placeholder="Task title..."
      fullWidth
      size="small"
      value={form.title}
      onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
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
        setForm((current) => ({ ...current, description: e.target.value }))
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
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2.5 }}>
      <DatePicker
        label="Due Date"
        value={form.dueDate ? dayjs(form.dueDate) : null}
        minDate={dayjs()}
        onChange={(value) =>
          setForm((current) => ({
            ...current,
            dueDate: value ? value.format("YYYY-MM-DD") : "",
          }))
        }
        slotProps={{
          textField: {
            fullWidth: true,
            size: "small",
            sx: pickerTextFieldSx,
          },
        }}
      />
      <TimePicker
        label="Due Time (Optional)"
        value={form.dueTime ? dayjs(`2000-01-01 ${form.dueTime}`) : null}
        onChange={(value) =>
          setForm((current) => ({
            ...current,
            dueTime: value ? value.format("HH:mm") : "",
          }))
        }
        slotProps={{
          textField: {
            fullWidth: true,
            size: "small",
            sx: pickerTextFieldSx,
            helperText: form.dueTime
              ? "Reminder will be sent 1 hour before."
              : "Leave empty to default to end of day (11:59 PM)",
          },
        }}
      />
    </Box>

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
      onChange={(_, value) =>
        value && setForm((current) => ({ ...current, priority: value }))
      }
      sx={{ mb: 2.5, display: "flex", gap: 1 }}
    >
      {priorities.map((priority) => (
        <ToggleButton
          key={priority.value}
          value={priority.value}
          sx={{
            flex: 1,
            py: 0.75,
            borderRadius: "8px !important",
            border: "0.5px solid !important",
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "none",
            bgcolor: priority.bg,
            color: priority.color,
            borderColor: `${priority.color}55 !important`,
            "&.Mui-selected, &.Mui-selected:hover": {
              bgcolor: priority.bg,
              color: priority.color,
              boxShadow: `inset 0 0 0 1.5px ${priority.color}`,
            },
            "&:hover": { bgcolor: priority.bg, opacity: 0.8 },
          }}
        >
          {priority.label}
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
    <ColorSelector
      colors={colors}
  selectedColor={form.color}
  onChange={(color) => setForm((current) => ({ ...current, color }))}
    />
  </>
);

export default memo(ManualTaskForm);
