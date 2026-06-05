import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    dueDate: {
      type: Date,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// db indexes
taskSchema.index({ userId: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });

taskSchema.index({ title: "text" });
taskSchema.index({
  userId: 1,
  status: 1,
});

taskSchema.index({
  userId: 1,
  createdAt: -1,
});

// virtual
taskSchema.virtual("isOverdue").get(function () {
  if (!this.dueDate || this.status === "completed") {
    return false;
  }

  return new Date() > this.dueDate;
});

// json settings
taskSchema.set("toJSON", {
  virtuals: true,
});

taskSchema.set("toObject", {
  virtuals: true,
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
