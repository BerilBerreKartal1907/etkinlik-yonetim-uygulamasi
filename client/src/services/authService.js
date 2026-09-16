import api from "./api";

export async function registerUser(data) {
  const response = await api.post("/Auth/register", data);
  return response.data;
}

export async function loginUser(data) {
  const response = await api.post("/Auth/login", data);
  return response.data;
}

export async function updateProfile(data) {
  const response = await api.put("/Auth/profile", data);
  return response.data;
}

export async function getProfile(userId) {
  const response = await api.get(`/Auth/profile/${userId}`);
  return response.data;
}