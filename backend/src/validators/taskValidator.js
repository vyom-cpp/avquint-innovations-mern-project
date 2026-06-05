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

  body("color")
    .optional()
    .isIn([
      "default",
      "gray",
      "brown",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple",
      "pink",
      "red",
    ])
    .withMessage("Invalid color"),
];
