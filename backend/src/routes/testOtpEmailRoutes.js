import express from "express";

import { sendOTPEmail } from "../utils/mailer.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    await sendOTPEmail("vyom.sutariya0948@gmail.com", "123456");

    res.json({
      success: true,
      message: "OTP email sent",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
