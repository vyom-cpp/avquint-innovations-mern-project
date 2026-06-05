import { Card, CardContent, Typography, Box } from "@mui/material";

const StatsCard = ({ title, value, icon, accentColor }) => (
  <Card
    sx={{
      height: { xs: 110, sm: 130, md: 150 }, // bigger on desktop
      borderRadius: "10px",
      border: "0.5px solid",
      borderColor: "divider",
      borderTop: `2.5px solid ${accentColor}`,
      boxShadow: "none",
      bgcolor: "background.paper",
      transition: "transform 0.15s ease, box-shadow 0.15s ease",
      "&:hover": {
        transform: "translateY(-1px)",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.06)",
      },
    }}
  >
    <CardContent
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: { xs: "10px 12px !important", sm: "14px 16px !important" },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          variant="caption"
          fontWeight={500}
          sx={{
            color: "text.secondary",
            fontSize: { xs: "0.65rem", sm: "0.75rem" },
            letterSpacing: "0.03em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            width: { xs: 24, sm: 28 },
            height: { xs: 24, sm: 28 },
            borderRadius: "7px",
            backgroundColor: `${accentColor}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: accentColor,
            "& svg": { fontSize: { xs: 13, sm: 16 } },
          }}
        >
          {icon}
        </Box>
      </Box>

      <Typography
        fontWeight={700}
        sx={{
          fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
          letterSpacing: "-0.04em",
          lineHeight: 1,
          color: "text.primary",
        }}
      >
        {value}
      </Typography>
    </CardContent>
  </Card>
);

export default StatsCard;
