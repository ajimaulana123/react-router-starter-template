---
name: frontend-conventions
description: Frontend conventions — komponen absensi pesantren, routing, state management, styling
---

# Frontend Conventions — Web Absensi Pesantren

## Stack Overview

> 🔍 **Auto-detect dari source code.** Cek `package.json`, `tsconfig.json`, file konfigurasi:
> - Framework (React, Vue, Next.js, Nuxt, SvelteKit, dll)
> - Routing (file-based, react-router, vue-router, dll)
> - State management (zustand, redux, pinia, tanstack-query, dll)
> - Styling (Tailwind, CSS Modules, styled-components, dll)
> - UI Library (shadcn/ui, DaisyUI, Material UI, Chakra, dll)

## Component Architecture

- Satu komponen per file
- Gunakan named exports
- 🔍 Deteksi struktur folder dari source code

## Halaman Utama — Absensi Pesantren

| Halaman | Route | Akses |
|---------|-------|-------|
| Login | `/login` | Semua |
| Dashboard | `/` | Semua (isi beda per role) |
| Data Santri | `/santri` | Admin |
| Data Kelas | `/kelas` | Admin |
| Data Ustadz | `/ustadz` | Admin |
| Jadwal | `/jadwal` | Admin, Ustadz |
| Absensi | `/absensi` | Ustadz, Admin |
| Laporan | `/laporan` | Admin, Ustadz |
| Profil Santri | `/santri/:id` | Admin, Ustadz |
| Portal Wali | `/wali` | Wali Santri |

## Styling

- 🔍 Deteksi styling approach dari file konfigurasi
- Jika pakai Tailwind: gunakan utility classes, jangan buat CSS kustom kecuali perlu
- Referensi `DESIGN.md` untuk warna dan spacing
- Warna hijau primary: `#0D6B3E`

## DO NOT

- ❌ Jangan buat komponen dari nol jika ada dari UI library yang terdeteksi
- ❌ Jangan override warna dengan nilai mentah — gunakan design tokens
- ❌ Jangan skip error/loading states
