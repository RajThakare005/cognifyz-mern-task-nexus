const API_BASE = "http://localhost:5000/api";

export const apiRequest = async (path, { method = "GET", token, body } = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const authRequest = (mode, payload) =>
  apiRequest(mode === "register" ? "/auth/register" : "/auth/login", {
    method: "POST",
    body: payload,
  });

export const getTasks = (token) => apiRequest("/tasks", { token });
export const addTask = (token, task) =>
  apiRequest("/tasks", {
    method: "POST",
    token,
    body: { ...task, dueDate: task.dueDate || null },
  });
export const removeTask = (token, id) => apiRequest(`/tasks/${id}`, { method: "DELETE", token });
export const changeTaskStatus = (token, id, status) =>
  apiRequest(`/tasks/${id}`, { method: "PUT", token, body: { status } });
export const updateTask = (token, id, updates) =>
  apiRequest(`/tasks/${id}`, { method: "PUT", token, body: updates });

export const getExternalJoke = () => apiRequest("/external/joke");
