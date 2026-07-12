# PRD: Web Absensi Pesantren — Sistem Absensi Digital Pondok Pesantren

> **Status:** Draft
> **Last updated:** {{ CURRENT_DATE }}

---

## Problem Statement

Pondok pesantren di Indonesia masih banyak yang mencatat absensi santri secara manual menggunakan buku besar. Cara ini rentan terhadap kesalahan, kehilangan data, sulit direkapitulasi, dan tidak praktis untuk pesantren dengan jumlah santri ratusan hingga ribuan. Orang tua/wali santri juga kesulitan memantau kehadiran anaknya secara real-time.

**Target users:** Pondok pesantren di Indonesia (pengurus/ admin, ustadz/ustadzah, santri, wali santri)

---

## Solution

**Web Absensi Pesantren** adalah aplikasi web untuk digitalisasi absensi pondok pesantren:
1. Platform absensi digital yang menggantikan buku absensi manual
2. Manajemen data santri, ustadz, kelas, dan mata pelajaran secara terpusat
3. Generate laporan absensi harian, bulanan, dan periodik otomatis
4. Dashboard real-time dengan statistik kehadiran
5. Portal untuk wali santri memantau absensi anaknya

---

## User Stories

### Manajemen Data Master
1. Sebagai **admin**, saya ingin **mendaftarkan santri baru dengan data lengkap**, sehingga data santri tercatat dengan rapi
2. Sebagai **admin**, saya ingin **mengelompokkan santri ke dalam kelas/tingkatan**, sehingga absensi bisa dilakukan per kelas
3. Sebagai **admin**, saya ingin **mendaftarkan ustadz/ustadzah**, sehingga mereka bisa melakukan absensi
4. Sebagai **admin**, saya ingin **mengelola data mata pelajaran**, sehingga jadwal bisa dibuat

### Jadwal & Absensi
5. Sebagai **admin/ustadz**, saya ingin **membuat jadwal mengajar** (ustadz + mapel + kelas + jam), sehingga kegiatan belajar terstruktur
6. Sebagai **ustadz**, saya ingin **melakukan absensi per kelas per mata pelajaran**, sehingga kehadiran santri tercatat
7. Sebagai **ustadz**, saya ingin **menandai status kehadiran** (Hadir/Sakit/Izin/Alpa), sehingga laporan akurat

### Laporan & Monitoring
8. Sebagai **admin**, saya ingin **melihat laporan absensi harian**, sehingga bisa memonitor kehadiran hari ini
9. Sebagai **admin**, saya ingin **mendapatkan rekap absensi bulanan per santri/kelas**, sehingga bisa evaluasi periodik
10. Sebagai **wali santri**, saya ingin **melihat absensi anak saya**, sehingga bisa memantau kehadirannya

### Dashboard
11. Sebagai **admin**, saya ingin **melihat dashboard statistik kehadiran**, sehingga dapat gambaran cepat
12. Sebagai **ustadz**, saya ingin **melihat jadwal mengajar saya di dashboard**, sehingga tidak lupa jadwal

---

## Features

### Category: Manajemen Data Master

| ID | Feature | Priority | Effort | Dependencies |
|----|---------|----------|--------|-------------|
| F1 | CRUD Santri dengan data lengkap (NIS, nama, kelas, alamat, wali) | P0 | Medium | Database schema |
| F2 | CRUD Kelas/Tingkatan (kelas 1-6, tingkat A/B/C, dll) | P0 | Small | - |
| F3 | CRUD Ustadz/Ustadzah | P0 | Small | - |
| F4 | CRUD Mata Pelajaran | P0 | Small | - |
| F5 | CRUD Wali Santri (link ke santri) | P1 | Medium | F1 |

### Category: Jadwal & Absensi

| ID | Feature | Priority | Effort | Dependencies |
|----|---------|----------|--------|-------------|
| F6 | Manajemen Jadwal (ustadz + mapel + kelas + hari + jam) | P0 | Medium | F2, F3, F4 |
| F7 | Absensi Harian — pilih jadwal → daftar santri → tandai hadir | P0 | Large | F6 |
| F8 | Absensi QR Code (scan NIS untuk absensi cepat) | P2 | Large | F1 |
| F9 | Edit absensi yang sudah tersimpan | P1 | Small | F7 |

### Category: Laporan & Ekspor

| ID | Feature | Priority | Effort | Dependencies |
|----|---------|----------|--------|-------------|
| F10 | Laporan absensi harian per kelas | P0 | Medium | F7 |
| F11 | Rekap absensi bulanan per santri | P0 | Medium | F7 |
| F12 | Rekap absensi bulanan per kelas | P1 | Small | F11 |
| F13 | Ekspor laporan ke PDF/Excel | P1 | Medium | F10, F11 |
| F14 | Grafik tren kehadiran | P2 | Medium | F7 |

### Category: Dashboard & Otentikasi

