import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
// import testOtpRoutes from "./routes/testOtpRoutes.js";
import testRedisOtpRoutes from "./routes/testRedisOtpRoutes.js";

import testRedisTtlRoutes from "./routes/testRedisTtlRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMid.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();

// security middleware
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
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

// testing otp
// app.use("/api/test-otp", testOtpRoutes);
app.use("/api/test-redis-otp", testRedisOtpRoutes);
app.use("/api/test-ttl", testRedisTtlRoutes);

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
