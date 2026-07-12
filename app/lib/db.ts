import type {
  Santri,
  SantriWithKelas,
  SantriCreate,
  Ustadz,
  UstadzCreate,
  Kelas,
  KelasWithWali,
  KelasCreate,
  MataPelajaran,
  MataPelajaranCreate,
  Jadwal,
  JadwalWithRelations,
  JadwalCreate,
  Absensi,
  AbsensiWithSantri,
  AbsensiCreate,
  WaliSantri,
  WaliSantriWithSantri,
  WaliSantriCreate,
  DashboardStats,
  User,
  UserPublic,
} from './types';

// Helper to get D1 database from context
export function getDB(context: unknown): D1Database {
  const ctx = context as {
    cloudflare: { env: { DB: D1Database } };
  };
  return ctx.cloudflare.env.DB;
}

// Helper to run a query and return all results
async function queryAll<T>(
  db: D1Database,
  sql: string,
  params?: unknown[],
): Promise<T[]> {
  const stmt = db.prepare(sql);
  const result = params ? await stmt.bind(...params).all<T>() : await stmt.all<T>();
  return result.results ?? [];
}

// Helper to run a query and return first result
async function queryFirst<T>(
  db: D1Database,
  sql: string,
  params?: unknown[],
): Promise<T | null> {
  const stmt = db.prepare(sql);
  const result = params ? await stmt.bind(...params).first<T>() : await stmt.first<T>();
  return result ?? null;
}

// Helper to execute a write operation
async function execute(
  db: D1Database,
  sql: string,
  params?: unknown[],
): Promise<D1Result> {
  const stmt = db.prepare(sql);
  return params ? await stmt.bind(...params).run() : await stmt.run();
}

// Helper to execute multiple statements in a batch
async function batch(
  db: D1Database,
  queries: { sql: string; params?: unknown[] }[],
): Promise<D1Result[]> {
  const stmts = queries.map((q) => {
    const stmt = db.prepare(q.sql);
    return q.params ? stmt.bind(...q.params) : stmt;
  });
  return db.batch(stmts);
}

// ==================== USERS ====================

export async function getUserByUsername(
  db: D1Database,
  username: string,
): Promise<User | null> {
  return queryFirst<User>(db, 'SELECT * FROM users WHERE username = ?', [username]);
}

export async function getUserById(
  db: D1Database,
  id: number,
): Promise<User | null> {
  return queryFirst<User>(db, 'SELECT * FROM users WHERE id = ?', [id]);
}

export function toUserPublic(user: User): UserPublic {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    santri_id: user.santri_id,
    ustadz_id: user.ustadz_id,
    wali_id: user.wali_id,
  };
}

// ==================== SANTRI ====================

export async function getAllSantri(
  db: D1Database,
): Promise<SantriWithKelas[]> {
  return queryAll<SantriWithKelas>(
    db,
    `SELECT s.*, k.nama_kelas as kelas_nama 
     FROM santri s 
     LEFT JOIN kelas k ON s.kelas_id = k.id 
     ORDER BY s.nama ASC`,
  );
}

export async function getSantriByKelas(
  db: D1Database,
  kelasId: number,
): Promise<SantriWithKelas[]> {
  return queryAll<SantriWithKelas>(
    db,
    `SELECT s.*, k.nama_kelas as kelas_nama 
     FROM santri s 
     LEFT JOIN kelas k ON s.kelas_id = k.id 
     WHERE s.kelas_id = ? 
     ORDER BY s.nama ASC`,
    [kelasId],
  );
}

export async function getSantriById(
  db: D1Database,
  id: number,
): Promise<SantriWithKelas | null> {
  return queryFirst<SantriWithKelas>(
    db,
    `SELECT s.*, k.nama_kelas as kelas_nama 
     FROM santri s 
     LEFT JOIN kelas k ON s.kelas_id = k.id 
     WHERE s.id = ?`,
    [id],
  );
}

