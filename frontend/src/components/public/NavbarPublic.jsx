import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, LayoutDashboard } from "lucide-react";

export default function NavbarPublic() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const yOffset = -80; // agar tidak ketutup navbar
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const handleDashboard = () => {
    if (!token) return navigate("/login");

    switch (role) {
      case "admin": navigate("/admin"); break;
      case "operator": navigate("/operator"); break;
      case "petugas": navigate("/petugas"); break;
      case "lks": navigate("/lks"); break;
      default: navigate("/login");
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled
        ? "bg-white/90 backdrop-blur-lg shadow-sm border-b border-slate-200"
        : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-10 py-3">

        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <img src="/logo.png" alt="Logo" className="h-10 w-10" />
          <div>
            <h1 className="text-lg font-bold text-sky-700">SIDALEKAS</h1>
            <p className="text-[11px] text-sky-600 -mt-1 tracking-wider">Dinas Sosial Indramayu</p>
          </div>
        </div>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
          <button onClick={() => scrollToSection("statistik")} className="hover:text-sky-600 transition">
            Statistik
          </button>
          <button onClick={() => scrollToSection("lks")} className="hover:text-sky-600 transition">
            LKS
          </button>
          <button onClick={() => scrollToSection("kontak")} className="hover:text-sky-600 transition">
            Kontak
          </button>

          <button
            onClick={handleDashboard}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            {token ? <><LayoutDashboard size={16} /> Dashboard</> : <><LogIn size={16} /> Login</>}
          </button>
        </div>
      </div>
    </nav>
  );
}
