import cron from "node-cron";

import Task from "../models/Task.js";
import User from "../models/User.js";

import { sendTaskReminderEmail } from "../utils/mailer.js";

cron.schedule("0 * * * *", async () => {
  try {
    console.log("Running task reminder job...");

    const now = new Date();

    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const tasks = await Task.find({
      status: "pending",

      reminderSent: false,

      dueDate: {
        $gte: now,
        $lte: next24Hours,
      },
    });

    for (const task of tasks) {
      const user = await User.findById(task.userId);

      if (!user) continue;

      await sendTaskReminderEmail(user.email, task);

      task.reminderSent = true;

      await task.save();
    }

    console.log(`Reminder emails sent: ${tasks.length}`);
  } catch (error) {
    console.error("Reminder job error:", error);
  }
});