| ID | Feature | Priority | Effort | Dependencies |
|----|---------|----------|--------|-------------|
| F15 | Login dengan multi-role (Admin, Ustadz, Santri, Wali) | P0 | Medium | - |
| F16 | Dashboard admin (statistik, santri baru, absensi hari ini) | P0 | Medium | F7, F1 |
| F17 | Dashboard ustadz (jadwal saya, kelas saya) | P0 | Medium | F6 |
| F18 | Portal wali santri (lihat absensi anak) | P1 | Medium | F5, F7 |

---

## Supported Entity Types

| Entitas | Atribut Kunci | Status |
|---------|---------------|--------|
| Santri | NIS, Nama, Kelas, Alamat, No Telp Wali | Aktif/Alumni |
| Ustadz | NIP, Nama, Kontak, Bidang | Aktif/Tidak Aktif |
| Kelas | Nama Kelas, Tingkat, Wali Kelas | Aktif |
| Mata Pelajaran | Kode, Nama, Deskripsi | Aktif |
| Jadwal | Ustadz, Mapel, Kelas, Hari, Jam Masuk, Jam Keluar | Aktif |
| Absensi | Santri, Jadwal, Tanggal, Status (Hadir/Sakit/Izin/Alpa), Catatan | Tersimpan |
| Wali Santri | Nama, Kontak, Hubungan | Aktif |

---

## Implementation Decisions

### Tech Stack
> **⚠️ Stack teknologi tidak ditetapkan di sini. AI agent akan menganalisis source code yang ada untuk auto-detect stack aktual.**

- **Frontend**: 🔍 Auto-detect dari package.json
- **Backend**: 🔍 Auto-detect dari struktur project
- **Auth**: 🔍 Auto-detect dari dependencies
- **Database**: 🔍 Auto-detect dari file config/schema
- **UI Library**: 🔍 Auto-detect dari dependencies
- **Infrastructure**: 🔍 Auto-detect dari file deploy config

### Prinsip Arsitektur

```
🔍 [Frontend] → API Calls → [Backend API] → ORM → [Database]
       ↑                        ↑
  Auto-detect              Auto-detect
  framework                framework
```

---

## Implementation Phases

### Phase 1 — Foundation
**Goal:** Setup proyek, database, dan auth dasar

| # | Task | Area |
|---|------|------|
| 1.1 | Setup proyek dengan stack terdeteksi | Infra |
| 1.2 | Setup database dan ORM | Database |
| 1.3 | Implementasi auth multi-role | Backend |
| 1.4 | Layout dasar dan routing | Frontend |

**User stories delivered:** F15

### Phase 2 — Data Master
**Goal:** CRUD semua data master

| # | Task | Area |
|---|------|------|
| 2.1 | CRUD Santri | Frontend + Backend |
| 2.2 | CRUD Kelas | Frontend + Backend |
| 2.3 | CRUD Ustadz | Frontend + Backend |
| 2.4 | CRUD Mata Pelajaran | Frontend + Backend |
| 2.5 | CRUD Wali Santri | Frontend + Backend |

**User stories delivered:** F1, F2, F3, F4, F5

### Phase 3 — Absensi & Jadwal
**Goal:** Jadwal dan absensi berfungsi penuh

| # | Task | Area |
|---|------|------|
| 3.1 | Manajemen Jadwal | Frontend + Backend |
| 3.2 | Form Absensi Harian | Frontend + Backend |
| 3.3 | Edit absensi | Frontend + Backend |

**User stories delivered:** F5, F6, F7, F9

### Phase 4 — Laporan & Dashboard
**Goal:** Laporan dan dashboard

| # | Task | Area |
|---|------|------|
| 4.1 | Laporan harian per kelas | Backend + Frontend |
| 4.2 | Rekap bulanan per santri | Backend + Frontend |
| 4.3 | Dashboard admin | Frontend |
| 4.4 | Dashboard ustadz | Frontend |
| 4.5 | Portal wali santri | Frontend |

**User stories delivered:** F8, F10, F11, F12, F13, F14, F16, F17, F18

---

## Out of Scope (Phase 1)

- ✅ **QR Code absensi** — Phase 2 nanti
- ✅ **Ekspor PDF/Excel** — Phase 2 nanti
- ✅ **SMS/Email notification** — Phase 2 nanti
- ✅ **Integrasi dengan sistem pembayaran SPP** — tidak terkait
- ✅ **Aplikasi mobile native** — cukup PWA/responsive web

---

## Testing Strategy

- Unit test untuk logic absensi (status kehadiran, perhitungan persentase)
- Integration test untuk API endpoints
- E2E test untuk flow absensi harian

---

## Further Notes

- UI harus mobile-friendly karena ustadz sering absen dari HP
- Status kehadiran: Hadir, Sakit, Izin, Alpa
- Satu santri bisa ikut banyak mata pelajaran
- Absensi dicatat per jadwal (pertemuan), bukan per hari
- Data absensi tidak bisa dihapus, hanya bisa diedit (audit trail)
