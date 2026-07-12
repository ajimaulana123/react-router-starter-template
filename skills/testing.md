---
name: testing
description: Testing conventions — test patterns untuk absensi pesantren
---

# Testing Conventions — Web Absensi Pesantren

## Test Runner

> 🔍 **Auto-detect dari source code:** Cek `package.json` untuk test runner (vitest, jest, mocha, dll)

## Test Patterns — Absensi Pesantren

### Unit Tests
- Logic status absensi (Hadir/Sakit/Izin/Alpa)
- Perhitungan persentase kehadiran
- Filter dan sorting data santri
- Validasi input form

### Integration Tests
- API endpoints absensi
- CRUD santri dengan database test
- Flow absensi: buat jadwal → absen → lihat laporan

### Test Structure
```
🔍 Auto-detect dari file test yang sudah ada
```

## DO NOT

- ❌ Test implementation details
- ❌ Pake network calls beneran di unit test
- ❌ Hardcode token/secrets di test files
