# NexusCorp - Fullstack Corporate Profile CMS

NexusCorp adalah aplikasi CMS (Content Management System) Company Profile modern dan berperforma tinggi yang dibangun menggunakan arsitektur Decoupled (Decoupled Architecture) dengan backend **Laravel** dan frontend **React (Vite)** di dalam container **Docker**.

---

## 🚀 Fitur Utama

- **Single-Page Scroll Layout**: Navigasi lancar dengan Scroll Spy otomatis di header.
- **Sub-Second Load Time**: Optimalisasi pemuatan dengan unified API endpoint `/public/homepage` yang merangkum seluruh bagian landing page menjadi satu payload JSON tunggal.
- **Dynamic Caching**: Menggunakan caching respons Laravel untuk meminimalkan beban database dengan pembersihan otomatis (*Model-level Cache Invalidation*) setiap kali admin memperbarui konten.
- **Premium Animations**: Efek kemunculan elemen secara perlahan (*Fade-in transitions*) bergaya modern saat halaman digulir (scroll).
- **Admin Dashboard CRUD**: CRUD manajemen penuh untuk Hero Section, Services (Layanan), Projects (Portofolio Klien), Testimonials (Ulasan), dan Blog/Articles (Artikel Berita).
- **Custom Branding**: Dilengkapi dengan logo geometris modern dan favicon versi cache-busting.
- **CI/CD Integration**: Deployment otomatis sekali push melalui GitHub Actions langsung ke VPS Anda menggunakan SSH.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS, Lucide Icons, Axios.
- **Backend**: Laravel 10+, REST API, Eloquent ORM.
- **Database & Cache**: MySQL 8.0, Redis (Opsional Cache Layer).
- **DevOps**: Docker, Docker Compose, Cloudflare Tunnel (cloudflared), GitHub Actions.

---

## 💻 Cara Menjalankan Secara Lokal (Local Development)

### Prasyarat:
- Docker & Docker Compose terinstal di komputer Anda.

### Langkah-langkah:

1. **Clone Repositori**:
   ```bash
   git clone https://github.com/Fdlnahmd/nexuscorp.git
   cd nexuscorp
   ```

2. **Salin File Environment**:
   * Di root direktori:
     ```bash
     cp .env.example .env
     ```
   * Di direktori `backend`:
     ```bash
     cp backend/.env.example backend/.env
     ```
   * Di direktori `frontend`:
     ```bash
     cp frontend/.env.example frontend/.env
     ```

3. **Jalankan Docker Compose**:
   ```bash
   docker compose up -d --build
   ```

4. **Inisialisasi Database & Dependensi Backend**:
   ```bash
   docker exec -it cms_backend composer install
   docker exec -it cms_backend php artisan key:generate
   docker exec -it cms_backend php artisan migrate --seed
   docker exec -it cms_backend php artisan storage:link
   ```

5. **Akses Aplikasi**:
   * **Website Publik**: [http://localhost:3000](http://localhost:3000)
   * **API Backend**: [http://localhost:8000](http://localhost:8000)
   * **phpMyAdmin**: [http://localhost:8085](http://localhost:8085)

---

## 📦 Panduan Deployment & CI/CD

Deployment otomatis dikonfigurasi melalui GitHub Actions di berkas `.github/workflows/deploy.yml`. 

### Variabel Secrets GitHub yang Dibutuhkan:
Buka repositori GitHub Anda, navigasikan ke **Settings > Secrets and variables > Actions** dan buat rahasia berikut:

1. **`SSH_HOST`**: Alamat IP / Domain VPS Anda.
2. **`SSH_USERNAME`**: Username login SSH VPS (contoh: `root` atau `ubuntu`).
3. **`SSH_PRIVATE_KEY`**: Isi kunci privat SSH Anda (`~/.ssh/id_rsa`).
4. **`PROJECT_PATH`**: Path absolut folder proyek di VPS (contoh: `/home/fadlan/cms`).
5. **`ENV_FILE`**: Konfigurasi `.env` root VPS.
6. **`BACKEND_ENV`**: Konfigurasi `backend/.env` VPS (sertakan `APP_KEY` tetap).
7. **`FRONTEND_ENV`**: Konfigurasi `frontend/.env` VPS (`VITE_API_URL=/api`).

Untuk panduan konfigurasi kunci SSH dan VPS lebih lengkap, baca berkas [ci_cd_setup_guide.md](./ci_cd_setup_guide.md).
