const API_BASE = import.meta.env.VITE_API_URL || "/api";
const BASE = `${API_BASE}/tasks`;

const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const taskPayload = (taskData) => {
  const payload = {
    ...taskData,
    title: taskData.title?.trim(),
    description: taskData.description?.trim(),
  };

  if (!payload.dueDate) {
    delete payload.dueDate;
  }

  return payload;
};

export const createTask = async (taskData) => {
  const res = await fetch(BASE, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(taskPayload(taskData)),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create task");
  }
  return res.json();
};

export const getTasks = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);
  if (params.priority) query.set("priority", params.priority);
  if (params.sort) query.set("sort", params.sort);
  if (params.page) query.set("page", params.page);
  if (params.limit) query.set("limit", params.limit);

  const res = await fetch(`${BASE}?${query}`, { headers: authHeader() });
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
};

export const toggleStatus = async (id) => {
  const res = await fetch(`${BASE}/${id}/status`, {
    method: "PATCH",
    headers: authHeader(),
  });
  if (!res.ok) throw new Error("Failed to toggle status");
  return res.json();
};

export const deleteTask = async (id) => {
  const res = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  if (!res.ok) throw new Error("Failed to delete task");
  return res.json();
};

export const updateTask = async (id, data) => {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify(taskPayload(data)),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
};
