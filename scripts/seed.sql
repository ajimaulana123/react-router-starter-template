-- Seed Data for Web Absensi Pesantren (Local D1)
-- Execute: wrangler d1 execute absensi-pesantren --local --file=./scripts/seed.sql

-- ====================
-- 1. Ustadz / Teachers
-- ====================
INSERT OR IGNORE INTO ustadz (id, nip, nama, kontak, bidang, status) VALUES
(1, 'UST001', 'Ahmad Fauzi, S.Pd.I', '081234567890', 'Tahfidz Quran', 'aktif'),
(2, 'UST002', 'Budi Santoso, Lc.', '081234567891', 'Fiqih', 'aktif'),
(3, 'UST003', 'Abdurrahman, S.Ag', '081234567892', 'Bahasa Arab', 'aktif'),
(4, 'UST004', 'Siti Aisyah, S.Pd', '081234567893', 'Tajwid', 'aktif'),
(5, 'UST005', 'Khadijah, M.Pd', '081234567894', 'Sejarah Islam', 'aktif');

-- ====================
-- 2. Kelas / Classes
-- ====================
INSERT OR IGNORE INTO kelas (id, nama_kelas, tingkat, wali_kelas_id) VALUES
(1, 'Kelas 1A', '1', 1),
(2, 'Kelas 1B', '1', 2),
(3, 'Kelas 2A', '2', 3),
(4, 'Kelas 2B', '2', 4),
(5, 'Kelas 3A', '3', 5);

-- ====================
-- 3. Santri / Students
-- ====================
INSERT OR IGNORE INTO santri (id, nis, nama, kelas_id, alamat, no_telp_wali, status) VALUES
(1, 'NIS001', 'Abdullah bin Umar', 1, 'Jl. Pesantren No. 1, Ponorogo', '081111111111', 'aktif'),
(2, 'NIS002', 'Aminah binti Hasan', 1, 'Jl. Pesantren No. 2, Ponorogo', '081111111112', 'aktif'),
(3, 'NIS003', 'Bilal bin Rabah', 1, 'Jl. Pesantren No. 3, Madiun', '081111111113', 'aktif'),
(4, 'NIS004', 'Fatimah binti Muhammad', 2, 'Jl. Pesantren No. 4, Ponorogo', '081111111114', 'aktif'),
(5, 'NIS005', 'Hasan bin Ali', 2, 'Jl. Pesantren No. 5, Trenggalek', '081111111115', 'aktif'),
(6, 'NIS006', 'Husain bin Ali', 2, 'Jl. Pesantren No. 6, Trenggalek', '081111111116', 'aktif'),
(7, 'NIS007', 'Aisyah binti Abu Bakar', 3, 'Jl. Pesantren No. 7, Ponorogo', '081111111117', 'aktif'),
(8, 'NIS008', 'Umar bin Khattab', 3, 'Jl. Pesantren No. 8, Magetan', '081111111118', 'aktif'),
(9, 'NIS009', 'Khalid bin Walid', 3, 'Jl. Pesantren No. 9, Ngawi', '081111111119', 'aktif'),
(10, 'NIS010', 'Maryam binti Imran', 4, 'Jl. Pesantren No. 10, Ponorogo', '081111111110', 'aktif'),
(11, 'NIS011', 'Musa bin Imran', 4, 'Jl. Pesantren No. 11, Madiun', '081111111121', 'aktif'),
(12, 'NIS012', 'Sulaiman bin Daud', 5, 'Jl. Pesantren No. 12, Ponorogo', '081111111122', 'aktif'),
(13, 'NIS013', 'Yusuf bin Yaqub', 5, 'Jl. Pesantren No. 13, Ponorogo', '081111111123', 'aktif'),
(14, 'NIS014', 'Zainab binti Jahsy', 5, 'Jl. Pesantren No. 14, Pacitan', '081111111124', 'aktif'),
(15, 'NIS015', 'Ibrahim bin Azar', 5, 'Jl. Pesantren No. 15, Ponorogo', '081111111125', 'aktif');

