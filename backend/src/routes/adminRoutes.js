import express from "express";

import { protect } from "../middleware/authMid.js";
import adminOnly from "../middleware/adminMiddleware.js";

import {
  getAdminStats,
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAIHealth,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, getAdminStats);

router.get("/users", protect, adminOnly, getAllUsers);

router.delete("/users/:id", protect, adminOnly, deleteUser);

router.patch("/users/:id/role", protect, adminOnly, updateUserRole);

router.get("/ai-health", protect, adminOnly, getAIHealth);

export default router;
