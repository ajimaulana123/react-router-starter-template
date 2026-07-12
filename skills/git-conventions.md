---
name: git-conventions
description: Git workflow, branching strategy, commit conventions untuk Web Absensi Pesantren
---

# Git Conventions — Web Absensi Pesantren

## Branch Strategy

- **Main branch:** `main` — production-ready code
- **Development branch:** `develop` — integration branch
- **Feature branches:** `feature/fitur-absensi` — branched from `develop`
- **Fix branches:** `fix/perbaikan-absensi` — branched from `develop`
- **Release branches:** `release/v1.0.0`

## Commit Message Format

```
type(scope): deskripsi singkat

Contoh:
feat(absensi): tambah form absensi harian
fix(santri): perbaiki validasi NIS duplikat
feat(laporan): export rekap bulanan ke PDF
refactor(database): ubah schema absensi
```

## DO NOT

- ❌ Commit langsung ke `main` atau `develop`
- ❌ Gunakan `git push --force` di branch shared
- ❌ Campur perubahan besar dalam satu commit
- ❌ Commit file generated (dist/, node_modules/, .env)
