import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2e353e] text-white min-h-screen">
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
          <Link to="/admin">SIDALEKAS</Link>
        </div>
        <nav className="flex flex-col gap-1 p-4 text-sm">
          <Link to="/admin" className="hover:bg-gray-700 px-3 py-2 rounded">🏠 Dashboard</Link>
          <Link to="/admin/lks" className="hover:bg-gray-700 px-3 py-2 rounded">🏢 Manajemen LKS</Link>
          <Link to="/admin/klien" className="hover:bg-gray-700 px-3 py-2 rounded">👥 Data Klien</Link>
          <Link to="/admin/verifikasi" className="hover:bg-gray-700 px-3 py-2 rounded">✔️ Verifikasi</Link>
          <Link to="/admin/statistik" className="hover:bg-gray-700 px-3 py-2 rounded">📊 Statistik</Link>
          <Link to="/admin/user" className="hover:bg-gray-700 px-3 py-2 rounded">🛠️ Manajemen Pengguna</Link>
        </nav>
      </aside>

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Dashboard Admin</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">👤 Admin</span>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}
              className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Konten Anak */}
        <main className="p-6 bg-gray-50 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
