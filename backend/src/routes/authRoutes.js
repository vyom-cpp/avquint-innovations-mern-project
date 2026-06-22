import express from "express";

import {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  getProfile,
} from "../controllers/authController.js";

import {
  registerValidation,
  loginValidation,
} from "../validators/authValidator.js";

import { validate } from "../middleware/validationMiddleware.js";

import { protect } from "../middleware/authMid.js";

const router = express.Router();

router.post("/register", registerValidation, validate, registerUser);

router.post("/verify-otp", verifyOTP);

router.post("/resend-otp", resendOTP);

router.post("/login", loginValidation, validate, loginUser);

router.get("/profile", protect, getProfile);

export default router;
