---
name: ui-components
description: UI component patterns — absensi pesantren design system, komposisi, aksesibilitas
---

# UI Component Patterns — Web Absensi Pesantren

## Design System

- **🔍 Auto-detect UI library** dari `package.json` (shadcn/ui, DaisyUI, MUI, Chakra, dll)
- **Warna Hijau Primary:** `#0D6B3E` — identitas Islami
- **Referensi:** `DESIGN.md` untuk full design tokens

## Komponen Khusus Absensi Pesantren

### AttendanceStatus Badge
```tsx
// Tampilkan status kehadiran dengan warna sesuai
// Hadir: hijau (#059669)
// Sakit: biru (#2563EB)
// Izin: kuning (#D97706)
// Alpa: merah (#DC2626)
```

### AttendanceTable
```tsx
// Tabel absensi dengan:
// - Kolom: No, NIS, Nama, Status (badge yang bisa diklik)
// - Header hijau #0D6B3E dengan text putih
// - Zebra striping
// - Responsive jadi kartu di mobile
```

### StudentCard
```tsx
// Kartu data santri dengan:
// - Avatar inisial lingkaran (warna random soft)
// - Nama, NIS, Kelas
// - Tombol aksi (edit, lihat detail)
```

### StatCard
```tsx
// Kartu statistik dashboard:
// - Ikon
// - Angka besar
// - Label (Total Santri, Hadir Hari Ini, dll)
// - Warna accent sesuai konteks
```

## Common Patterns

### Form Absensi — Batch Update
- Tampilkan daftar santri per kelas
- Setiap santri punya pilihan status (Hadir/Sakit/Izin/Alpa)
- Tombol "Simpan Semua" untuk batch save
- Loading state selama penyimpanan

### Filter Absensi
- Filter by kelas (dropdown)
- Filter by tanggal (date picker)
- Filter by jadwal/mata pelajaran

## DO NOT

- ❌ Buat komponen kustom jika sudah ada dari UI library
- ❌ Override warna dengan nilai mentah — pakai dari DESIGN.md
- ❌ Buat flow absensi yang rumit — harus 1-2 klik untuk absen
