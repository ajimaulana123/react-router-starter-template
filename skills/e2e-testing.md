---
name: e2e-testing
description: End-to-end testing scenarios untuk semua halaman Web Absensi Pesantren
---

# 🎯 E2E Testing — Web Absensi Pesantren

> End-to-end testing untuk semua halaman menggunakan browser-use agent.
> Base URL: `https://web-absensi-pesantren.aji658911.workers.dev`

## 🔐 Test Setup

Sebelum memulai E2E test, pastikan:
1. Aplikasi sudah di-`deploy` ke Cloudflare
2. Database remote sudah di-seed dengan data contoh
3. Login credentials: `admin` / `admin123`

---

## 1. 📝 Halaman Login (`/login`)

### Test 1.1: Login Berhasil
```typescript
// Browser Use Prompt:
"Navigate to {BASE_URL}/login. 
 1. Check that the login page loads with title 'Masuk — Web Absensi Pesantren'
 2. Fill username field with 'admin'
 3. Fill password field with 'admin123'
 4. Click the 'Masuk' button
 5. Verify redirect to /dashboard
 6. Check that dashboard shows 'Dashboard' heading and stat cards"
```

### Test 1.2: Login Gagal
```typescript
"Navigate to {BASE_URL}/login.
 1. Fill username with 'admin'
 2. Fill password with 'salahpassword'
 3. Click 'Masuk'
 4. Verify error message appears: 'Username atau password salah'
 5. Check that we stay on /login page"
```

### Test 1.3: Validasi Form Kosong
```typescript
"Navigate to {BASE_URL}/login.
 1. Click 'Masuk' without filling anything
 2. Check that browser shows required field validation"
```

---

## 2. 📊 Halaman Dashboard Admin (`/dashboard`)

### Test 2.1: Dashboard Memuat dengan Benar
```typescript
"Already logged in as admin. Navigate to /dashboard.
 1. Check page title is 'Dashboard — Web Absensi Pesantren'
 2. Verify 4 stat cards are visible: Total Santri, Total Ustadz, Total Kelas, Mata Pelajaran
 3. Check 'Absensi Hari Ini' section shows 3 metrics (Total, Hadir, %)
 4. Verify 'Absensi Terbaru' section shows recent attendance records or empty state"
```

### Test 2.2: Tanggal Tampil dengan Format Indonesia
```typescript
"Already logged in as admin. Navigate to /dashboard.
 1. Check that date is displayed in Indonesian format (e.g., 'Senin, 12 Juli 2026')
 2. Verify greeting message includes admin username"
```

---

## 3. 👨‍🎓 Halaman CRUD Santri (`/santri`)

### Test 3.1: Tabel Santri Tampil
```typescript
"Already logged in as admin. Navigate to /santri.
 1. Check page title is 'Data Santri — Web Absensi Pesantren'
 2. Verify table shows columns: No, NIS, Nama, Kelas, Alamat, Status, Aksi
 3. Check that seed data appears (15 santri from seed)
 4. Verify search input is visible"
```

### Test 3.2: Tambah Santri Baru
```typescript
"Already logged in as admin. Navigate to /santri.
 1. Click '+ Tambah Santri' button
 2. Verify modal opens with title 'Tambah Santri Baru'
 3. Fill in all fields:
    - NIS: 'E2E001'
    - Nama Lengkap: 'Santri E2E Test'
    - Kelas: select 'Kelas 1A'
    - Status: 'Aktif'
    - Alamat: 'Jl. E2E Testing No. 1'
 4. Click 'Tambah Santri' button (not 'Batal')
 5. Wait for modal to close automatically
 6. Verify the new santri appears in the table
 7. Check that search 'E2E001' finds the new santri"
```

### Test 3.3: Edit Santri
```typescript
"Already logged in as admin. Navigate to /santri.
 1. Find santri with NIS 'E2E001' in the table
 2. Click the edit button (✏️) for that santri
 3. Verify modal opens with title 'Edit Santri'
 4. Change Nama to 'Santri E2E Updated'
 5. Click 'Simpan Perubahan'
 6. Wait for modal to close
 7. Verify the santri name is updated in the table"
```

### Test 3.4: Hapus Santri
```typescript
"Already logged in as admin. Navigate to /santri.
 1. Find santri with NIS 'E2E001' in the table
 2. Click the delete button (🗑️) for that santri
 3. Verify confirmation modal appears: 'Apakah Anda yakin ingin menghapus...'
 4. Click 'Ya, Hapus'
 5. Wait for modal to close
 6. Verify the santri is removed from the table
 7. Search 'E2E001' to confirm it's gone"
```

