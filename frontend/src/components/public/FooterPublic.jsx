// src/components/public/FooterPublic.jsx
import React from "react";
import { Heart } from "lucide-react";

export default function FooterPublic() {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 text-center text-sm text-slate-600">
      <p>
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-sky-700">SIDALEKAS</span> · Dinas
        Sosial Kabupaten Indramayu
      </p>
      <p className="flex justify-center items-center gap-1 text-xs text-slate-400 mt-1">
        Dibangun dengan <Heart size={14} className="text-rose-500" /> gaya startup
        modern.
      </p>
    </footer>
  );
}
