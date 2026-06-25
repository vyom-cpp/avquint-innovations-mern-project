import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Mic, MicOff } from "@mui/icons-material";
import { memo } from "react";

const AITaskGenerator = ({
  prompt,
  setPrompt,
  loading,
  error,
  onGenerate,
  isListening,
  speechSupported,
  onToggleListening,
}) => (
  <Box sx={{ mb: 2.5, mt: 0.5 }}>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        mb: 0.5,
      }}
    >
      <Typography variant="body2" fontWeight={700} color="text.primary">
        ✨ AI Assistant
      </Typography>
      <Tooltip
        title={
          speechSupported
            ? isListening
              ? "Listening..."
              : "Start voice input"
            : "Speech Recognition not supported by this browser."
        }
      >
        <span>
          <IconButton
            onClick={onToggleListening}
            disabled={!speechSupported}
            aria-label={isListening ? "Stop Recording" : "Start Recording"}
            sx={{
              width: 40,
              height: 40,
              border: "0.5px solid",
              borderColor: "divider",
              borderRadius: "8px",
              bgcolor: "text.primary",
              color: isListening ? "error.main" : "background.default",
              animation: isListening
                ? "micPulse 1.2s ease-in-out infinite"
                : "none",
              "@keyframes micPulse": {
                "0%": { transform: "scale(1)", opacity: 1 },
                "50%": { transform: "scale(1.04)", opacity: 0.78 },
                "100%": { transform: "scale(1)", opacity: 1 },
              },
              "&:hover": { bgcolor: "text.primary", opacity: 0.85 },
              "&.Mui-disabled": {
                bgcolor: "action.disabledBackground",
                color: "text.disabled",
              },
            }}
          >
            {isListening ? (
              <MicOff sx={{ fontSize: 18 }} />
            ) : (
              <Mic sx={{ fontSize: 18 }} />
            )}
          </IconButton>
        </span>
      </Tooltip>
    </Box>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
      Describe your tasks naturally.
    </Typography>
    <TextField
      placeholder={
        "Example:\nBuy milk tomorrow.\nCall mom today at 7 PM.\nFinish assignment by Friday."
      }
      fullWidth
      multiline
      minRows={3}
      size="small"
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      sx={{ mb: 1.5 }}
    />
    <Button
      onClick={onGenerate}
      disabled={!prompt.trim() || loading}
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
      {loading ? (
        <>
          <CircularProgress
            size={16}
            sx={{ color: "inherit", mr: 1 }}
            thickness={5}
          />
          Generating...
        </>
      ) : (
        "✨ Generate Tasks"
      )}
    </Button>

    {error && (
      <Alert severity="error" sx={{ mt: 1.5, whiteSpace: "pre-line" }}>
        {error}
      </Alert>
    )}
  </Box>
);

export default memo(AITaskGenerator);
