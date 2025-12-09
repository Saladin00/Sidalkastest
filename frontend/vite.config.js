import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// ✅ Tambahkan ini agar __dirname bisa digunakan
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // alias ke /src
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  server: {
    hmr: {
      overlay: true,
    },
    fs: {
      strict: false,
    },
      proxy: {
    '/api': 'http://localhost:8000',
  },
  },
});