export async function createSantri(
  db: D1Database,
  data: SantriCreate,
): Promise<Santri> {
  const result = await execute(
    db,
    `INSERT INTO santri (nis, nama, kelas_id, alamat, no_telp_wali, status) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.nis,
      data.nama,
      data.kelas_id,
      data.alamat ?? null,
      data.no_telp_wali ?? null,
      data.status ?? 'aktif',
    ],
  );
  const id = result.meta.last_row_id;
  return (await getSantriById(db, id)) as unknown as Santri;
}

export async function updateSantri(
  db: D1Database,
  id: number,
  data: Partial<SantriCreate>,
): Promise<Santri | null> {
  const fields: string[] = [];
  const params: unknown[] = [];

  if (data.nis !== undefined) { fields.push('nis = ?'); params.push(data.nis); }
  if (data.nama !== undefined) { fields.push('nama = ?'); params.push(data.nama); }
  if (data.kelas_id !== undefined) { fields.push('kelas_id = ?'); params.push(data.kelas_id); }
  if (data.alamat !== undefined) { fields.push('alamat = ?'); params.push(data.alamat); }
  if (data.no_telp_wali !== undefined) { fields.push('no_telp_wali = ?'); params.push(data.no_telp_wali); }
  if (data.status !== undefined) { fields.push('status = ?'); params.push(data.status); }

  if (fields.length === 0) return getSantriById(db, id);

  fields.push("updated_at = datetime('now')");
  params.push(id);

  await execute(
    db,
    `UPDATE santri SET ${fields.join(', ')} WHERE id = ?`,
    params,
  );
  return getSantriById(db, id);
}

export async function deleteSantri(
  db: D1Database,
  id: number,
): Promise<boolean> {
  const result = await execute(db, 'DELETE FROM santri WHERE id = ?', [id]);
  return (result.meta.changes ?? 0) > 0;
}

export async function countSantri(
  db: D1Database,
): Promise<number> {
  const result = await queryFirst<{ count: number }>(
    db,
    'SELECT COUNT(*) as count FROM santri WHERE status = ?',
    ['aktif'],
  );
  return result?.count ?? 0;
}

// ==================== USTADZ ====================

export async function getAllUstadz(
  db: D1Database,
): Promise<Ustadz[]> {
  return queryAll<Ustadz>(
    db,
    'SELECT * FROM ustadz ORDER BY nama ASC',
  );
}

export async function getUstadzById(
  db: D1Database,
  id: number,
): Promise<Ustadz | null> {
  return queryFirst<Ustadz>(db, 'SELECT * FROM ustadz WHERE id = ?', [id]);
}

export async function createUstadz(
  db: D1Database,
  data: UstadzCreate,
): Promise<Ustadz> {
  const result = await execute(
    db,
    `INSERT INTO ustadz (nip, nama, kontak, bidang, status) 
     VALUES (?, ?, ?, ?, ?)`,
    [
      data.nip,
      data.nama,
      data.kontak ?? null,
      data.bidang ?? null,
      data.status ?? 'aktif',
    ],
  );
  const id = result.meta.last_row_id;
  return (await getUstadzById(db, id)) as Ustadz;
}

export async function updateUstadz(
  db: D1Database,
  id: number,
  data: Partial<UstadzCreate>,
): Promise<Ustadz | null> {
  const fields: string[] = [];
  const params: unknown[] = [];

  if (data.nip !== undefined) { fields.push('nip = ?'); params.push(data.nip); }
  if (data.nama !== undefined) { fields.push('nama = ?'); params.push(data.nama); }
  if (data.kontak !== undefined) { fields.push('kontak = ?'); params.push(data.kontak); }
  if (data.bidang !== undefined) { fields.push('bidang = ?'); params.push(data.bidang); }
  if (data.status !== undefined) { fields.push('status = ?'); params.push(data.status); }

  if (fields.length === 0) return getUstadzById(db, id);

  fields.push("updated_at = datetime('now')");
  params.push(id);

  await execute(
    db,
    `UPDATE ustadz SET ${fields.join(', ')} WHERE id = ?`,
    params,
  );
  return getUstadzById(db, id);
}

export async function deleteUstadz(
  db: D1Database,
  id: number,
): Promise<boolean> {
  const result = await execute(db, 'DELETE FROM ustadz WHERE id = ?', [id]);
  return (result.meta.changes ?? 0) > 0;
}

export async function countUstadz(db: D1Database): Promise<number> {
  const result = await queryFirst<{ count: number }>(
    db,
    'SELECT COUNT(*) as count FROM ustadz WHERE status = ?',
    ['aktif'],
  );
  return result?.count ?? 0;
}

// ==================== KELAS ====================

export async function getAllKelas(
  db: D1Database,
): Promise<KelasWithWali[]> {
  return queryAll<KelasWithWali>(
    db,
    `SELECT k.*, u.nama as wali_kelas_nama,
     (SELECT COUNT(*) FROM santri s WHERE s.kelas_id = k.id AND s.status = 'aktif') as jumlah_santri
     FROM kelas k 
     LEFT JOIN ustadz u ON k.wali_kelas_id = u.id 
     ORDER BY k.nama_kelas ASC`,
  );
}

export async function getKelasById(
  db: D1Database,
  id: number,
): Promise<Kelas | null> {
  return queryFirst<Kelas>(db, 'SELECT * FROM kelas WHERE id = ?', [id]);
}

export async function createKelas(
  db: D1Database,
  data: KelasCreate,
): Promise<Kelas> {
  const result = await execute(
    db,
    `INSERT INTO kelas (nama_kelas, tingkat, wali_kelas_id) VALUES (?, ?, ?)`,
    [data.nama_kelas, data.tingkat ?? null, data.wali_kelas_id ?? null],
  );
  const id = result.meta.last_row_id;
  return (await getKelasById(db, id)) as Kelas;
}

export async function updateKelas(
  db: D1Database,
  id: number,
  data: Partial<KelasCreate>,
): Promise<Kelas | null> {
  const fields: string[] = [];
  const params: unknown[] = [];

  if (data.nama_kelas !== undefined) { fields.push('nama_kelas = ?'); params.push(data.nama_kelas); }
  if (data.tingkat !== undefined) { fields.push('tingkat = ?'); params.push(data.tingkat); }
  if (data.wali_kelas_id !== undefined) { fields.push('wali_kelas_id = ?'); params.push(data.wali_kelas_id); }

  if (fields.length === 0) return getKelasById(db, id);

  fields.push("updated_at = datetime('now')");
  params.push(id);

  await execute(
    db,
    `UPDATE kelas SET ${fields.join(', ')} WHERE id = ?`,
    params,
  );
  return getKelasById(db, id);
}

export async function deleteKelas(
  db: D1Database,
  id: number,
): Promise<boolean> {
  const result = await execute(db, 'DELETE FROM kelas WHERE id = ?', [id]);
  return (result.meta.changes ?? 0) > 0;
}

export async function countKelas(db: D1Database): Promise<number> {
  const result = await queryFirst<{ count: number }>(
    db,
    'SELECT COUNT(*) as count FROM kelas',
  );
  return result?.count ?? 0;
}

// ==================== MATA PELAJARAN ====================

export async function getAllMataPelajaran(
  db: D1Database,
): Promise<MataPelajaran[]> {
  return queryAll<MataPelajaran>(
    db,
    'SELECT * FROM mata_pelajaran ORDER BY nama ASC',
  );
}

export async function getMataPelajaranById(
  db: D1Database,
  id: number,
): Promise<MataPelajaran | null> {
  return queryFirst<MataPelajaran>(
    db,
    'SELECT * FROM mata_pelajaran WHERE id = ?',
    [id],
  );
}

export async function createMataPelajaran(
  db: D1Database,
  data: MataPelajaranCreate,
): Promise<MataPelajaran> {
  const result = await execute(
    db,
    `INSERT INTO mata_pelajaran (kode, nama, deskripsi) VALUES (?, ?, ?)`,
    [data.kode, data.nama, data.deskripsi ?? null],
  );
  const id = result.meta.last_row_id;
  return (await getMataPelajaranById(db, id)) as MataPelajaran;
}

export async function updateMataPelajaran(
  db: D1Database,
  id: number,
  data: Partial<MataPelajaranCreate>,
): Promise<MataPelajaran | null> {
  const fields: string[] = [];
  const params: unknown[] = [];

  if (data.kode !== undefined) { fields.push('kode = ?'); params.push(data.kode); }
  if (data.nama !== undefined) { fields.push('nama = ?'); params.push(data.nama); }
  if (data.deskripsi !== undefined) { fields.push('deskripsi = ?'); params.push(data.deskripsi); }

  if (fields.length === 0) return getMataPelajaranById(db, id);

  fields.push("updated_at = datetime('now')");
  params.push(id);

  await execute(
    db,
    `UPDATE mata_pelajaran SET ${fields.join(', ')} WHERE id = ?`,
    params,
  );
  return getMataPelajaranById(db, id);
}

export async function deleteMataPelajaran(
  db: D1Database,
  id: number,
): Promise<boolean> {
  const result = await execute(
    db,
    'DELETE FROM mata_pelajaran WHERE id = ?',
    [id],
  );
  return (result.meta.changes ?? 0) > 0;
}

export async function countMataPelajaran(db: D1Database): Promise<number> {
  const result = await queryFirst<{ count: number }>(
    db,
    'SELECT COUNT(*) as count FROM mata_pelajaran',
  );
  return result?.count ?? 0;
}

// ==================== JADWAL ====================

export async function getAllJadwal(
  db: D1Database,
): Promise<JadwalWithRelations[]> {
  return queryAll<JadwalWithRelations>(
    db,
    `SELECT j.*, u.nama as ustadz_nama, mp.nama as mapel_nama, k.nama_kelas as kelas_nama
     FROM jadwal j
     LEFT JOIN ustadz u ON j.ustadz_id = u.id
     LEFT JOIN mata_pelajaran mp ON j.mapel_id = mp.id
     LEFT JOIN kelas k ON j.kelas_id = k.id
     ORDER BY j.hari, j.jam_masuk`,
  );
}

export async function getJadwalById(
  db: D1Database,
  id: number,
): Promise<JadwalWithRelations | null> {
  return queryFirst<JadwalWithRelations>(
    db,
    `SELECT j.*, u.nama as ustadz_nama, mp.nama as mapel_nama, k.nama_kelas as kelas_nama
     FROM jadwal j
     LEFT JOIN ustadz u ON j.ustadz_id = u.id
     LEFT JOIN mata_pelajaran mp ON j.mapel_id = mp.id
     LEFT JOIN kelas k ON j.kelas_id = k.id
     WHERE j.id = ?`,
    [id],
  );
}

export async function getJadwalByUstadz(
  db: D1Database,
  ustadzId: number,
): Promise<JadwalWithRelations[]> {
  return queryAll<JadwalWithRelations>(
    db,
    `SELECT j.*, u.nama as ustadz_nama, mp.nama as mapel_nama, k.nama_kelas as kelas_nama
     FROM jadwal j
     LEFT JOIN ustadz u ON j.ustadz_id = u.id
     LEFT JOIN mata_pelajaran mp ON j.mapel_id = mp.id
     LEFT JOIN kelas k ON j.kelas_id = k.id
     WHERE j.ustadz_id = ?
     ORDER BY j.hari, j.jam_masuk`,
    [ustadzId],
  );
}

export async function getJadwalByKelas(
  db: D1Database,
  kelasId: number,
): Promise<JadwalWithRelations[]> {
  return queryAll<JadwalWithRelations>(
    db,
    `SELECT j.*, u.nama as ustadz_nama, mp.nama as mapel_nama, k.nama_kelas as kelas_nama
     FROM jadwal j
     LEFT JOIN ustadz u ON j.ustadz_id = u.id
     LEFT JOIN mata_pelajaran mp ON j.mapel_id = mp.id
     LEFT JOIN kelas k ON j.kelas_id = k.id
     WHERE j.kelas_id = ?
     ORDER BY j.hari, j.jam_masuk`,
    [kelasId],
  );
}

export async function getJadwalByHari(
  db: D1Database,
  hari: string,
): Promise<JadwalWithRelations[]> {
  return queryAll<JadwalWithRelations>(
    db,
    `SELECT j.*, u.nama as ustadz_nama, mp.nama as mapel_nama, k.nama_kelas as kelas_nama
     FROM jadwal j
     LEFT JOIN ustadz u ON j.ustadz_id = u.id
     LEFT JOIN mata_pelajaran mp ON j.mapel_id = mp.id
     LEFT JOIN kelas k ON j.kelas_id = k.id
     WHERE j.hari = ?
     ORDER BY j.jam_masuk`,
    [hari],
  );
}

export async function createJadwal(
  db: D1Database,
  data: JadwalCreate,
): Promise<Jadwal> {
  const result = await execute(
    db,
    `INSERT INTO jadwal (ustadz_id, mapel_id, kelas_id, hari, jam_masuk, jam_keluar) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [data.ustadz_id, data.mapel_id, data.kelas_id, data.hari, data.jam_masuk, data.jam_keluar],
  );
  const id = result.meta.last_row_id;
  return (await getJadwalById(db, id)) as unknown as Jadwal;
}

