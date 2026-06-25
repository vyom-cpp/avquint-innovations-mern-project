import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { parseTasksWithAI } from "../../services/aiService";
import { createTask } from "../../services/taskService";
import AITaskGenerator from "./AITaskGenerator";
import GeneratedTaskPreview from "./GeneratedTaskPreview";
import ManualTaskForm from "./ManualTaskForm";

const SlideUp = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

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

const isValidPriority = (priority) =>
  PRIORITIES.some((item) => item.value === priority);

const isValidColor = (color) => NOTION_COLORS.some((item) => item.id === color);

const priorityMeta = (priority) =>
  PRIORITIES.find((item) => item.value === priority) ?? PRIORITIES[1];

const colorMeta = (id) =>
  NOTION_COLORS.find((item) => item.id === id) ?? NOTION_COLORS[0];

const formatDueDate = (date) => {
  if (!date) return null;

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDueTime = (date) => {
  if (!date) return null;

  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const buildGeneratedDueDate = (dueDate, dueTime) => {
  if (!dueDate) return "";

  const date = new Date(dueDate);
  if (Number.isNaN(date.getTime())) return "";

  if (dueTime) {
    const [hours, minutes] = dueTime.split(":");
    const parsedHours = Number(hours);
    const parsedMinutes = Number(minutes);

    if (Number.isNaN(parsedHours) || Number.isNaN(parsedMinutes)) {
      return date.toISOString();
    }

    date.setHours(parsedHours);
    date.setMinutes(parsedMinutes);
    date.setSeconds(0);
  }

  return date.toISOString();
};

const normalizeGeneratedTask = (task) => {
  const dueDate = buildGeneratedDueDate(task.dueDate, task.dueTime);
  const hasCustomTime = Boolean(task.hasCustomTime || task.dueTime);

  return {
    title: String(task.title ?? "").trim(),
    description: String(task.description ?? "").trim(),
    priority: isValidPriority(task.priority) ? task.priority : "medium",
    ...(dueDate ? { dueDate, hasCustomTime } : {}),
    ...(isValidColor(task.color) ? { color: task.color } : {}),
  };
};

const getSpeechRecognition = () =>
  typeof window !== "undefined" &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);

const CreateTaskDialog = ({ open, onClose, onTaskCreated }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const recognitionRef = useRef(null);

  const [form, setForm] = useState(defaultForm);
  const [creating, setCreating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedTasks, setGeneratedTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [aiError, setAiError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechSupported] = useState(Boolean(getSpeechRecognition()));

  const inputBg = theme.palette.mode === "dark" ? "#191919" : "#FFFFFF";
  const pickerTextFieldSx = useMemo(
    () => ({
      "& .MuiPickersInputBase-root, & .MuiPickersOutlinedInput-root, & .MuiOutlinedInput-root, & .MuiInputBase-root":
        {
          bgcolor: inputBg,
        },
      "& .MuiPickersSectionList-root": {
        bgcolor: inputBg,
      },
      "& .MuiFormLabel-root": {
        bgcolor: inputBg,
        px: 0.5,
      },
    }),
    [inputBg],
  );

  const stopListening = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {
      // Recognition may already be inactive.
    }
  }, []);

  useEffect(() => {
    const SpeechRecognition = getSpeechRecognition();

    if (!SpeechRecognition) {
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript)
        .filter(Boolean)
        .join(" ")
        .trim();

      if (!transcript) return;

      setAiPrompt((current) =>
        [current.trim(), transcript].filter(Boolean).join("\n"),
      );
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        toast.error("Microphone permission denied");
      } else if (event.error === "network") {
        toast.error("Speech recognition network error");
      } else if (event.error !== "no-speech" && event.error !== "aborted") {
        toast.error("Speech recognition failed");
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      try {
        recognition.stop();
      } catch {
        // Recognition may already be inactive during unmount.
      }
      recognitionRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!open) {
      stopListening();
    }
  }, [open, stopListening]);

  const resetForm = () => {
    setForm(defaultForm);
  };

  const resetAiState = () => {
    setAiPrompt("");
    setGenerating(false);
    setGeneratedTasks([]);
    setSelectedTasks([]);
    setAiError("");
  };

  const resetDialogState = () => {
    resetForm();
    resetAiState();
    stopListening();
  };

  const handleClose = () => {
    onClose();
    resetDialogState();
  };

  const handleToggleListening = () => {
    const recognition = recognitionRef.current;

    if (!speechSupported || !recognition) {
      toast.error("Speech Recognition not supported by this browser.");
      return;
    }

    if (isListening) {
      recognition.stop();
      return;
    }

    try {
      recognition.start();
      setIsListening(true);
    } catch (error) {
      console.error(error);
      setIsListening(false);
      toast.error("Unable to start voice recording");
    }
  };

  const handleGenerateTasks = async () => {
    if (!aiPrompt.trim()) return;

    setGenerating(true);
    setAiError("");

    try {
      const data = await parseTasksWithAI(aiPrompt);
      if (!data?.success) {
        throw new Error(data?.message || "Failed to generate tasks");
      }

      const tasks = Array.isArray(data?.tasks)
        ? data.tasks
            .map(normalizeGeneratedTask)
            .filter((task) => task.title.trim())
        : [];

      setGeneratedTasks(tasks);
      setSelectedTasks(tasks.map((_, index) => index));
    } catch (error) {
      console.error(error);
      setGeneratedTasks([]);
      setSelectedTasks([]);
      setAiError("Gemini is currently unavailable.\nPlease try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCreateSelectedTasks = async () => {
    const tasksToCreate = generatedTasks.filter((_, index) =>
      selectedTasks.includes(index),
    );

    if (tasksToCreate.length === 0) return;

    setCreating(true);

    try {
      for (const task of tasksToCreate) {
        await createTask(task);
      }

      onClose();
      resetDialogState();
      onTaskCreated();
      toast.success("Tasks created successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to create selected tasks");
    } finally {
      setCreating(false);
    }
  };

  const handleCreate = async () => {
    if (!form.title.trim()) return;

    setCreating(true);

    try {
      const payload = {
        ...form,
      };

      if (form.dueDate) {
        const finalDate = new Date(form.dueDate);

        if (form.dueTime) {
          const [hours, minutes] = form.dueTime.split(":");

          finalDate.setHours(Number(hours));
          finalDate.setMinutes(Number(minutes));
          finalDate.setSeconds(0);

          payload.hasCustomTime = true;
        } else {
          finalDate.setHours(23);
          finalDate.setMinutes(59);
          finalDate.setSeconds(0);

          payload.hasCustomTime = false;
        }

        payload.dueDate = finalDate.toISOString();
      }

      await createTask(payload);

      onClose();
      resetDialogState();
      onTaskCreated();
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        <AITaskGenerator
          prompt={aiPrompt}
          setPrompt={setAiPrompt}
          loading={generating}
          error={aiError}
          onGenerate={handleGenerateTasks}
          isListening={isListening}
          speechSupported={speechSupported}
          onToggleListening={handleToggleListening}
        />
        <GeneratedTaskPreview
          tasks={generatedTasks}
          selectedTasks={selectedTasks}
          setSelectedTasks={setSelectedTasks}
          onCreateSelected={handleCreateSelectedTasks}
          creating={creating}
          priorityMeta={priorityMeta}
          colorMeta={colorMeta}
          formatDueDate={formatDueDate}
          formatDueTime={formatDueTime}
        />
        <ManualTaskForm
          form={form}
          setForm={setForm}
          creating={creating}
          onCreate={handleCreate}
          priorities={PRIORITIES}
          colors={NOTION_COLORS}
          pickerTextFieldSx={pickerTextFieldSx}
        />
      </DialogContent>
      <DialogActions sx={{ px: 2.5, pb: isMobile ? 3 : 2.5, pt: 1, gap: 1 }}>
        <Button
          onClick={handleClose}
          fullWidth
          sx={{
            border: "0.5px solid",
            borderColor: "divider",
            borderRadius: "8px",
            color: "text.secondary",
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          disabled={!form.title.trim() || creating}
          fullWidth
          disableElevation
          variant="contained"
          sx={{
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
          {creating ? "Creating..." : "Create Task"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTaskDialog;