### Test 3.5: Search Santri
```typescript
"Already logged in as admin. Navigate to /santri.
 1. Type 'Abdullah' in search box
 2. Verify only matching santri are shown
 3. Clear search
 4. Type 'NIS001' in search box
 5. Verify santri with that NIS appears"
```

---

## 4. 👨‍🏫 Halaman CRUD Ustadz (`/ustadz`)

### Test 4.1: Tabel Ustadz Tampil
```typescript
"Already logged in as admin. Navigate to /ustadz.
 1. Check page title 'Data Ustadz — Web Absensi Pesantren'
 2. Verify 5 ustadz from seed are visible
 3. Check columns: No, NIP, Nama, Kontak, Bidang, Status, Aksi"
```

### Test 4.2: Tambah Ustadz
```typescript
"Already logged in as admin. Navigate to /ustadz.
 1. Click '+ Tambah Ustadz'
 2. Fill: NIP='E2E001', Nama='Ustadz E2E', Kontak='081234567899', Bidang='Testing'
 3. Click 'Tambah'
 4. Verify new ustadz appears in table"
```

### Test 4.3: Edit & Hapus Ustadz
```typescript
"Already logged in as admin. Navigate to /ustadz.
 1. Edit the newly created ustadz - change name to 'Ustadz E2E Updated'
 2. Verify update
 3. Delete the ustadz
 4. Verify removal"
```

---

## 5. 🏫 Halaman CRUD Kelas (`/kelas`)

### Test 5.1: Tabel Kelas Tampil
```typescript
"Already logged in as admin. Navigate to /kelas.
 1. Check page title 'Data Kelas — Web Absensi Pesantren'
 2. Verify 5 kelas from seed are visible
 3. Check columns: No, Nama Kelas, Tingkat, Wali Kelas, Jumlah Santri, Aksi
 4. Verify each kelas shows correct jumlah_santri count"
```

### Test 5.2: Tambah Kelas
```typescript
"Already logged in as admin. Navigate to /kelas.
 1. Click '+ Tambah Kelas'
 2. Fill: Nama Kelas='Kelas E2E', Tingkat='E2E', Wali Kelas=select first ustadz
 3. Click 'Tambah'
 4. Verify new kelas appears"
```

---

## 6. 📖 Halaman CRUD Mata Pelajaran (`/mapel`)

### Test 6.1: Tabel Mapel Tampil
```typescript
"Already logged in as admin. Navigate to /mapel.
 1. Check page title 'Mata Pelajaran — Web Absensi Pesantren'
 2. Verify 8 mapel from seed are visible
 3. Check columns: No, Kode, Nama, Deskripsi, Aksi"
```

### Test 6.2: CRUD Lengkap Mapel
```typescript
"Already logged in as admin. Navigate to /mapel.
 1. Create: Kode='E2E01', Nama='Mapel E2E Test', Deskripsi='Test'
 2. Edit: change name to 'Mapel E2E Updated'
 3. Delete the mapel
 4. Verify all operations succeed"
```

---

## 7. 👪 Halaman CRUD Wali Santri (`/wali`)

### Test 7.1: Tabel Wali Tampil
```typescript
"Already logged in as admin. Navigate to /wali.
 1. Check page title 'Wali Santri — Web Absensi Pesantren'
 2. Verify table columns: No, Nama Wali, Kontak, Hubungan, Santri, Aksi
 3. Check search input is present"
```

### Test 7.2: Tambah Wali Santri
```typescript
"Already logged in as admin. Navigate to /wali.
 1. Click '+ Tambah Wali'
 2. Fill: Nama='Wali E2E Test', Kontak='081234567800', Hubungan='Ayah'
 3. Select santri: choose 'Abdullah bin Umar'
 4. Click 'Tambah'
 5. Verify new wali appears in table
 6. Verify the wali's santri name is displayed correctly"
```

### Test 7.3: Edit & Hapus Wali
```typescript
"Already logged in as admin. Navigate to /wali.
 1. Edit the newly created wali - change hubungan to 'Ibu'
 2. Verify update
 3. Delete the wali
 4. Verify removal"
```

---

## 8. 📅 Halaman Jadwal (`/jadwal`)

