import { body } from "express-validator";

export const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .isLength({
      min: 2,
      max: 50,
    })
    .withMessage("Name must be between 2 and 50 characters"),

  body("email").isEmail().withMessage("Valid email required"),

  body("password")
    .isLength({
      min: 6,
    })
    .withMessage("Password must be at least 6 characters"),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Valid email required"),

  body("password").notEmpty().withMessage("Password required"),
];
