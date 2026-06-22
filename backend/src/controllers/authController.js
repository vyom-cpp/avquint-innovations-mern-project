import redis from "../config/redis.js";
import bcrypt from "bcryptjs";
import { generateOTP, hashOTP } from "../utils/otp.js";
import { sendOTPEmail } from "../utils/mailer.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }

      const otp = generateOTP();

      const hashedOTP = await hashOTP(otp);

      await redis.set(`otp:${email}`, hashedOTP, {
        ex: 600,
      });

      const emailResult = await sendOTPEmail(email, otp);

      if (emailResult.error) {
        return res.status(500).json({
          success: false,
          message: emailResult.error.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Account already exists but is not verified. New OTP sent.",
      });
    }

    await User.create({
      name,
      email,
      password,
      isVerified: false,
    });

    const otp = generateOTP();

    const hashedOTP = await hashOTP(otp);

    await redis.set(`otp:${email}`, hashedOTP, {
      ex: 600,
    });

    await sendOTPEmail(email, otp);

    res.status(201).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const storedHash = await redis.get(`otp:${email}`);

    if (!storedHash) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found",
      });
    }

    const isValid = await bcrypt.compare(otp, storedHash);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.isVerified = true;

    await user.save();

    await redis.del(`otp:${email}`);

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Resend Otp
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    const otp = generateOTP();

    const hashedOTP = await hashOTP(otp);

    await redis.set(`otp:${email}`, hashedOTP, {
      ex: 600,
    });

    await sendOTPEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = generateOTP();

    const hashedOTP = await hashOTP(otp);

    await redis.set(`reset:${email}`, hashedOTP, {
      ex: 600,
    });

    await sendOTPEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "Password reset OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const storedHash = await redis.get(`reset:${email}`);

    if (!storedHash) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found",
      });
    }

    const isValid = await bcrypt.compare(otp, storedHash);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.password = password;

    await user.save();

    await redis.del(`reset:${email}`);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
