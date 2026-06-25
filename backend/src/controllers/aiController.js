import { GoogleGenAI } from "@google/genai";
import { markOperational, markFailed } from "../services/aiHealthService.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const parseTasks = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    const prompt = `
You are a task extraction assistant.

Convert the user's text into a JSON array of tasks.

Rules:
- Return ONLY JSON.
- No markdown.
- No explanation.
- Each task must have:

[
  {
    "title": "",
    "description": "",
    "priority": "low",
    "dueDate": "",
    "hasCustomTime": false
  }
]

If no priority is obvious:
use "medium".

Current Date:
${new Date().toISOString()}

User Input:
${text}
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const raw = result.text.trim();

    let tasks;

    try {
      tasks = JSON.parse(raw);

      await markOperational();
    } catch (e) {
      console.error("Invalid Gemini Response:", raw);

      await markFailed("invalid_json");

      return res.status(500).json({
        success: false,
        message: "Gemini returned invalid JSON",
      });
    }

    res.json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("Gemini Parse Error:", error);

    let errorType = error.message || "unknown";

    const msg = error.message?.toLowerCase() || "";

    if (msg.includes("quota")) {
      errorType = "quota_exceeded";
    } else if (msg.includes("429")) {
      errorType = "rate_limit";
    } else if (msg.includes("503")) {
      errorType = "service_unavailable";
    } else if (msg.includes("api key") || msg.includes("unauthorized")) {
      errorType = "invalid_api_key";
    }

    await markFailed(errorType);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
