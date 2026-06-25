import { Box, Chip } from "@mui/material";
import { memo } from "react";

const ColorSelector = ({ colors, selectedColor, onChange }) => (
  <Box display="flex" flexWrap="wrap" gap={0.75} mb={1}>
    {colors.map((color) => (
      <Chip
        key={color.id}
        label={color.label}
        size="small"
        onClick={() => onChange(color.id)}
        sx={{
          height: 24,
          fontSize: "0.7rem",
          fontWeight: 600,
          bgcolor: color.bg,
          color: color.text,
          border: "1.5px solid",
          borderColor: selectedColor === color.id ? color.text : "transparent",
          cursor: "pointer",
          transition: "border-color 0.12s",
        }}
      />
    ))}
  </Box>
);

export default memo(ColorSelector);