export async function updateJadwal(
  db: D1Database,
  id: number,
  data: Partial<JadwalCreate>,
): Promise<JadwalWithRelations | null> {
  const fields: string[] = [];
  const params: unknown[] = [];

  if (data.ustadz_id !== undefined) { fields.push('ustadz_id = ?'); params.push(data.ustadz_id); }
  if (data.mapel_id !== undefined) { fields.push('mapel_id = ?'); params.push(data.mapel_id); }
  if (data.kelas_id !== undefined) { fields.push('kelas_id = ?'); params.push(data.kelas_id); }
  if (data.hari !== undefined) { fields.push('hari = ?'); params.push(data.hari); }
  if (data.jam_masuk !== undefined) { fields.push('jam_masuk = ?'); params.push(data.jam_masuk); }
  if (data.jam_keluar !== undefined) { fields.push('jam_keluar = ?'); params.push(data.jam_keluar); }

  if (fields.length === 0) return getJadwalById(db, id);

  fields.push("updated_at = datetime('now')");
  params.push(id);

  await execute(db, `UPDATE jadwal SET ${fields.join(', ')} WHERE id = ?`, params);
  return getJadwalById(db, id);
}

export async function deleteJadwal(
  db: D1Database,
  id: number,
): Promise<boolean> {
  const result = await execute(db, 'DELETE FROM jadwal WHERE id = ?', [id]);
  return (result.meta.changes ?? 0) > 0;
}

