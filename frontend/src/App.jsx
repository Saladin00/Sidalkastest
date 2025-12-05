import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Auth
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Account
import AccountSettings from "./pages/admin/AccountSettings";
import OperatorAccount from "./pages/operator/OperatorAccount";
import PetugasAccount from "./pages/petugas/PetugasAccount";
import LKSAccount from "./pages/lks/LKSAccount";

// Layouts
import AdminLayout from "./components/AdminLayout";
import OperatorLayout from "./components/OperatorLayout";
import PetugasLayout from "./components/PetugasLayout";
import LKSLayout from "./components/LKSLayout";

// Dashboards
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardOperator from "./pages/DashboardOperator";
import DashboardPetugas from "./pages/DashboardPetugas";
import DashboardLKS from "./pages/DashboardLKS";

// ================= ADMIN =================

// LKS CRUD
import LKSList from "./pages/admin/lks/LKSList";
import LKSForm from "./pages/admin/lks/LKSForm";
import LKSDetail from "./pages/admin/lks/LKSDetail";
import LKSEditForm from "./pages/admin/lks/LKSEditForm";

// Klien CRUD
import KlienList from "./pages/admin/klien/KlienList";
import KlienForm from "./pages/admin/klien/KlienForm";
import KlienDetail from "./pages/admin/klien/KlienDetail";
import KlienEditForm from "./pages/admin/klien/KlienEditForm";

// User
import ManajemenUser from "./pages/admin/ManajemenUser";
import TambahUser from "./pages/admin/TambahUser";

// Verifikasi
import AdminVerifikasiList from "./pages/admin/verifikasi/VerifikasiList";
import AdminVerifikasiDetail from "./pages/admin/verifikasi/VerifikasiDetail";
import AdminVerifikasiReview from "./pages/admin/verifikasi/VerifikasiReview";

// ================= OPERATOR =================

// LKS & Klien
import OperatorLKSList from "./pages/operator/lks/OperatorLKSList";
import OperatorLKSDetail from "./pages/operator/lks/OperatorLKSDetail";
import OperatorKlienList from "./pages/operator/klien/OperatorKlienList";
import OperatorKlienDetail from "./pages/operator/klien/OperatorKlienDetail";
import ManajemenLKSOperator from "./pages/operator/ManajemenLKSOperator";

// Verifikasi
import OperatorVerifikasiList from "./pages/operator/verifikasi/OperatorVerifikasiList";
import OperatorVerifikasiDetail from "./pages/operator/verifikasi/OperatorVerifikasiDetail";

// ================= PETUGAS =================

// Verifikasi (form dihapus)
import PetugasVerifikasiList from "./pages/petugas/verifikasi/PetugasVerifikasiList";
import PetugasVerifikasiDetail from "./pages/petugas/verifikasi/PetugasVerifikasiDetail";

// ================= LKS =================

// Klien
import LKSKlienList from "./pages/lks/klien/LKSKlienList";
import LKSKlienForm from "./pages/lks/klien/LKSKlienForm";
import LKSKlienDetail from "./pages/lks/klien/LKSKLienDetail";
import LKSKlienEdit from "./pages/lks/klien/LKSKlienEdit";

// Profil
import LKSProfileView from "./pages/lks/LKSProfileView";
import LKSProfileEdit from "./pages/lks/LKSProfileEdit";

// Verifikasi (status hasil)

import LKSVerifikasiDetail from "./pages/lks/verifikasi/LKSVerifikasiDetail";
import LKSVerifikasiList from "./pages/lks/verifikasi/LKSVerifikasiList";
import LKSVerifikasiForm from "./pages/lks/verifikasi/LKSVerifikasiForm"; // ✅ import di atas

