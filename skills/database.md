---
name: database
description: Database conventions — schema absensi pesantren, migrasi, query patterns
---

# Database Conventions — Web Absensi Pesantren

## Stack

> 🔍 **Auto-detect dari source code.** Cek `package.json`, file config, dan file schema:
> - Database (PostgreSQL, MySQL, SQLite, MongoDB, dll)
> - ORM (Prisma, Drizzle, TypeORM, Mongoose, dll)
> - Migration tool

## Schema Design — Absensi Pesantren

### Entity Relationship

```
Santri ──┬──> Kelas
         ├──> WaliSantri
         └──> Absensi ──> Jadwal ──> Ustadz
                                    └──> MataPelajaran
```

### Entity Fields (Minimal)

**Santri**: `id`, `nis`, `nama`, `kelasId`, `alamat`, `noTelpWali`, `waliSantriId`, `status`, `createdAt`, `updatedAt`

**Ustadz**: `id`, `nip`, `nama`, `kontak`, `bidang`, `status`, `createdAt`

**Kelas**: `id`, `nama`, `tingkat`, `waliKelasId`, `createdAt`

**MataPelajaran**: `id`, `kode`, `nama`, `deskripsi`

**Jadwal**: `id`, `ustadzId`, `mapelId`, `kelasId`, `hari`, `jamMasuk`, `jamKeluar`

**Absensi**: `id`, `santriId`, `jadwalId`, `tanggal`, `status` (HADIR/SAKIT/IZIN/ALPA), `catatan`, `createdBy`, `createdAt`, `updatedAt`

**WaliSantri**: `id`, `nama`, `kontak`, `hubungan`, `createdAt`

## Indexes

- 🔍 Index pada `absensi(santriId, tanggal)` untuk query cepat
- 🔍 Index pada `absensi(jadwalId, tanggal)` 
- 🔍 Index pada `santri(kelasId)` untuk filter per kelas

## DO NOT

- ❌ Jangan hapus data absensi — gunakan soft delete atau status update
- ❌ Jangan cascade delete yang bisa menghapus data absensi
