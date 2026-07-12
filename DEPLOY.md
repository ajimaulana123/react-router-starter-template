# 🚀 Panduan Deploy Web Absensi Pesantren ke Cloudflare

> **Durasi:** ~15-20 menit
> **Biaya:** Gratis (Free Tier Cloudflare)

---

## 📋 Daftar Isi

1. [Buat Akun Cloudflare](#1-buat-akun-cloudflare)
2. [Login Wrangler](#2-login-wrangler)
3. [Buat D1 Database di Dashboard](#3-buat-d1-database-di-dashboard)
4. [Update Config dengan Database ID](#4-update-config-dengan-database-id)
5. [Apply Migration ke Database](#5-apply-migration-ke-database)
6. [Seed Data Contoh](#6-seed-data-contoh)
7. [Deploy Aplikasi](#7-deploy-aplikasi)
8. [Selesai! 🎉](#8-selesai-)

---

## 1. Buat Akun Cloudflare

Klik tombol di bawah untuk daftar akun Cloudflare (GRATIS):

👉 **[Daftar Cloudflare](https://dash.cloudflare.com/sign-up)**

**Yang perlu diisi:**
- Email
- Password
- Verifikasi email

---

## 2. Login Wrangler

Buka **Terminal / CMD / PowerShell** di folder project, lalu jalankan:

```bash
npx wrangler login
```

Nanti akan terbuka browser. Klik **"Allow"** untuk mengizinkan wrangler mengakses akun Cloudflare Anda.

**Cek apakah sudah login:**
```bash
npx wrangler whoami
```

Harusnya muncul nama email Anda. Kalau belum, ulangi `npx wrangler login`.

---

## 3. Buat D1 Database di Dashboard

Buka Cloudflare Dashboard:

👉 **[Cloudflare Dashboard](https://dash.cloudflare.com/)**

### Langkah-langkah di Dashboard:

1. **Login** ke dashboard.cloudflare.com
2. Klik **"Workers & Pages"** di menu kiri
3. Klik tab **"D1"** (di bagian atas)
4. Klik tombol **"Create database"** (biru)
5. Isi **Database name:** `absensi-pesantren`
6. Pilih **Location:** Automatic
7. Klik **"Create database"**

### 📸 Preview (kira-kira seperti ini):

```
Workers & Pages  >  D1  >  Create database
┌──────────────────────────────────────┐
│ Database name:  absensi-pesantren    │
│ Location:       Automatic           │
│                                      │
│     [ Cancel ]     [ Create database ]│
└──────────────────────────────────────┘
```

### 🔴 IMPORTANT — Copy Database ID!

**Setelah database dibuat, akan muncul popup dengan `database_id`.** 

Contoh ID: `a1b2c3d4-1234-5678-9abc-def012345678`

**Copy ID tersebut dan kirimkan ke saya (Buffy)!** Saya akan update config filenya.

> 💡 **Tips:** Simpan ID ini di notepad dulu.
> Kalau terlewat, bisa lihat di Dashboard > D1 > klik database `absensi-pesantren` > Settings > Database ID

---

## 4. Update Config dengan Database ID

**Setelah Anda kirim database_id-nya ke saya**, saya akan update file `wrangler.json` secara otomatis.

Yang akan berubah:
```json
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "absensi-pesantren",
      "database_id": "local-dev-db-id"    ← Ini akan diganti
    }
  ]
}
```

Menjadi:
```json
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "absensi-pesantren",
      "database_id": "a1b2c3d4-1234-5678-9abc-def012345678"    ← ID asli dari Cloudflare
    }
  ]
}
```

---

## 5. Apply Migration ke Database

Setelah config di-update, jalankan perintah ini di **Terminal**:

```bash
cd D:\project-web\react-router-starter-template
npx wrangler d1 migrations apply absensi-pesantren --remote
```

**Yang terjadi:** Semua tabel akan dibuat di Cloudflare:
- ✅ users
- ✅ santri
- ✅ ustadz
- ✅ kelas
- ✅ mata_pelajaran
- ✅ jadwal
- ✅ absensi
- ✅ wali_santri

---

## 6. Seed Data Contoh

Jalankan perintah ini di **Terminal**:

```bash
cd D:\project-web\react-router-starter-template
npx wrangler d1 execute absensi-pesantren --remote --file=./scripts/seed.sql
```

**Data yang akan masuk:**
| Data | Jumlah |
|------|--------|
| 👨‍🏫 Ustadz | 5 orang |
| 👨‍🎓 Santri | 15 orang |
| 🏫 Kelas | 5 kelas |
| 📖 Mapel | 8 mapel |
| 📅 Jadwal | 30 jadwal |
| 👤 User | 1 admin |

---

## 7. Deploy Aplikasi

Jalankan perintah ini di **Terminal**:

```bash
cd D:\project-web\react-router-starter-template
npm run deploy
```

Prosesnya:
1. ✅ Build aplikasi React
2. ✅ Upload ke Cloudflare Workers
3. ✅ Deploy ke URL

---

## 8. Selesai! 🎉

Aplikasi Anda sudah live di Cloudflare!

**URL:** `https://web-absensi-pesantren.your-subdomain.workers.dev`

**Login:**
| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | Admin |

### Test fitur:
- [ ] Login dengan admin/admin123
- [ ] Dashboard — lihat statistik
- [ ] Data Santri — lihat daftar 15 santri
- [ ] Data Ustadz — lihat 5 ustadz
- [ ] Data Kelas — lihat 5 kelas
- [ ] Mata Pelajaran — lihat 8 mapel
- [ ] Jadwal — lihat 30 jadwal
- [ ] Absensi — coba absen santri
- [ ] Laporan — lihat laporan

---

## ❓ Troubleshooting

### Error: "binding DB of type d1 must have a valid database_id"
**Penyebab:** `database_id` di `wrangler.json` masih placeholder.
**Solusi:** Kirim database_id asli ke saya.

### Error: "Not logged in"
**Penyebab:** Belum login wrangler.
**Solusi:** Jalankan `npx wrangler login`

### Error: "Cannot apply unknown utility class"
**Penyebab:** Masalah CSS Tailwind.
**Solusi:** Saya sudah perbaiki, tinggal restart `npm run dev`.

### Error: Build gagal
**Solusi:** Coba `npm run build` dulu, kalau error kirimkan outputnya ke saya.

---

> **Ada masalah?** Kirim aja screenshot error-nya ke saya, saya bantu debug! 🐛
