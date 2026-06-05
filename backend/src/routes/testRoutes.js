import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/user", async (req, res) => {
  const user = await User.create({
    name: "Vyom Sutariya",
    email: `test${Date.now()}@gmail.com`,
    password: "123456",
  });

  res.json(user);
});

export default router;
