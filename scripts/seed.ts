/**
 * Seed script for Web Absensi Pesantren
 * 
 * Run with: wrangler d1 execute absensi-pesantren --remote --file=./scripts/seed.sql
 */

// SQL Seed Data
const seedSQL = `
-- ====================
-- Seed Data for Web Absensi Pesantren
-- ====================

-- 1. Data Ustadz
INSERT OR IGNORE INTO ustadz (nip, nama, kontak, bidang) VALUES
('UST001', 'Ahmad Fauzi', '081234567890', 'Tahfidz'),
('UST002', 'Budi Santoso', '081234567891', 'Fiqih'),
('UST003', 'Abdurrahman', '081234567892', 'Bahasa Arab'),
('UST004', 'Siti Aisyah', '081234567893', 'Tajwid'),
('UST005', 'Khadijah', '081234567894', 'Sejarah Islam');

-- 2. Data Kelas
INSERT OR IGNORE INTO kelas (nama_kelas, tingkat, wali_kelas_id) VALUES
('Kelas 1A', '1', 1),
('Kelas 1B', '1', 2),
('Kelas 2A', '2', 3),
('Kelas 2B', '2', 4),
('Kelas 3A', '3', 5);

-- 3. Data Santri
INSERT OR IGNORE INTO santri (nis, nama, kelas_id, alamat, no_telp_wali, status) VALUES
('NIS001', 'Abdullah', 1, 'Jl. Pesantren No. 1', '081111111111', 'aktif'),
('NIS002', 'Aminah', 1, 'Jl. Pesantren No. 2', '081111111112', 'aktif'),
('NIS003', 'Bilal', 1, 'Jl. Pesantren No. 3', '081111111113', 'aktif'),
('NIS004', 'Fatimah', 2, 'Jl. Pesantren No. 4', '081111111114', 'aktif'),
('NIS005', 'Hasan', 2, 'Jl. Pesantren No. 5', '081111111115', 'aktif'),
('NIS006', 'Husain', 2, 'Jl. Pesantren No. 6', '081111111116', 'aktif'),
('NIS007', 'Aisyah Binti Abu Bakar', 3, 'Jl. Pesantren No. 7', '081111111117', 'aktif'),
('NIS008', 'Umar', 3, 'Jl. Pesantren No. 8', '081111111118', 'aktif'),
('NIS009', 'Khalid', 3, 'Jl. Pesantren No. 9', '081111111119', 'aktif'),
('NIS010', 'Maryam', 4, 'Jl. Pesantren No. 10', '081111111110', 'aktif'),
('NIS011', 'Musa', 4, 'Jl. Pesantren No. 11', '081111111121', 'aktif'),
('NIS012', 'Sulaiman', 5, 'Jl. Pesantren No. 12', '081111111122', 'aktif'),
('NIS013', 'Yusuf', 5, 'Jl. Pesantren No. 13', '081111111123', 'aktif'),
('NIS014', 'Zainab', 5, 'Jl. Pesantren No. 14', '081111111124', 'aktif'),
('NIS015', 'Ibrahim', 5, 'Jl. Pesantren No. 15', '081111111125', 'aktif');

-- 4. Data Mata Pelajaran
INSERT OR IGNORE INTO mata_pelajaran (kode, nama, deskripsi) VALUES
('MP001', 'Tahfidz Quran', 'Menghafal Al-Quran'),
('MP002', 'Fiqih', 'Ilmu Hukum Islam'),
('MP003', 'Bahasa Arab', 'Bahasa Al-Quran'),
('MP004', 'Tajwid', 'Ilmu Bacaan Al-Quran'),
('MP005', 'Sejarah Islam', 'Tarikh Islam'),
('MP006', 'Aqidah', 'Ilmu Keimanan'),
('MP007', 'Akhlak', 'Ilmu Budi Pekerti');

-- 5. Data Jadwal
INSERT OR IGNORE INTO jadwal (ustadz_id, mapel_id, kelas_id, hari, jam_masuk, jam_keluar) VALUES
(1, 1, 1, 'Senin', '08:00', '09:30'),
(1, 1, 1, 'Rabu', '08:00', '09:30'),
(2, 2, 1, 'Senin', '10:00', '11:30'),
(2, 2, 2, 'Selasa', '08:00', '09:30'),
(3, 3, 1, 'Selasa', '10:00', '11:30'),
(3, 3, 2, 'Senin', '08:00', '09:30'),
(4, 4, 1, 'Kamis', '08:00', '09:30'),
(4, 4, 2, 'Kamis', '10:00', '11:30'),
(5, 5, 3, 'Senin', '08:00', '09:30'),
(5, 5, 3, 'Rabu', '10:00', '11:30'),
(1, 1, 3, 'Selasa', '08:00', '09:30'),
(2, 2, 3, 'Kamis', '08:00', '09:30'),
(3, 3, 4, 'Senin', '10:00', '11:30'),
(4, 4, 4, 'Selasa', '10:00', '11:30'),
(5, 5, 5, 'Rabu', '08:00', '09:30'),
(1, 1, 5, 'Kamis', '10:00', '11:30'),
(2, 2, 5, "Jum'at", '08:00', '09:30');

-- 6. Data Users (password: admin123)
-- Password will be set on first login via the app
INSERT OR IGNORE INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@pesantren.local', '', 'admin');

PRAGMA table_info(users);
`;

console.log('Seed SQL generated. Run with:');
console.log('wrangler d1 execute absensi-pesantren --remote --file=./scripts/seed.sql');
console.log('');
console.log('Or for local:');
console.log('wrangler d1 execute absensi-pesantren --local --file=./scripts/seed.sql');
