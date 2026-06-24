import mongoose from "mongoose";

const aiServiceStatusSchema = new mongoose.Schema(
  {
    service: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["operational", "failed"],
      required: true,
    },

    error: {
      type: String,
      default: "",
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("AIServiceStatus", aiServiceStatusSchema);
