---
name: api-integration
description: API integration patterns — data fetching untuk absensi pesantren, caching, error handling
---

# API Integration — Web Absensi Pesantren

## Stack

> 🔍 **Auto-detect dari source code:**
> - Client fetcher (fetch, axios, ky, wretch, dll)
> - Data fetching library (tanstack-query, swr, rtk-query, dll)
> - API layer (tRPC, REST, GraphQL)

## Data Fetching Patterns

### Query Absensi — Get daftar absensi per kelas

```
🔍 Auto-detect query pattern dari source code yang ada
Contoh endpoint: GET /api/absensi?kelasId=1&jadwalId=5&tanggal=2026-01-15
```

### Mutation — Simpan absensi (batch)

```
🔍 Auto-detect mutation pattern dari source code
Contoh endpoint: POST /api/absensi
Body: { data: [{ santriId, status, catatan }] }
```

## Error Handling

- Handle error states: network error, validation error, auth error
- Tampilkan pesan error yang jelas dalam Bahasa Indonesia
- Retry logic untuk network error

## Caching

- 🔍 Auto-detect caching strategy dari source code
- Data master (santri, kelas) bisa cache lebih lama
- Data absensi harus fresh (invalidate setelah absen)
