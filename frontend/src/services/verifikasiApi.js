// src/services/verifikasiApi.js
import API from "@/utils/api";

// 🔹 Buat verifikasi baru (petugas)
export async function createVerifikasi(data) {
  const res = await API.post("/verifikasi", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// 🔹 Ambil daftar verifikasi
export async function getVerifikasi(params = {}) {
  const res = await API.get("/verifikasi", { params });
  return res.data;
}

// 🔹 Ambil detail verifikasi berdasarkan ID
export async function getVerifikasiById(id) {
  const res = await API.get(`/verifikasi/${id}`);
  return res.data;
}

// 🔹 Update status verifikasi (admin)
export async function updateStatusVerifikasi(id, { status, catatan_admin }) {
  const res = await API.put(`/verifikasi/${id}/status`, { status, catatan_admin });
  return res.data;
}

// 🟢 Tambahkan alias agar kompatibel dengan kode lama
export { getVerifikasiById as getVerifikasiDetail };

// 🔹 Ambil log aktivitas
export async function getVerifikasiLogs(id) {
  const res = await API.get(`/verifikasi/${id}/logs`);
  return res.data;
}