// Laporan
import LaporanAdmin from "./pages/admin/laporan/LaporanAdmin";
import LaporanOperator from "./pages/operator/Laporan/LaporanOperator";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= AUTH ================= */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* 🚀 RESET PASSWORD */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <DashboardAdmin />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        {/* --- ADMIN: USERS --- */}
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
        {/* ✅ Tambah route baru untuk Tambah User */}
        <Route
          path="/admin/users/tambah"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <TambahUser />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        {/* ADMIN: LKS */}
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
          path="/admin/lks/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "operator"]}>
              <LKSEditForm />
            </ProtectedRoute>
          }
        />
        {/* ADMIN: KLIEN */}
        <Route
          path="/admin/klien"
          element={
            <ProtectedRoute allowedRoles={["admin", "operator"]}>
              <AdminLayout>
                <KlienList />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/klien/tambah"
          element={
            <ProtectedRoute allowedRoles={["admin", "operator"]}>
              <AdminLayout>
                <KlienForm />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/klien/detail/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "operator"]}>
              <AdminLayout>
                <KlienDetail />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/klien/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "operator"]}>
              <AdminLayout>
                <KlienEditForm />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        {/* ADMIN: VERIFIKASI */}
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
          path="/admin/verifikasi/detail/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdminVerifikasiDetail />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/verifikasi/review/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdminVerifikasiReview />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        {/* =========Account Settings Admin */}
        <Route
          path="/admin/account"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AccountSettings />
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
        {/* OPERATOR: MANAJEMEN LKS */}
        <Route
          path="/operator/manajemen-lks"
          element={
            <ProtectedRoute allowedRoles={["operator"]}>
              <OperatorLayout>
                <ManajemenLKSOperator />
              </OperatorLayout>
            </ProtectedRoute>
          }
        />
        {/* Operator acount setting */}
        <Route
          path="/operator/account"
          element={
            <ProtectedRoute allowedRoles={["operator"]}>
              <OperatorAccount />
            </ProtectedRoute>
          }
        />
        {/* OPERATOR: LKS & KLIEN */}
        <Route
          path="/operator/lks"
          element={
            <ProtectedRoute allowedRoles={["operator"]}>
              <OperatorLayout>
                <OperatorLKSList />
              </OperatorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/operator/lks/detail/:id"
          element={
            <ProtectedRoute allowedRoles={["operator"]}>
              <OperatorLayout>
                <OperatorLKSDetail />
              </OperatorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/operator/klien"
          element={
            <ProtectedRoute allowedRoles={["operator"]}>
              <OperatorLayout>
                <OperatorKlienList />
              </OperatorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/operator/klien/detail/:id"
          element={
            <ProtectedRoute allowedRoles={["operator"]}>
              <OperatorLayout>
                <OperatorKlienDetail />
              </OperatorLayout>
            </ProtectedRoute>
          }
        />
        {/* OPERATOR: VERIFIKASI */}
        <Route
          path="/operator/verifikasi"
          element={
            <ProtectedRoute allowedRoles={["operator"]}>
              <OperatorLayout>
                <OperatorVerifikasiList />
              </OperatorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/operator/lks-list"
          element={
            <ProtectedRoute allowedRoles={["operator", "petugas"]}>
              <OperatorLayout>
                <OperatorLKSList />
              </OperatorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/operator/verifikasi/detail/:id"
          element={
            <ProtectedRoute allowedRoles={["operator"]}>
              <OperatorLayout>
                <OperatorVerifikasiDetail />
              </OperatorLayout>
            </ProtectedRoute>
          }
        />
        {/* ================= PETUGAS ================= */}
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
        {/* PETUGAS: VERIFIKASI */}
        <Route
          path="/petugas/verifikasi"
          element={
            <ProtectedRoute allowedRoles={["petugas"]}>
              <PetugasLayout>
                <PetugasVerifikasiList />
              </PetugasLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/petugas/verifikasi/detail/:id"
          element={
            <ProtectedRoute allowedRoles={["petugas"]}>
              <PetugasLayout>
                <PetugasVerifikasiDetail />
              </PetugasLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/petugas/account"
          element={
            <ProtectedRoute allowedRoles={["petugas"]}>
              <PetugasAccount />
            </ProtectedRoute>
          }
        />
        {/* ===================== LKS ===================== */}

        {/* Dashboard LKS */}
        <Route
          path="/lks"
          element={
            <ProtectedRoute allowedRoles={["lks"]}>
              <DashboardLKS />
            </ProtectedRoute>
          }
        />

        {/* ===== PROFIL LKS ===== */}
        <Route
          path="/lks/profile"
          element={
            <ProtectedRoute allowedRoles={["lks"]}>
              <LKSProfileView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lks/profile/edit"
          element={
            <ProtectedRoute allowedRoles={["lks"]}>
              <LKSProfileEdit />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lks/account"
          element={
            <ProtectedRoute allowedRoles={["lks"]}>
              <LKSAccount />
            </ProtectedRoute>
          }
        />

        {/* ===================== VERIFIKASI LKS (SELALU BOLEH DIAKSES) ===================== */}

        <Route
          path="/lks/verifikasi"
          element={
            <ProtectedRoute allowedRoles={["lks"]}>
              <LKSLayout>
                <LKSVerifikasiList />
              </LKSLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/lks/verifikasi/pengajuan"
          element={
            <ProtectedRoute allowedRoles={["lks"]}>
              <LKSLayout>
                <LKSVerifikasiForm />
              </LKSLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/lks/verifikasi/detail/:id"
          element={
            <ProtectedRoute allowedRoles={["lks"]}>
              <LKSLayout>
                <LKSVerifikasiDetail />
              </LKSLayout>
            </ProtectedRoute>
          }
        />

        {/* ===================== KLIEN LKS (WAJIB VERIFIED) ===================== */}

        <Route
          path="/lks/klien"
          element={
            <ProtectedRoute allowedRoles={["lks"]}>
              <LKSLayout>
                <LKSKlienList />
              </LKSLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/lks/klien/tambah"
          element={
            <ProtectedRoute allowedRoles={["lks"]}>
              <LKSLayout>
                <LKSKlienForm />
              </LKSLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/lks/klien/detail/:id"
          element={
            <ProtectedRoute allowedRoles={["lks"]}>
              <LKSLayout>
                <LKSKlienDetail />
              </LKSLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/lks/klien/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["lks"]}>
              <LKSLayout>
                <LKSKlienEdit />
              </LKSLayout>
            </ProtectedRoute>
          }
        />

        {/* Laporan  */}
        {/* ADMIN */}
        <Route path="/admin/laporan" element={<LaporanAdmin />} />
        {/* OPERATOR */}
        <Route path="/operator/laporan" element={<LaporanOperator />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        draggable
        pauseOnHover
        theme="colored"
      />
    </BrowserRouter>
  );
}

export default App;
