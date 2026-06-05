import { body } from "express-validator";

export const taskValidation = [
  body("title").trim().notEmpty().withMessage("Task title required").isLength({
    max: 100,
  }),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority"),

  body("status")
    .optional()
    .isIn(["pending", "completed"])
    .withMessage("Invalid status"),
];