### Test 8.1: Jadwal Tampil per Hari
```typescript
"Already logged in as admin. Navigate to /jadwal.
 1. Check page title 'Jadwal — Web Absensi Pesantren'
 2. Verify filter buttons for each day: Semua, Senin, Selasa, Rabu, Kamis, Jumat, Sabtu, Ahad
 3. Click 'Senin' filter
 4. Verify only Monday schedules are shown
 5. Click 'Semua' to reset"
```

### Test 8.2: Tambah Jadwal Baru
```typescript
"Already logged in as admin. Navigate to /jadwal.
 1. Click '+ Tambah Jadwal'
 2. Fill form:
    - Ustadz: select 'Ahmad Fauzi'
    - Mata Pelajaran: select 'Tahfidz Quran'
    - Kelas: select 'Kelas 1A'
    - Hari: select 'Senin'
    - Jam Masuk: '07:00'
    - Jam Keluar: '07:45'
 3. Click 'Tambah'
 4. Verify new jadwal appears under 'Senin' section"
```

### Test 8.3: Hapus Jadwal
```typescript
"Already logged in as admin. Navigate to /jadwal.
 1. Find the newly created jadwal
 2. Click delete (🗑️)
 3. Confirm deletion
 4. Verify jadwal is removed"
```

---

## 9. ✅ Halaman Absensi (`/absensi`)

### Test 9.1: Form Absensi Tampil
```typescript
"Already logged in as admin. Navigate to /absensi.
 1. Check page title 'Absensi — Web Absensi Pesantren'
 2. Verify 'Pilih Jadwal' dropdown is present
 3. Verify 'Tanggal' date input is present (defaults to today)
 4. Check empty state: 'Pilih jadwal untuk memulai absensi'"
```

### Test 9.2: Absensi via Pilih Jadwal
```typescript
"Already logged in as admin. Navigate to /absensi.
 1. Select a jadwal from dropdown (e.g., 'Tahfidz Quran — Kelas 1A')
 2. Wait for santri list to load
 3. Verify santri names from that class appear
 4. For each santri, check that radio buttons exist: Hadir, Sakit, Izin, Alpa
 5. Change one santri to 'Sakit'
 6. Change another santri to 'Izin'
 7. Click '💾 Simpan Absensi'
 8. Wait for success indicator"
```

### Test 9.3: Edit Absensi yang Sudah Ada
```typescript
"Already logged in as admin. Navigate to /absensi.
 1. Select the same jadwal and tanggal as Test 9.2
 2. Verify previous status selections are loaded (Sakit, Izin)
 3. Change 'Sakit' to 'Hadir'
 4. Click '💾 Simpan Absensi'
 5. Verify save succeeds"
```

### Test 9.4: Shortcut via Query Param (dari Dashboard Ustadz)
```typescript
"Already logged in as admin. Navigate to /absensi?jadwal_id=1.
 1. Verify that jadwal is auto-selected based on query param
 2. Check that santri list loads automatically
 3. Verify the correct jadwal is shown in the header"
```

---

## 10. 📋 Halaman Laporan (`/laporan`)

### Test 10.1: Tab Laporan Harian
```typescript
"Already logged in as admin. Navigate to /laporan.
 1. Check page title 'Laporan — Web Absensi Pesantren'
 2. Verify two tabs: '📋 Laporan Harian' and '📊 Rekap Bulanan'
 3. 'Laporan Harian' tab should be active by default
 4. Verify form fields: Tanggal (date), Kelas (dropdown)
 5. Select today's date and 'Semua Kelas'
 6. Click '🔍 Tampilkan'
 7. Wait for results table to load
 8. Verify table shows: Kelas, Total Santri, Hadir, Sakit, Izin, Alpa, % Kehadiran"
```

### Test 10.2: Tab Rekap Bulanan
```typescript
"Already logged in as admin. Navigate to /laporan.
 1. Click '📊 Rekap Bulanan' tab
 2. Verify form fields: Bulan (month), Kelas (dropdown)
 3. Select current month and 'Semua Kelas'
 4. Click '🔍 Tampilkan'
 5. Wait for results table
 6. Verify table shows: NIS, Nama Santri, Kelas, Total, Hadir, Sakit, Izin, Alpa, %"
```

---

## 11. 👨‍🏫 Dashboard Ustadz (`/dashboard/ustadz`)

### Test 11.1: Dashboard Ustadz Tampil
```typescript
"Already logged in as admin. Navigate to /dashboard/ustadz.
 1. Check page title 'Dashboard — Ustadz | Web Absensi Pesantren'
 2. Verify greeting shows ustadz name
 3. Check stat cards: Total Jadwal, Mata Pelajaran, Kelas Diajar
 4. Verify 'Jadwal Hari Ini' section
 5. Verify 'Semua Jadwal Mengajar' section grouped by day"
```

