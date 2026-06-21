import express from "express";

import { generateOTP, hashOTP, compareOTP } from "../utils/otp.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const otp = generateOTP();

  const hashedOTP = await hashOTP(otp);

  const valid = await compareOTP(otp, hashedOTP);

  res.json({
    otp,
    hashedOTP,
    valid,
  });
});

export default router;
