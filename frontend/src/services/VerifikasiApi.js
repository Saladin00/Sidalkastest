// src/services/verifikasiApi.js
import API from "@/utils/api";

// ✅ Ambil semua verifikasi
export async function getVerifikasi(params = {}) {
  const res = await API.get("/verifikasi", { params });
  return res.data;
}

// ✅ Ambil detail
export async function getVerifikasiDetail(id) {
  const res = await API.get(`/verifikasi/${id}`);
  return res.data;
}

// ✅ Buat verifikasi baru
export async function createVerifikasi(formData) {
  const res = await API.post("/verifikasi", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// ✅ Upload foto bukti
export async function uploadFotoVerifikasi(id, formData) {
  const res = await API.post(`/verifikasi/${id}/foto`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// ✅ Update status verifikasi
export async function updateStatusVerifikasi(id, payload) {
  const res = await API.put(`/verifikasi/${id}/status`, payload);
  return res.data;
}
