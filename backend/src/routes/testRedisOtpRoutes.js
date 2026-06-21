import express from "express";

import redis from "../config/redis.js";

import { generateOTP, hashOTP, compareOTP } from "../utils/otp.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const email = "test@gmail.com";

    const otp = generateOTP();

    const hashedOTP = await hashOTP(otp);

    await redis.set(`otp:${email}`, hashedOTP, {
      ex: 600,
    });

    const storedOTP = await redis.get(`otp:${email}`);

    const valid = await compareOTP(otp, storedOTP);

    const ttl = await redis.ttl(`otp:${email}`);

    res.json({
      otp,
      valid,
      ttl,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
