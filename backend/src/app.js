import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { notFound, errorHandler } from "./middleware/errorMid.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
// import testRoutes from "./routes/testRoutes.js";

const app = express();
// app.use("/api/test", testRoutes);

// security middleware
app.use(helmet());

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true,
//   }),
// );
// console.log("CLIENT_URL =", process.env.CLIENT_URL);

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests. Please try again later.",
});

app.use(limiter);

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// logger
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// health route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TaskFlow Backend API Running Successfully",
  });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

// error middleware
app.use(notFound);
app.use(errorHandler);

export default app;
