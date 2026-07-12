# Web Absensi Pesantren — Codebuff Instructions

> File ini untuk AI agent. Baca ini pertama sebelum membuat perubahan.

## Quick Facts

- **Nama:** Web Absensi Pesantren
- **Deskripsi:** Sistem absensi digital untuk pondok pesantren — manajemen santri, ustadz, kelas, absensi, dan laporan
- **Stack:** 🔍 Auto-detected dari source code yang ada (lihat `package.json`, `tsconfig.json`, file konfigurasi)
- **Domain:** Pondok Pesantren, Absensi, Manajemen Data

## File Structure

```
web-absensi-pesantren/
├── AGENTS.md         # Panduan AI agent lengkap (baca ini dulu!)
├── DESIGN.md         # Design system — hijau Islami, bersih, modern
├── PRD.md            # Product requirements — fitur absensi pesantren
├── .claude/
│   ├── instructions.md  # File ini
│   └── skills/          # Skill files untuk domain knowledge
└── ...
```

## Workflow Rules

1. **Baca `AGENTS.md`** sebelum membuat perubahan apa pun — berisi panduan lengkap
2. **Referensi `DESIGN.md`** saat membuat atau memodifikasi UI — gunakan warna hijau `#0D6B3E`
3. **Referensi `PRD.md`** untuk kebutuhan fitur dan scope — absensi pesantren
4. **Deteksi stack dari source code** — jangan asumsikan framework/library tertentu
5. **Ikuti konvensi** di `.claude/skills/*.md`

## Key Domain Knowledge

- **Entitas:** Santri, Ustadz, Kelas, Mata Pelajaran, Jadwal, Absensi
- **Status Absensi:** Hadir, Sakit, Izin, Alpa
- **Role:** Admin, Ustadz, Santri, Wali Santri
- **Flow:** Admin setup data → Ustadz absen → Laporan otomatis
