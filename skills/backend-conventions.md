---
name: backend-conventions
description: Backend conventions — API endpoints untuk absensi pesantren, error handling, middleware
---

# Backend Conventions — Web Absensi Pesantren

## Stack Overview

> 🔍 **Auto-detect dari source code.** Cek `package.json`, file konfigurasi, dan impor untuk menentukan:
> - Runtime (Node.js, Bun, Deno)
> - Framework (Next.js API Routes, Express, Fastify, Hono, dll)
> - ORM (Prisma, Drizzle, TypeORM, Sequelize, dll)
> - Auth (NextAuth, Lucia, JWT, iron-session, dll)
> - Validasi (Zod, Yup, Joi, Valibot, dll)

## API Design

### Endpoints Utama — Absensi Pesantren

**Santri**
- `GET /api/santri` — List santri (dengan filter kelas, pencarian)
- `POST /api/santri` — Tambah santri
- `GET /api/santri/:id` — Detail santri
- `PUT /api/santri/:id` — Update santri
- `DELETE /api/santri/:id` — Hapus santri (soft delete)

**Kelas**
- `GET /api/kelas` — List kelas
- `POST /api/kelas` — Tambah kelas
- `PUT /api/kelas/:id` — Update kelas

**Ustadz**
- `GET /api/ustadz` — List ustadz
- `POST /api/ustadz` — Tambah ustadz

**Jadwal**
- `GET /api/jadwal` — List jadwal (filter ustadz, kelas, hari)
- `POST /api/jadwal` — Buat jadwal

**Absensi**
- `GET /api/absensi?kelas=X&jadwal=Y&tanggal=Z` — Daftar absensi
- `POST /api/absensi` — Simpan absensi (batch per kelas)
- `PUT /api/absensi/:id` — Edit status absensi
- `GET /api/laporan/absensi/harian` — Laporan harian
- `GET /api/laporan/absensi/bulanan` — Laporan bulanan

## Error Handling

- Gunakan pola error handling yang sudah ada di source code
- Return status codes yang sesuai (200, 201, 400, 401, 403, 404, 500)
- Error response format: `{ success: false, message: string, errors?: any }`

## Middleware / Guard

- 🔍 Deteksi middleware auth yang digunakan
- Middleware harus cek role user untuk akses endpoint tertentu
- Admin bisa akses semua endpoint
- Ustadz hanya bisa akses kelas yang dia ajar
- Santri/wali hanya bisa lihat data sendiri
