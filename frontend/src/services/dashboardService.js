// import axiosInstance from "../api/axiosInstance";

// export const getDashboardStats = async () => {
//   const response = await axiosInstance.get("/dashboard/stats");

//   return response.data;
// };

const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export const getDashboardStats = async () => {
  const res = await fetch(`${API_BASE}/dashboard/stats`, {
    headers: authHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
};
