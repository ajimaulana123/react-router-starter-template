// === User & Auth Types ===

export type UserRole = 'admin' | 'ustadz' | 'santri' | 'wali';

export interface User {
  id: number;
  username: string;
  email: string | null;
  password_hash: string;
  role: UserRole;
  santri_id: number | null;
  ustadz_id: number | null;
  wali_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface UserPublic {
  id: number;
  username: string;
  email: string | null;
  role: UserRole;
  santri_id: number | null;
  ustadz_id: number | null;
  wali_id: number | null;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserPublic;
}

export interface JwtPayload {
  userId: number;
  username: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// === Santri (Student) Types ===

export interface Santri {
  id: number;
  nis: string;
  nama: string;
  kelas_id: number;
  alamat: string | null;
  no_telp_wali: string | null;
  status: 'aktif' | 'alumni';
  created_at: string;
  updated_at: string;
}

export interface SantriWithKelas extends Santri {
  kelas_nama: string;
}

export interface SantriCreate {
  nis: string;
  nama: string;
  kelas_id: number;
  alamat?: string;
  no_telp_wali?: string;
  status?: 'aktif' | 'alumni';
}

// === Ustadz (Teacher) Types ===

export interface Ustadz {
  id: number;
  nip: string;
  nama: string;
  kontak: string | null;
  bidang: string | null;
  status: 'aktif' | 'tidak_aktif';
  created_at: string;
  updated_at: string;
}

export interface UstadzCreate {
  nip: string;
  nama: string;
  kontak?: string;
  bidang?: string;
  status?: 'aktif' | 'tidak_aktif';
}

// === Kelas (Class) Types ===

export interface Kelas {
  id: number;
  nama_kelas: string;
  tingkat: string | null;
  wali_kelas_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface KelasWithWali extends Kelas {
  wali_kelas_nama: string | null;
  jumlah_santri: number;
}

export interface KelasCreate {
  nama_kelas: string;
  tingkat?: string;
  wali_kelas_id?: number;
}

// === Mata Pelajaran (Subject) Types ===

export interface MataPelajaran {
  id: number;
  kode: string;
  nama: string;
  deskripsi: string | null;
  created_at: string;
  updated_at: string;
}

export interface MataPelajaranCreate {
  kode: string;
  nama: string;
  deskripsi?: string;
}

// === Jadwal (Schedule) Types ===

export interface Jadwal {
  id: number;
  ustadz_id: number;
  mapel_id: number;
  kelas_id: number;
  hari: string;
  jam_masuk: string;
  jam_keluar: string;
  created_at: string;
  updated_at: string;
}

export interface JadwalWithRelations extends Jadwal {
  ustadz_nama: string;
  mapel_nama: string;
  kelas_nama: string;
}

export interface JadwalCreate {
  ustadz_id: number;
  mapel_id: number;
  kelas_id: number;
  hari: string;
  jam_masuk: string;
  jam_keluar: string;
}

export const HARI = [
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  "Jum'at",
  'Sabtu',
  'Ahad',
] as const;
export type Hari = (typeof HARI)[number];

// === Absensi (Attendance) Types ===

export type StatusAbsensi = 'hadir' | 'sakit' | 'izin' | 'alpa';

export interface Absensi {
  id: number;
  santri_id: number;
  jadwal_id: number;
  tanggal: string;
  status: StatusAbsensi;
  catatan: string | null;
  created_at: string;
  updated_at: string;
}

export interface AbsensiWithSantri extends Absensi {
  santri_nis: string;
  santri_nama: string;
  kelas_nama: string;
}

export interface AbsensiCreate {
  santri_id: number;
  jadwal_id: number;
  tanggal: string;
  status: StatusAbsensi;
  catatan?: string;
}

// === Wali Santri (Guardian) Types ===

export interface WaliSantri {
  id: number;
  nama: string;
  kontak: string | null;
  hubungan: string | null;
  santri_id: number;
  created_at: string;
  updated_at: string;
}

export interface WaliSantriWithSantri extends WaliSantri {
  santri_nama: string;
  santri_nis: string;
}

export interface WaliSantriCreate {
  nama: string;
  kontak?: string;
  hubungan?: string;
  santri_id: number;
}

// === Laporan (Report) Types ===

export interface LaporanHarian {
  tanggal: string;
  kelas_id: number;
  kelas_nama: string;
  total_santri: number;
  hadir: number;
  sakit: number;
  izin: number;
  alpa: number;
  persentase_kehadiran: number;
}

export interface LaporanBulanan {
  bulan: string;
  tahun: number;
  santri_id: number;
  santri_nama: string;
  santri_nis: string;
  kelas_nama: string;
  total_hari: number;
  hadir: number;
  sakit: number;
  izin: number;
  alpa: number;
  persentase_kehadiran: number;
}

// === Dashboard ===

export interface DashboardStats {
  total_santri: number;
  total_ustadz: number;
  total_kelas: number;
  total_mapel: number;
  absensi_hari_ini: number;
  santri_hadir_hari_ini: number;
  recent_absensi: AbsensiWithSantri[];
}

// === API Response ===

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