### Test 11.2: Link Absensi dari Dashboard Ustadz
```typescript
"Already logged in as admin. Navigate to /dashboard/ustadz.
 1. In 'Jadwal Hari Ini' section, find a '✅ Lakukan Absensi' link
 2. Click the link
 3. Verify redirect to /absensi?jadwal_id=X with correct jadwal pre-selected"
```

---

## 12. 👪 Portal Wali Santri (`/portal-wali`)

### Test 12.1: Portal Wali - Belum Terhubung
```typescript
"Log in as wali user who has no santri linked.
 Navigate to /portal-wali.
 1. Verify info card shows wali name
 2. Check empty state: 'Belum terhubung dengan santri'
 3. Verify 'Hubungi admin' message"
```

### Test 12.2: Portal Wali - Lihat Absensi
```typescript
"Log in as wali user who has santri linked.
 Navigate to /portal-wali.
 1. Verify welcome message
 2. Check info card shows 'Terdaftar sebagai wali dari N santri'
 3. Toggle between 'Harian' and 'Bulanan' views
 4. Select a date/month
 5. Click '🔍 Lihat'
 6. If data exists, verify absensi records are displayed with status badges"
```

---

## 13. 🚪 Logout

### Test 13.1: Logout dari Sidebar
```typescript
"Already logged in as admin. On any page with sidebar:
 1. Click '🚪 Keluar' button at bottom of sidebar
 2. Verify redirect to /login page
 3. Try navigating to /dashboard directly
 4. Verify redirect back to /login (unauthenticated)"
```

---

## 14. ⚠️ Error & Edge Cases

### Test 14.1: 404 Page
```typescript
"Navigate to {BASE_URL}/halaman-tidak-ada.
 1. Verify error page shows 'Halaman tidak ditemukan'
 2. Check 'Kembali ke Dashboard' button is present
 3. Click the button
 4. Verify redirect to /login (unauthenticated) or /dashboard"
```

### Test 14.2: Unauthorized Access
```typescript
"Log in as admin. Try navigating to /dashboard/ustadz.
 (Admin can access this, so this should work - just for demo)
 
 Log in as ustadz. Try navigating to /santri.
 Verify 403 error or redirect"
```

### Test 14.3: Duplicate NIS Error
```typescript
"Already logged in as admin. Navigate to /santri.
 1. Click '+ Tambah Santri'
 2. Fill with existing NIS: 'NIS001'
 3. Click 'Tambah'
 4. Wait - should either show error or silently handle duplicate"
```

---

## 📋 Test Checklist (Cepat)

Gunakan checklist ini untuk smoke test manual setelah deploy:

- [ ] Login dengan admin/admin123 berhasil
- [ ] Dashboard admin memuat dengan stat cards
- [ ] Tabel Santri menampilkan 15 santri
- [ ] Bisa tambah/edit/hapus santri
- [ ] Tabel Ustadz menampilkan 5 ustadz
- [ ] Bisa tambah/edit/hapus ustadz
- [ ] Tabel Kelas menampilkan 5 kelas
- [ ] Bisa tambah/edit/hapus kelas
- [ ] Tabel Mapel menampilkan 8 mapel
- [ ] Bisa tambah/edit/hapus mapel
- [ ] Tabel Wali menampilkan data (jika ada)
- [ ] Bisa tambah/edit/hapus wali
- [ ] Jadwal tampil per hari, filter berfungsi
- [ ] Bisa tambah/hapus jadwal
- [ ] Absensi: pilih jadwal → lihat santri → simpan
- [ ] Laporan harian menampilkan data
- [ ] Laporan bulanan menampilkan data
- [ ] Logout berfungsi
- [ ] 404 page muncul untuk route tidak dikenal

---

## 🚀 Menjalankan E2E Test

Untuk menjalankan E2E test, spawn browser-use agent dengan prompt dari test case di atas:

```typescript
// Contoh spawn agent untuk E2E test login:
spawn_agents([{
  agent_type: "browser-use",
  prompt: "...prompt dari Test 1.1...",
  params: { url: "https://web-absensi-pesantren.aji658911.workers.dev/login" }
}])
```

> **Catatan:** Tests di atas adalah **test scenario spec**, bukan test runner otomatis.
> Untuk fully automated E2E, perlu setup Playwright atau Cypress di project.
