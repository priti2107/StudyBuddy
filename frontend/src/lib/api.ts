const API_BASE = "http://127.0.0.1:8000";

/* ---------------------------------------------
   AUTH HELPERS
---------------------------------------------- */

export const saveTokens = (access: string, refresh: string) => {
  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

/* ---------------------------------------------
   AUTH APIS
---------------------------------------------- */

export const loginAPI = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE}/api/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Login failed");
  const data = await res.json();

  saveTokens(data.access, data.refresh);
  return data;
};

export const signupAPI = async (payload: any) => {
  const res = await fetch(`${API_BASE}/api/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Signup failed");
  return res.json();
};

/* ---------------------------------------------
   SUBJECT APIs
---------------------------------------------- */

export const fetchSubjects = async () => {
  const res = await fetch(`${API_BASE}/api/subjects/`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch subjects");
  return res.json();
};

export const createSubject = async (data: any) => {
  const res = await fetch(`${API_BASE}/api/subjects/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create subject");
  return res.json();
};

export const deleteSubjectAPI = async (id: number) => {
  const res = await fetch(`${API_BASE}/api/subjects/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to delete subject");
};

/* ---------------------------------------------
   TASK APIs
---------------------------------------------- */

export const fetchTasks = async () => {
  const res = await fetch(`${API_BASE}/api/tasks/`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
};

export const createTaskAPI = async (data: any) => {
  const res = await fetch(`${API_BASE}/api/tasks/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Task create error:", err);
    throw new Error("Failed to create task");
  }

  return res.json();
};

export const updateTaskAPI = async (id: number, data: any) => {
  const res = await fetch(`${API_BASE}/api/tasks/${id}/`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
};

export const deleteTaskAPI = async (id: number) => {
  const res = await fetch(`${API_BASE}/api/tasks/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to delete task");
};

export const updateTaskStatusAPI = async (
  taskId: number,
  status: string
) => {
  const res = await fetch(`${API_BASE}/api/tasks/${taskId}/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
};

/* ---------------------------------------------
   LOGOUT
---------------------------------------------- */

export const logoutAPI = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
