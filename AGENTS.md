# AGENTS.md — Web Absensi Pesantren

> File ini untuk AI agent (Codebuff). Baca ini pertama sebelum melakukan perubahan apa pun.

---

## 1. Identitas Proyek

- **Nama:** `Web Absensi Pesantren` — Sistem absensi digital untuk pondok pesantren
- **Tipe Repo:** 🔍 Auto-detect — monorepo/single repo, deteksi dari struktur folder
- **Runtime & package manager:** 🔍 Auto-detect dari `packageManager` di `package.json`
- **⚠️ Jangan asumsi package manager:** Cek `package.json` dulu untuk melihat apakah menggunakan `npm`, `bun`, `yarn`, atau `pnpm`

---

## 2. Technology Stack (Auto-Detected)

> **Stack teknologi tidak ditetapkan di file ini.** AI agent harus menganalisis source code yang ada untuk menentukan stack aktual.

| Layer | Teknologi | Cara Deteksi |
|-------|-----------|--------------|
| Frontend | 🔍 Auto-detect | Cek `package.json` → dependencies (react, vue, next, nuxt, dll) |
| Backend | 🔍 Auto-detect | Cek struktur folder (`/api`, `/server`, `/pages/api`), file konfigurasi |
| Database | 🔍 Auto-detect | Cek `package.json` → dependencies (prisma, drizzle, mongoose, dll) |
| ORM | 🔍 Auto-detect | Cek file schema, impor (prisma.schema, drizzle.config, dll) |
| Auth | 🔍 Auto-detect | Cek dependencies (next-auth, lucia, jwt, iron-session, dll) |
| UI Library | 🔍 Auto-detect | Cek dependencies (shadcn/ui, material-ui, chakra, tailwind, dll) |
| State Mgmt | 🔍 Auto-detect | Cek impor (zustand, redux, pinia, dll) |
| Styling | 🔍 Auto-detect | Cek config (tailwind.config, postcss, css-modules, dll) |
| Testing | 🔍 Auto-detect | Cek dependencies (vitest, jest, playwright, cypress, dll) |
| Deployment | 🔍 Auto-detect | Cek file konfigurasi (Dockerfile, vercel.json, netlify.toml, dll) |

### Panduan Deteksi Stack untuk AI Agent

1. **Baca `package.json`** — lihat `dependencies` dan `devDependencies`
2. **Cek file konfigurasi** — `tsconfig.json`, `next.config.js`, `vite.config.ts`, `tailwind.config.js`, `drizzle.config.ts`, `prisma/schema.prisma`, dll
3. **Cek struktur direktori** — `app/` vs `pages/` vs `src/`, ada `/server` atau `/api`?
4. **Cek impor di file source** — pola impor yang digunakan

---

## 3. Arsitektur

```
web-absensi-pesantren/
├── 🔍 [frontend-app]/      # Aplikasi frontend (deteksi dari struktur)
├── 🔍 [backend-api]/        # API server (jika terpisah)
├── 🔍 [packages]/           # Shared packages (jika monorepo)
├── .claude/
│   ├── instructions.md
│   └── skills/
├── AGENTS.md
├── PRD.md
├── DESIGN.md
└── ...
```

> Struktur arsitektur menyesuaikan dengan deteksi dari source code yang ada.

---

## 4. Perintah Penting

AI agent harus mendeteksi perintah yang tepat dari `package.json`:

```bash
# Cek scripts yang tersedia
grep -A 100 '"scripts"' package.json

# Install dependencies — auto-detect
🔍 npm install / bun install / yarn install / pnpm install

# Development — auto-detect dari scripts
🔍 npm run dev / bun run dev

# Build — auto-detect dari scripts
🔍 npm run build

# Database — auto-detect dari package.json scripts
🔍 npm run db:migrate / npm run db:push / npm run db:seed

# Testing — auto-detect
🔍 npm test / npm run test

# Linting
🔍 npm run lint
```

---

## 5. Pitfall Umum — JANGAN

