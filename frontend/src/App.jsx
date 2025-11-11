import { BrowserRouter, Routes, Route } from "react-router-dom";

// 🔐 Auth Pages
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

// 🏠 Dashboard Pages
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardOperator from "./pages/DashboardOperator";
import DashboardPetugas from "./pages/DashboardPetugas";
import DashboardLKS from "./pages/DashboardLKS";

// 🧩 Modul LKS
import LKSList from "./pages/admin/lks/LKSList";
import LKSForm from "./pages/admin/lks/LKSForm";
import LKSDetail from "./pages/admin/lks/LKSDetail";
import LKSEditForm from "./pages/admin/lks/LKSEditForm";
import LKSProfil from "./pages/admin/lks/LKSProfil";
import LKSUploadDokumen from "./pages/admin/lks/LKSUploadDokumen";
import LKSKunjungan from "./pages/admin/lks/LKSKunjungan";

// 👤 Manajemen User
import ManajemenUser from "./pages/admin/ManajemenUser";
import AdminLayout from "./components/AdminLayout";

// 📊 Modul Data Klien
import KlienList from "./pages/admin/klien/KlienList";
import KlienForm from "./pages/admin/klien/KlienForm";
import KlienDetail from "./pages/admin/klien/KlienDetail";
import KlienEditForm from "./pages/admin/klien/KlienEditForm";

// 👥 Operator Klien
import OperatorKlienList from "./pages/operator/klien/OperatorKlienList";

// ✅ Modul Verifikasi Admin
import AdminVerifikasiList from "./pages/admin/verifikasi/VerifikasiList";
import AdminVerifikasiReview from "./pages/admin/verifikasi/VerifikasiReview";

// 🧑‍🚒 Layout Petugas (TAMBAHAN)
import PetugasLayout from "./components/PetugasLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==================== AUTH ==================== */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ==================== DASHBOARD ==================== */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/operator"
          element={
            <ProtectedRoute allowedRoles={["operator"]}>
              <DashboardOperator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/petugas"
          element={
            <ProtectedRoute allowedRoles={["petugas"]}>
              <PetugasLayout>
                <DashboardPetugas />
              </PetugasLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/lks"
          element={
            <ProtectedRoute allowedRoles={["lks"]}>
              <DashboardLKS />
            </ProtectedRoute>
          }
        />

        {/* ==================== ADMIN AREA ==================== */}
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

        {/* ==================== MODUL LKS ==================== */}
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

        {/* ==================== MODUL DATA KLIEN ==================== */}
        <Route
          path="/admin/klien"
          element={
            <ProtectedRoute allowedRoles={["admin", "operator", "lks"]}>
              <AdminLayout>
                <KlienList />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/klien/tambah"
          element={
            <ProtectedRoute allowedRoles={["admin", "operator", "lks"]}>
              <KlienForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/klien/detail/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "operator", "lks"]}>
              <KlienDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/klien/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "operator", "lks"]}>
              <KlienEditForm />
            </ProtectedRoute>
          }
        />

        {/* ==================== VERIFIKASI ADMIN ==================== */}
        <Route
          path="/admin/verifikasi"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdminVerifikasiList />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/verifikasi/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdminVerifikasiReview />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* ==================== OPERATOR AREA ==================== */}
        <Route
          path="/operator/klien"
          element={
            <ProtectedRoute allowedRoles={["operator"]}>
              <OperatorKlienList />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
