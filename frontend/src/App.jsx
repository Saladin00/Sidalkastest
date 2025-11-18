import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

// Layouts
import AdminLayout from "./components/AdminLayout";
import OperatorLayout from "./components/OperatorLayout";
import PetugasLayout from "./components/PetugasLayout";
import LKSLayout from "./components/LKSLayout";

// Dashboard
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardOperator from "./pages/DashboardOperator";
import DashboardPetugas from "./pages/DashboardPetugas";
import DashboardLKS from "./pages/DashboardLKS";

// Admin: LKS
import LKSList from "./pages/admin/lks/LKSList";
import LKSForm from "./pages/admin/lks/LKSForm";
import LKSDetail from "./pages/admin/lks/LKSDetail";
import LKSEditForm from "./pages/admin/lks/LKSEditForm";
import LKSKunjungan from "./pages/admin/lks/LKSKunjungan";
import LKSUploadDokumen from "./pages/admin/lks/LKSUploadDokumen";

// LKS Profile Page
import LKSProfileEdit from "./pages/lks/LKSProfileEdit";
import LKSProfileView from "./pages/lks/LKSProfileView";

// Admin: Klien
import KlienList from "./pages/admin/klien/KlienList";
import KlienForm from "./pages/admin/klien/KlienForm";
import KlienDetail from "./pages/admin/klien/KlienDetail";
import KlienEditForm from "./pages/admin/klien/KlienEditForm";

// Admin: User
import ManajemenUser from "./pages/admin/ManajemenUser";
import ManajemenLKSOperator from "./pages/operator/ManajemenLKSOperator";

// Admin: Verifikasi
import AdminVerifikasiList from "./pages/admin/verifikasi/VerifikasiList";
import AdminVerifikasiReview from "./pages/admin/verifikasi/VerifikasiReview";
import AdminVerifikasiDetail from "./pages/admin/verifikasi/VerifikasiDetail";

// Operator LKS & Klien
import OperatorLKSList from "./pages/operator/lks/OperatorLKSList";
import OperatorLKSDetail from "./pages/operator/lks/OperatorLKSDetail";
import OperatorKlienList from "./pages/operator/klien/OperatorKlienList";
import OperatorKlienDetail from "./pages/operator/klien/OperatorKlienDetail";

// LKS Role: Klien
import LKSKlienList from "./pages/lks/LKSKlienList";
import LKSKlienForm from "./pages/lks/LKSKlienForm";
import LKSKlienDetail from "./pages/lks/LKSKlienDetail";
import LKSKlienEdit from "./pages/lks/LKSKlienEdit";

// ==================== VERIFIKASI ====================

// Admin Verifikasi

// Operator Verifikasi
import OperatorVerifikasiList from "./pages/operator/verifikasi/OperatorVerifikasiList";
import OperatorVerifikasiDetail from "./pages/operator/verifikasi/OperatorVerifikasiDetail";

// Petugas Verifikasi
import PetugasVerifikasiList from "./pages/petugas/verifikasi/PetugasVerifikasiList";
import PetugasVerifikasiForm from "./pages/petugas/verifikasi/PetugasVerifikasiForm";
import PetugasVerifikasiDetail from "./pages/petugas/verifikasi/PetugasVerifikasiDetail";

// LKS Verifikasi (status hasil verifikasi)
import LKSVerifikasiStatus from "./pages/lks/verifikasi/LKSVerifikasiStatus";
import LKSVerifikasiDetail from "./pages/lks/verifikasi/LKSVerifikasiDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= AUTH ================= */}
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

        {/* --- ADMIN: LKS CRUD --- */}
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

        {/* --- ADMIN: KLIEN CRUD --- */}
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

        {/* --- ADMIN: VERIFIKASI --- */}
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

        {/* ================= OPERATOR ================= */}
        <Route
          path="/operator"
          element={
            <ProtectedRoute allowedRoles={["operator"]}>
              <DashboardOperator />
            </ProtectedRoute>
          }
        />

        {/* Operator LKS */}
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

        {/* 🆕 Tambahan baru */}
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
          path="/operator/lks/detail/:id"
          element={
            <ProtectedRoute allowedRoles={["operator", "petugas"]}>
              <OperatorLayout>
                <OperatorLKSDetail />
              </OperatorLayout>
            </ProtectedRoute>
          }
        />

        {/* OPERATOR KLIEN */}
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
            <ProtectedRoute allowedRoles={["operator", "petugas"]}>
              <OperatorLayout>
                <OperatorKlienDetail />
              </OperatorLayout>
            </ProtectedRoute>
          }
        />

        {/* ================= OPERATOR: VERIFIKASI ================= */}
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

        {/* ================= PETUGAS: VERIFIKASI ================= */}
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
          path="/petugas/verifikasi/tambah"
          element={
            <ProtectedRoute allowedRoles={["petugas"]}>
              <PetugasLayout>
                <PetugasVerifikasiForm />
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

        {/* ================= LKS ROLE ================= */}

        {/* LKS Dashboard */}
        <Route
          path="/lks"
          element={
            <ProtectedRoute allowedRoles={["lks"]}>
              <DashboardLKS />
            </ProtectedRoute>
          }
        />

        {/* LKS PROFILE */}
        <Route
          path="/lks/profile"
          element={
            <ProtectedRoute allowedRoles={["lks", "admin"]}>
              <LKSProfileView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lks/profile/edit"
          element={
            <ProtectedRoute allowedRoles={["lks", "admin"]}>
              <LKSProfileEdit />
            </ProtectedRoute>
          }
        />

        {/* LKS KLIEN */}
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

        {/* ================= LKS: STATUS VERIFIKASI ================= */}
        <Route
          path="/lks/verifikasi"
          element={
            <ProtectedRoute allowedRoles={["lks"]}>
              <LKSLayout>
                <LKSVerifikasiStatus />
              </LKSLayout>
            </ProtectedRoute>
          }
        />

        {/* ✅ LKS: DETAIL VERIFIKASI */}
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
