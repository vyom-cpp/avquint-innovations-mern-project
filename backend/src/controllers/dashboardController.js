import Task from "../models/Task.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalTasks = await Task.countDocuments({
      userId,
    });

    const completedTasks = await Task.countDocuments({
      userId,
      status: "completed",
    });

    const pendingTasks = await Task.countDocuments({
      userId,
      status: "pending",
    });

    const recentTasks = await Task.find({
      userId,
    })
      .sort("-createdAt")
      .limit(5);

    const completionPercentage =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    res.status(200).json({
      success: true,

      stats: {
        totalTasks,
        completedTasks,
        pendingTasks,
        completionPercentage,
      },

      recentTasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
