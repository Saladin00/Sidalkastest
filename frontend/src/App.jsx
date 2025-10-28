import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardOperator from "./pages/DashboardOperator";
import DashboardPetugas from "./pages/DashboardPetugas";
import DashboardLKS from "./pages/DashboardLKS";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Proteksi masing-masing dashboard berdasarkan role */}
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
              <DashboardPetugas />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