- ❌ **Jangan asumsikan package manager** — cek `package.json` dulu
- ❌ **Jangan asumsikan framework** — analisis source code untuk deteksi
- ❌ **Jangan asumsikan ada Docker/Docker Compose** — cek dulu
- ❌ **Jangan hardcode API keys** di source code
- ❌ **Jangan skip heading levels** — setelah `<h1>`, berikutnya harus `<h2>`
- ❌ **Jangan buat komponen modal/dialog kustom** jika sudah ada library UI
- ❌ **Jangan tambah CSS global** tanpa cek design tokens yang sudah ada

---

## 6. Domain Absensi Pesantren

### Entitas Utama

| Entitas | Deskripsi | Relasi |
|---------|-----------|--------|
| **Santri** | Siswa pondok pesantren | 1 santri → 1 kelas |
| **Ustadz/Ustadzah** | Guru/pengajar | 1 ustadz → banyak jadwal |
| **Kelas** | Tingkatan/kelas di pesantren | 1 kelas → banyak santri |
| **Mata Pelajaran** | Pelajaran yang diajarkan | 1 mapel → banyak jadwal |
| **Jadwal** | Jadwal mengajar | jadwal → ustadz + mapel + kelas |
| **Absensi** | Catatan kehadiran | absensi → santri + jadwal + tanggal |
| **Laporan** | Rekap absensi | per periode/bulan/kelas |
| **Wali Santri** | Orang tua/wali | 1 wali → banyak santri |

### Alur Bisnis Utama

```
1. Admin mendaftarkan santri baru → masuk ke kelas tertentu
2. Admin/Ustadz membuat jadwal → ustadz + mapel + kelas + jam
3. Ustadz melakukan absensi → pilih kelas + mapel + tanggal → tandai hadir/sakit/izin/alpa
4. Sistem generate laporan → rekap harian/bulanan
5. Wali santri bisa lihat absensi anaknya
```

### Role & Hak Akses

| Role | Akses Utama |
|------|-------------|
| **Admin/Pengurus** | Full akses: manajemen data, laporan, konfigurasi |
| **Ustadz/Ustadzah** | Absensi, lihat jadwal, lihat laporan kelas sendiri |
| **Santri** | Lihat absensi sendiri, lihat jadwal |
| **Wali Santri** | Lihat absensi anak/wali |

---

## 7. Environment & Secrets

```bash
# Cari file .env atau .env.example
# Biasanya berisi:
🔍 DATABASE_URL=
🔍 NEXTAUTH_SECRET=        # Jika pakai NextAuth
🔍 JWT_SECRET=             # Jika pakai JWT
🔍 API_URL=
🔍 NEXT_PUBLIC_API_URL=
```

- Jangan hardcode secrets — baca dari environment variables
- File `.env` tidak boleh di-commit (cek `.gitignore`)

---

## 8. Database Conventions

- 🔍 Deteksi ORM dari file schema (prisma, drizzle, typeorm, mongoose)
- 🔍 Deteksi database dari connection string atau config
- Migrations: 🔍 deteksi dari `package.json` scripts

---

## 9. Backend Conventions (Auto-Detected)

- 🔍 Deteksi framework backend (Next.js API routes, Express, Fastify, Hono, dll)
- 🔍 Deteksi pola error handling dari source code
- 🔍 Deteksi middleware pattern

---

## 10. Frontend Conventions (Auto-Detected)

- 🔍 Deteksi framework frontend (React, Vue, Next.js, Nuxt, dll)
- 🔍 Deteksi routing pattern (file-based, config-based)
- 🔍 Deteksi styling approach (Tailwind, CSS Modules, styled-components)

---

## 11. Git & Workflow

- **JANGAN** jalankan `git commit`, `git push`, `git rebase`, atau force-push kecuali user meminta
- **JANGAN** buat `README.md` atau file dokumentasi kecuali diminta
- Ikuti gaya kode yang sudah ada di file yang diedit

---

## 12. Testing (Auto-Detected)

- 🔍 Deteksi test runner dari `package.json` (vitest, jest, mocha, dll)
- 🔍 Deteksi lokasi test files (`__tests__/`, `*.test.ts`, `*.spec.ts`)
- 🔍 Deteksi E2E tool (playwright, cypress)

---

_Last updated: {{ CURRENT_DATE }}_
