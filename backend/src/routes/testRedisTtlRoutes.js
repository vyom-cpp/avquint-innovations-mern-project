import express from "express";
import redis from "../config/redis.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const ttl = await redis.ttl("otp:test@gmail.com");

  res.json({
    ttl,
  });
});

export default router;
