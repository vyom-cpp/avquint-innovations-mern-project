import express from "express";

import { protect } from "../middleware/authMid.js";

import { parseTasks } from "../controllers/aiController.js";

const router = express.Router();

router.post("/parse-tasks", protect, parseTasks);

export default router;
