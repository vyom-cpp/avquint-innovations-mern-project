import User from "../models/User.js";
import Task from "../models/Task.js";
import AIServiceStatus from "../models/AIServiceStatus.js";

// GET /api/admin/stats
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const verifiedUsers = await User.countDocuments({
      isVerified: true,
    });

    const totalTasks = await Task.countDocuments();

    const completedTasks = await Task.countDocuments({
      status: "completed",
    });

    const pendingTasks = await Task.countDocuments({
      status: "pending",
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        verifiedUsers,
        totalTasks,
        completedTasks,
        pendingTasks,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await Task.deleteMany({
      user: user._id,
    });

    await User.findByIdAndDelete(user._id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Role updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Checking AI Health
export const getAIHealth = async (req, res) => {
  try {
    const lastSuccess = await AIServiceStatus.findOne({
      service: "gemini",
      status: "operational",
    }).sort({ createdAt: -1 });

    const lastFailure = await AIServiceStatus.findOne({
      service: "gemini",
      status: "failed",
    }).sort({ createdAt: -1 });

    let status = "unknown";

    if (lastSuccess && !lastFailure) {
      status = "operational";
    } else if (!lastSuccess && lastFailure) {
      status = "down";
    } else if (lastSuccess && lastFailure) {
      status =
        lastSuccess.createdAt > lastFailure.createdAt ? "operational" : "down";
    }

    res.status(200).json({
      success: true,
      service: "gemini",
      status,
      lastSuccess,
      lastFailure,
      failureReason: lastFailure?.error || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
