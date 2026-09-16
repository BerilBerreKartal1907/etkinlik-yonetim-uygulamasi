import api from "./api";

export async function getPublicEvents() {
  const response = await api.get("/Event");
  return response.data;
}

export async function getEventDetail(id) {
  const response = await api.get(`/Event/${id}`);
  return response.data;
}

export async function getManagementEvents() {
  const response = await api.get("/Event/management");
  return response.data;
}

export async function saveEvent(data) {
  const response = await api.post("/Event", data);
  return response.data;
}

export async function deleteEvent(id) {
  const response = await api.delete(`/Event/${id}`);
  return response.data;
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/FileUpload/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  // Backend göreceli yol döner (/uploads/xxx.jpg), tam adrese çeviriyoruz.
  return "http://localhost:5201" + response.data.url;
}