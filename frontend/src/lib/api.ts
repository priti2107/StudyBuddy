const API_BASE = "http://127.0.0.1:8000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// ✅ SUBJECT APIs
export const fetchSubjects = async () => {
  const res = await fetch(`${API_BASE}/api/subjects/`, {
    headers: getAuthHeaders(),
  });
  return res.json();
};

export const createSubject = async (data: any) => {
  const res = await fetch(`${API_BASE}/api/subjects/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteSubjectAPI = async (id: number) => {
  await fetch(`${API_BASE}/api/subjects/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
};
