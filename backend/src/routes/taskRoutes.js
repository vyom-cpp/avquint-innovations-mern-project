import express from "express";

import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} from "../controllers/taskController.js";

import { taskValidation } from "../validators/taskValidator.js";

import { validate } from "../middleware/validationMiddleware.js";

import { protect } from "../middleware/authMid.js";

const router = express.Router();

router.use(protect);

router.route("/").post(taskValidation, validate, createTask).get(getTasks);

router.route("/:id").get(getTaskById).put(updateTask).delete(deleteTask);

router.patch("/:id/status", toggleTaskStatus);

export default router;