// ==================== ABSENSI ====================

export async function getAbsensiByJadwalTanggal(
  db: D1Database,
  jadwalId: number,
  tanggal: string,
): Promise<AbsensiWithSantri[]> {
  return queryAll<AbsensiWithSantri>(
    db,
    `SELECT a.*, s.nis as santri_nis, s.nama as santri_nama, k.nama_kelas as kelas_nama
     FROM absensi a
     LEFT JOIN santri s ON a.santri_id = s.id
     LEFT JOIN kelas k ON s.kelas_id = k.id
     WHERE a.jadwal_id = ? AND a.tanggal = ?
     ORDER BY s.nama ASC`,
    [jadwalId, tanggal],
  );
}

export async function createAbsensi(
  db: D1Database,
  data: AbsensiCreate,
): Promise<Absensi> {
  const result = await execute(
    db,
    `INSERT INTO absensi (santri_id, jadwal_id, tanggal, status, catatan)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(santri_id, jadwal_id, tanggal)
     DO UPDATE SET status = excluded.status, catatan = excluded.catatan, updated_at = datetime('now')`,
    [data.santri_id, data.jadwal_id, data.tanggal, data.status, data.catatan ?? null],
  );
  const id = result.meta.last_row_id;
  return {
    id,
    santri_id: data.santri_id,
    jadwal_id: data.jadwal_id,
    tanggal: data.tanggal,
    status: data.status,
    catatan: data.catatan ?? null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function updateAbsensi(
  db: D1Database,
  id: number,
  status: string,
  catatan?: string,
): Promise<void> {
  await execute(
    db,
    `UPDATE absensi SET status = ?, catatan = ?, updated_at = datetime('now') WHERE id = ?`,
    [status, catatan ?? null, id],
  );
}

export async function batchCreateAbsensi(
  db: D1Database,
  records: AbsensiCreate[],
): Promise<void> {
  const queries = records.map((r) => ({
    sql: `INSERT INTO absensi (santri_id, jadwal_id, tanggal, status, catatan)
          VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(santri_id, jadwal_id, tanggal)
          DO UPDATE SET status = excluded.status, catatan = excluded.catatan, updated_at = datetime('now')`,
    params: [r.santri_id, r.jadwal_id, r.tanggal, r.status, r.catatan ?? null],
  }));
  await batch(db, queries);
}

export async function getAbsensiHariIni(
  db: D1Database,
  tanggal: string,
): Promise<{ total: number; hadir: number }> {
  const result = await queryFirst<{ total: number; hadir: number }>(
    db,
    `SELECT COUNT(*) as total, 
     SUM(CASE WHEN status = 'hadir' THEN 1 ELSE 0 END) as hadir
     FROM absensi WHERE tanggal = ?`,
    [tanggal],
  );
  return { total: result?.total ?? 0, hadir: result?.hadir ?? 0 };
}

// ==================== WALI SANTRI ====================

export async function getAllWaliSantri(
  db: D1Database,
): Promise<WaliSantriWithSantri[]> {
  return queryAll<WaliSantriWithSantri>(
    db,
    `SELECT w.*, s.nama as santri_nama, s.nis as santri_nis
     FROM wali_santri w
     LEFT JOIN santri s ON w.santri_id = s.id
     ORDER BY w.nama ASC`,
  );
}

export async function getWaliSantriById(
  db: D1Database,
  id: number,
): Promise<WaliSantri | null> {
  return queryFirst<WaliSantri>(
    db,
    'SELECT * FROM wali_santri WHERE id = ?',
    [id],
  );
}

export async function getWaliSantriBySantriId(
  db: D1Database,
  santriId: number,
): Promise<WaliSantri[]> {
  return queryAll<WaliSantri>(
    db,
    'SELECT * FROM wali_santri WHERE santri_id = ?',
    [santriId],
  );
}

export async function createWaliSantri(
  db: D1Database,
  data: WaliSantriCreate,
): Promise<WaliSantri> {
  const result = await execute(
    db,
    `INSERT INTO wali_santri (nama, kontak, hubungan, santri_id) VALUES (?, ?, ?, ?)`,
    [data.nama, data.kontak ?? null, data.hubungan ?? null, data.santri_id],
  );
  const id = result.meta.last_row_id;
  return getWaliSantriById(db, id) as unknown as WaliSantri;
}

export async function updateWaliSantri(
  db: D1Database,
  id: number,
  data: Partial<WaliSantriCreate>,
): Promise<WaliSantri | null> {
  const fields: string[] = [];
  const params: unknown[] = [];

  if (data.nama !== undefined) { fields.push('nama = ?'); params.push(data.nama); }
  if (data.kontak !== undefined) { fields.push('kontak = ?'); params.push(data.kontak); }
  if (data.hubungan !== undefined) { fields.push('hubungan = ?'); params.push(data.hubungan); }
  if (data.santri_id !== undefined) { fields.push('santri_id = ?'); params.push(data.santri_id); }

  if (fields.length === 0) return getWaliSantriById(db, id);

  fields.push("updated_at = datetime('now')");
  params.push(id);

  await execute(db, `UPDATE wali_santri SET ${fields.join(', ')} WHERE id = ?`, params);
  return getWaliSantriById(db, id);
}

export async function deleteWaliSantri(
  db: D1Database,
  id: number,
): Promise<boolean> {
  const result = await execute(db, 'DELETE FROM wali_santri WHERE id = ?', [id]);
  return (result.meta.changes ?? 0) > 0;
}

// ==================== DASHBOARD ====================

export async function getDashboardStats(
  db: D1Database,
): Promise<DashboardStats> {
  const today = new Date().toISOString().split('T')[0];

  const [totalSantri, totalUstadz, totalKelas, totalMapel, absensiHariIni] =
    await Promise.all([
      countSantri(db),
      countUstadz(db),
      countKelas(db),
      countMataPelajaran(db),
      getAbsensiHariIni(db, today),
    ]);

  const recentAbsensi = await queryAll<AbsensiWithSantri>(
    db,
    `SELECT a.*, s.nis as santri_nis, s.nama as santri_nama, k.nama_kelas as kelas_nama
     FROM absensi a
     LEFT JOIN santri s ON a.santri_id = s.id
     LEFT JOIN kelas k ON s.kelas_id = k.id
     WHERE a.tanggal = ?
     ORDER BY a.created_at DESC
     LIMIT 10`,
    [today],
  );

  return {
    total_santri: totalSantri,
    total_ustadz: totalUstadz,
    total_kelas: totalKelas,
    total_mapel: totalMapel,
    absensi_hari_ini: absensiHariIni.total,
    santri_hadir_hari_ini: absensiHariIni.hadir,
    recent_absensi: recentAbsensi,
  };
}
