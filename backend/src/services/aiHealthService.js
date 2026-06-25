import AIServiceStatus from "../models/AIServiceStatus.js";

/**
 * Save a failure only if the previous state wasn't already "failed"
 */
export const markFailed = async (error = "unknown") => {
  const latest = await AIServiceStatus.findOne({
    service: "gemini",
  }).sort({ createdAt: -1 });

  // Already in failed state → don't create duplicate log
  if (latest && latest.status === "failed") {
    return latest;
  }

  return AIServiceStatus.create({
    service: "gemini",
    status: "failed",
    error,
  });
};

/**
 * Save recovery only if the previous state was failed
 */
export const markOperational = async () => {
  const latest = await AIServiceStatus.findOne({
    service: "gemini",
  }).sort({ createdAt: -1 });

  // Already operational → don't create duplicate log
  if (latest && latest.status === "operational") {
    return latest;
  }

  return AIServiceStatus.create({
    service: "gemini",
    status: "operational",
  });
};

/**
 * Returns current AI health
 */
export const getCurrentAIStatus = async () => {
  return AIServiceStatus.findOne({
    service: "gemini",
  }).sort({ createdAt: -1 });
};
