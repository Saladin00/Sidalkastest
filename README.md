# 🌐 SIDALEKAS – Sistem Informasi Data Lembaga Kesejahteraan Sosial


- 🔙 **Backend**: Laravel 10 API + Sanctum Auth
- 🌐 **Frontend**: React.js + Tailwind CSS v3 + Lucide Icons

---

## 📁 Struktur Folder

```
sidalekas-project/
├── backend/     # Laravel API
└── frontend/    # React Tailwind UI
```

---

## 🧱 Prasyarat (Wajib Install)

Sebelum menjalankan project, pastikan kamu sudah menginstall:

### 🔧 Global Tools
- PHP >= 8.1
- Composer
- Node.js >= 16
- npm (sudah termasuk di Node.js)
- MySQL / MariaDB

---

## 🚀 Langkah Install Project

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/sidalekas-project.git
cd sidalekas-project
```

---

### 2. 📦 Setup Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Edit file `.env`:
- `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`

Kemudian jalankan:

```bash
php artisan migrate --seed
php artisan serve
```

---

### 3. 🌐 Setup Frontend (React + Tailwind)

```bash
cd ../frontend
npm install
```

#### ✅ Tailwind Setup (sudah include):
- tailwindcss
- postcss
- autoprefixer
- lucide-react (ikon modern)
- react-router-dom
- axios

Jika ingin setup ulang tailwind dari awal:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Tambahkan ke `tailwind.config.js`:

```js
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
```

Lalu pastikan `index.css` kamu punya:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Untuk ikon:

```bash
npm install lucide-react
```

---

### 4. Jalankan Frontend

```bash
cd frontend
npm run dev
```

---

## 🔑 Akun Login (Seeder)

| Role     | Email             | Password |
|----------|-------------------|----------|
| Admin    | admin@mail.com    | admin123 |
| Operator | operator@mail.com | password |
| Petugas  | petugas@mail.com  | password |
| LKS      | lks@mail.com      | password |

---

## 🛡️ Proteksi & Routing

- Halaman dilindungi oleh `ProtectedRoute.jsx`
- Redirect otomatis setelah login berdasarkan role
- Admin bisa akses semua fitur (role superuser)

---

## 🧭 Fitur Utama per Role

### Admin
- Dashboard
- Manajemen Pengguna
- Modul LKS
- Modul Operator & Petugas

### Operator
- Dashboard Kecamatan
- Sebaran Sosial

### Petugas
- Dashboard Lapangan
- Verifikasi Data
- Pengaduan Masyarakat

### LKS
- Dashboard Lembaga
- Data Klien
- Dokumen Pendukung
- Laporan Kegiatan

---

## 🤝 Kontribusi

Silakan fork, clone, dan ajukan pull request.  
Hubungi kami jika ingin kolaborasi ✨

---

## 🪪 Lisensi

MIT © 2025 – Tim SIDALEKAS
composer require barryvdh/laravel-dompdf
