// src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";


import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";


import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardOperator from "./pages/DashboardOperator";
import DashboardPetugas from "./pages/DashboardPetugas";
import DashboardLKS from "./pages/DashboardLKS";



// 📄 Import halaman modul LKS
import LKSList from "./pages/admin/lks/LKSList";
import LKSForm from "./pages/admin/lks/LKSForm";
import LKSDetail from "./pages/admin/lks/LKSDetail";
import LKSEditForm from "./pages/admin/lks/LKSEditForm";
import LKSProfil from "./pages/admin/lks/LKSProfil";
import LKSUploadDokumen from "./pages/admin/lks/LKSUploadDokumen";
import LKSKunjungan from "./pages/admin/lks/LKSKunjungan"; // ✅ Halaman baru untuk laporan kunjungan


import ManajemenUser from "./pages/admin/ManajemenUser";
import AdminLayout from "./components/AdminLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= LOGIN ================= */}
        <Route path="/" element={<Login />} />
         <Route path="/register" element={<Register />} />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />

            {/* ✅ Modul Manajemen Pengguna */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
              <ManajemenUser />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* ================= MODUL LKS ================= */}
        <Route
          path="/admin/lks"
          element={
            <ProtectedRoute allowedRoles={["admin", "operator"]}>
              <LKSList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/lks/tambah"
          element={
            <ProtectedRoute allowedRoles={["admin", "operator"]}>
              <LKSForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/lks/detail/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "operator", "lks"]}>
              <LKSDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/lks/profil/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "operator", "lks"]}>
              <LKSProfil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/lks/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "operator", "lks"]}>
              <LKSEditForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/lks/upload/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "operator", "lks"]}>
              <LKSUploadDokumen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/lks/kunjungan/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "operator", "petugas"]}>
              <LKSKunjungan />
            </ProtectedRoute>
          }
        />

        {/* ================= OPERATOR ================= */}
        <Route
          path="/operator"
          element={
            <ProtectedRoute allowedRoles={["operator"]}>
              <DashboardOperator />
            </ProtectedRoute>
          }
        />

        {/* ================= PETUGAS ================= */}
        <Route
          path="/petugas"
          element={
            <ProtectedRoute allowedRoles={["petugas"]}>
              <DashboardPetugas />
            </ProtectedRoute>
          }
        />

        {/* ================= LKS (User LKS) ================= */}
        <Route
          path="/lks"
          element={
            <ProtectedRoute allowedRoles={["lks"]}>
              <DashboardLKS />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
