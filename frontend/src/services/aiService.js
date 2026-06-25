const API_BASE = import.meta.env.VITE_API_URL || "/api";
const AI_BASE = `${API_BASE}/ai`;

const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const parseTasksWithAI = async (text) => {
  const res = await fetch(`${AI_BASE}/parse-tasks`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to parse tasks");
  }

  return res.json();
};
