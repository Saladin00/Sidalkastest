// src/App.jsx
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";

// 🧩 Layout dan Proteksi
import AdminLayout from "./components/AdminLayout";
import PetugasLayout from "./components/PetugasLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// 📄 Auth Pages
import Register from "./pages/Register";
import Login from "./pages/Login";

// 📊 Dashboard per Role
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardOperator from "./pages/DashboardOperator";
import DashboardPetugas from "./pages/DashboardPetugas";
import DashboardLKS from "./pages/DashboardLKS";

// ========================
// 🏢 MODUL LKS (ADMIN / OPERATOR)
// ========================
import LKSList from "./pages/admin/lks/LKSList";
import LKSForm from "./pages/admin/lks/LKSForm";
import LKSDetail from "./pages/admin/lks/LKSDetail";
import LKSEditForm from "./pages/admin/lks/LKSEditForm";
import LKSProfil from "./pages/admin/lks/LKSProfil";
import LKSUploadDokumen from "./pages/admin/lks/LKSUploadDokumen";
import LKSKunjungan from "./pages/admin/lks/LKSKunjungan";

// 👤 Manajemen Pengguna
import ManajemenUser from "./pages/admin/ManajemenUser";

// ========================
// 🔍 MODUL VERIFIKASI
// ========================
import AdminVerifikasiList from "./pages/admin/verifikasi/VerifikasiList";
import AdminVerifikasiReview from "./pages/admin/verifikasi/VerifikasiReview";
import PetugasVerifikasiList from "./pages/petugas/verifikasi/VerifikasiList";
import PetugasVerifikasiForm from "./pages/petugas/verifikasi/VerifikasiForm"; // ✅ sudah ada

// ========================
// 🧠 Helper ParamWrapper
// ========================
function ParamWrapper({ component: Comp, paramKey }) {
  const params = useParams();
  const prop = {};
  prop[paramKey] = params[paramKey];
  return <Comp {...prop} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= LOGIN & REGISTER ================= */}
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

        {/* ✅ Manajemen Pengguna */}
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

        {/*================= PETUGAS =================*/}
        <Route element={<ProtectedRoute allowedRoles={["petugas"]} />}>
          <Route path="/petugas" element={<PetugasLayout />}>
            {/* Default dashboard petugas */}
            <Route index element={<DashboardPetugas />} />

            {/* ✅ List Verifikasi */}
            <Route path="verifikasi" element={<PetugasVerifikasiList />} />

            {/* ✅ Form Verifikasi (disesuaikan) */}
            <Route
              path="verifikasi/:id/form"
              element={<PetugasVerifikasiForm />}
            />
          </Route>
        </Route>


        {/* ================= LKS (USER LKS) ================= */}
        <Route
          path="/lks"
          element={
            <ProtectedRoute allowedRoles={["lks"]}>
              <DashboardLKS />
            </ProtectedRoute>
          }
        />

        {/* ================= VERIFIKASI ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="verifikasi" element={<AdminVerifikasiList />} />
          <Route
            path="verifikasi/:id"
            element={
              <ParamWrapper component={AdminVerifikasiReview} paramKey="id" />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