-- ====================
-- 4. Mata Pelajaran / Subjects
-- ====================
INSERT OR IGNORE INTO mata_pelajaran (id, kode, nama, deskripsi) VALUES
(1, 'MP001', 'Tahfidz Quran', 'Menghafal dan memahami Al-Quran'),
(2, 'MP002', 'Fiqih', 'Ilmu hukum Islam dan ibadah praktis'),
(3, 'MP003', 'Bahasa Arab', 'Tata bahasa dan percakapan bahasa Arab'),
(4, 'MP004', 'Tajwid', 'Ilmu membaca Al-Quran dengan baik dan benar'),
(5, 'MP005', 'Sejarah Islam', 'Tarikh dan peradaban Islam'),
(6, 'MP006', 'Aqidah', 'Ilmu keimanan dan tauhid'),
(7, 'MP007', 'Akhlak', 'Ilmu budi pekerti dan adab Islami'),
(8, 'MP008', 'Nahwu Shorof', 'Tata bahasa Arab tingkat lanjut');

-- ====================
-- 5. Jadwal / Schedule
-- ====================
INSERT OR IGNORE INTO jadwal (id, ustadz_id, mapel_id, kelas_id, hari, jam_masuk, jam_keluar) VALUES
-- Kelas 1A - Senin
(1, 1, 1, 1, 'Senin', '08:00', '09:30'),
(2, 2, 2, 1, 'Senin', '09:45', '11:15'),
-- Kelas 1A - Selasa
(3, 3, 3, 1, 'Selasa', '08:00', '09:30'),
(4, 4, 4, 1, 'Selasa', '09:45', '11:15'),
-- Kelas 1A - Rabu
(5, 1, 1, 1, 'Rabu', '08:00', '09:30'),
(6, 5, 5, 1, 'Rabu', '09:45', '11:15'),
-- Kelas 1A - Kamis
(7, 4, 4, 1, 'Kamis', '08:00', '09:30'),
(8, 2, 2, 1, 'Kamis', '09:45', '11:15'),
-- Kelas 1B - Senin
(9, 3, 3, 2, 'Senin', '08:00', '09:30'),
(10, 2, 2, 2, 'Senin', '09:45', '11:15'),
-- Kelas 1B - Selasa
(11, 1, 1, 2, 'Selasa', '08:00', '09:30'),
(12, 4, 4, 2, 'Selasa', '09:45', '11:15'),
-- Kelas 2A - Senin
(13, 5, 5, 3, 'Senin', '08:00', '09:30'),
(14, 1, 1, 3, 'Senin', '09:45', '11:15'),
-- Kelas 2A - Selasa
(15, 4, 4, 3, 'Selasa', '08:00', '09:30'),
(16, 3, 3, 3, 'Selasa', '09:45', '11:15'),
-- Kelas 2A - Rabu
(17, 2, 2, 3, 'Rabu', '08:00', '09:30'),
(18, 5, 5, 3, 'Rabu', '09:45', '11:15'),
-- Kelas 2B - Senin
(19, 3, 3, 4, 'Senin', '10:00', '11:30'),
(20, 4, 4, 4, 'Selasa', '10:00', '11:30'),
-- Kelas 3A - Senin
(21, 2, 2, 5, 'Senin', '08:00', '09:30'),
(22, 5, 5, 5, 'Senin', '09:45', '11:15'),
-- Kelas 3A - Selasa
(23, 1, 1, 5, 'Selasa', '08:00', '09:30'),
(24, 3, 3, 5, 'Selasa', '09:45', '11:15'),
-- Kelas 3A - Rabu
(25, 4, 4, 5, 'Rabu', '08:00', '09:30'),
(26, 2, 2, 5, 'Rabu', '09:45', '11:15'),
-- Kelas 3A - Kamis
(27, 5, 5, 5, 'Kamis', '08:00', '09:30'),
(28, 1, 1, 5, 'Kamis', '09:45', '11:15'),
-- Jumat (jadwal pendek)
(29, 2, 2, 5, 'Jumat', '08:00', '09:00'),
(30, 3, 3, 1, 'Jumat', '08:00', '09:00');

-- ====================
-- 6. Users (password akan di-set saat pertama login)
-- ====================
INSERT OR IGNORE INTO users (id, username, email, password_hash, role) VALUES
(1, 'admin', 'admin@pesantren.local', '', 'admin');

-- Verifikasi
SELECT '=== SEED DATA BERHASIL ===' as info;
SELECT COUNT(*) as total_ustadz FROM ustadz;
SELECT COUNT(*) as total_santri FROM santri;
SELECT COUNT(*) as total_kelas FROM kelas;
SELECT COUNT(*) as total_mapel FROM mata_pelajaran;
SELECT COUNT(*) as total_jadwal FROM jadwal;
SELECT COUNT(*) as total_users FROM users;
