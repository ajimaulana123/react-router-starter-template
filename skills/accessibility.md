---
name: accessibility
description: Accessibility best practices — ARIA, keyboard navigation, semantic HTML, screen readers
---

# Accessibility Conventions — Web Absensi Pesantren

## Standards

- Target: WCAG 2.1 Level AA
- Tools: 🔍 Auto-detect (axe-core, Lighthouse, eslint-plugin-jsx-a11y)
- Baseline: Semantic HTML, keyboard accessible

## Key Patterns

### Form Absensi
- Setiap status (Hadir/Sakit/Izin/Alpa) harus punya label yang jelas
- Radio button atau button group dengan `aria-label` yang deskriptif
- Focus management setelah submit

### Tabel Data
- Gunakan `<table>` dengan `<thead>`, `<tbody>`, `<th scope="col">`
- Untuk kartu di mobile, pastikan screen reader tetap bisa baca datanya
- Gunakan `aria-sort` untuk kolom yang bisa di-sort

### Status Badge
- Badge harus punya `aria-label` seperti "Status: Hadir"
- Warna tidak boleh jadi satu-satunya indikator (tambahkan teks atau ikon)

## DO NOT

- ❌ Pakai warna sebagai satu-satunya indikator status kehadiran
- ❌ Hilangkan focus outline tanpa alternatif
- ❌ Buat tombol/div tanpa proper ARIA role
