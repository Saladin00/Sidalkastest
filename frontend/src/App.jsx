// =========================
// 📦 IMPORT DASAR
// =========================
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

// =========================
// 🏠 DASHBOARD
// =========================
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardOperator from "./pages/DashboardOperator";
import DashboardPetugas from "./pages/DashboardPetugas";
import DashboardLKS from "./pages/DashboardLKS";

// =========================
// 🧩 KOMPONEN LAYOUT
// =========================
import AdminLayout from "./components/AdminLayout";
import PetugasLayout from "./components/PetugasLayout";

// =========================
// 👥 MODUL MANAJEMEN USER
// =========================
import ManajemenUser from "./pages/admin/ManajemenUser";

// =========================
// 🏢 MODUL LKS
// =========================
import LKSList from "./pages/admin/lks/LKSList";
import LKSForm from "./pages/admin/lks/LKSForm";
import LKSDetail from "./pages/admin/lks/LKSDetail";
import LKSEditForm from "./pages/admin/lks/LKSEditForm";
import LKSProfil from "./pages/admin/lks/LKSProfil";
import LKSUploadDokumen from "./pages/admin/lks/LKSUploadDokumen";
import LKSKunjungan from "./pages/admin/lks/LKSKunjungan";

// =========================
// 🔍 MODUL VERIFIKASI
// =========================
import AdminVerifikasiList from "./pages/admin/verifikasi/VerifikasiList";
import AdminVerifikasiReview from "./pages/admin/verifikasi/VerifikasiReview";
import PetugasVerifikasiList from "./pages/petugas/verifikasi/VerifikasiList";
import PetugasVerifikasiForm from "./pages/petugas/verifikasi/VerifikasiForm";

// =========================
// 🚀 APP ROUTES
// =========================
function App() {
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

        {/* ================= PETUGAS ================= */}
        <Route element={<ProtectedRoute allowedRoles={["petugas"]} />}>
          <Route path="/petugas" element={<PetugasLayout />}>
            {/* Default dashboard petugas */}
            <Route index element={<DashboardPetugas />} />

            {/* ✅ Verifikasi */}
            <Route path="verifikasi" element={<PetugasVerifikasiList />} />
            <Route
              path="verifikasi/:lksId/form"
              element={
                <ParamWrapper component={PetugasVerifikasiForm} paramKey="lksId" />
              }
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

        {/* ================= ADMIN VERIFIKASI ================= */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="verifikasi" element={<AdminVerifikasiList />} />
            <Route
              path="verifikasi/:id"
              element={
                <ParamWrapper component={AdminVerifikasiReview} paramKey="id" />
              }
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// 🔧 Helper untuk meneruskan param ID ke komponen child
function ParamWrapper({ component: Comp, paramKey }) {
  const params = useParams();
  const prop = {};
  prop[paramKey] = params[paramKey];
  return <Comp {...prop} />;
}

export default App;
