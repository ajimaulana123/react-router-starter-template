import { data } from 'react-router';
import type { Route } from './+types/api.laporan.harian';
import { getAuthUser, requireRole } from '~/lib/auth';
import { getDB, getAllKelas, getSantriByKelas } from '~/lib/db';
import type { LaporanHarian } from '~/lib/types';

export async function loader({ request, context }: Route.LoaderArgs) {
  const secret = context.cloudflare.env.JWT_SECRET || 'absensi-pesantren-secret-key-2026';
  const db = getDB(context);
  const { user } = await getAuthUser(request, db, secret);
  requireRole(user, ['admin']);

  const url = new URL(request.url);
  const tanggal = url.searchParams.get('tanggal') || new Date().toISOString().split('T')[0];
  const kelasId = url.searchParams.get('kelas_id');

  let laporan: LaporanHarian[];

  if (kelasId) {
    const kelas = await getKelasById(db, Number(kelasId));
    if (!kelas) {
      return data({ error: 'Kelas tidak ditemukan' }, { status: 404 });
    }
    const santri = await getSantriByKelas(db, Number(kelasId));
    const stats = await getStatsForTanggal(db, tanggal, santri.map(s => s.id));
    laporan = [{
      tanggal,
      kelas_id: kelas.id,
      kelas_nama: kelas.nama_kelas,
      total_santri: santri.length,
      ...stats,
      persentase_kehadiran: santri.length > 0 ? Math.round((stats.hadir / santri.length) * 100) : 0,
    }];
  } else {
    const kelas = await getAllKelas(db);
    const laporanPromises = kelas.map(async (k) => {
      const santri = await getSantriByKelas(db, k.id);
      const stats = await getStatsForTanggal(db, tanggal, santri.map(s => s.id));
      return {
        tanggal,
        kelas_id: k.id,
        kelas_nama: k.nama_kelas,
        total_santri: santri.length,
        ...stats,
        persentase_kehadiran: santri.length > 0 ? Math.round((stats.hadir / santri.length) * 100) : 0,
      };
    });
    laporan = await Promise.all(laporanPromises);
  }

  return data({ laporan, tanggal });
}

async function getKelasById(db: D1Database, id: number) {
  const result = await db.prepare('SELECT * FROM kelas WHERE id = ?').bind(id).first<{ id: number; nama_kelas: string }>();
  return result || null;
}

async function getStatsForTanggal(db: D1Database, tanggal: string, santriIds: number[]) {
  if (santriIds.length === 0) return { hadir: 0, sakit: 0, izin: 0, alpa: 0 };

  const placeholders = santriIds.map(() => '?').join(',');
  const result = await db.prepare(`
    SELECT 
      SUM(CASE WHEN status = 'hadir' THEN 1 ELSE 0 END) as hadir,
      SUM(CASE WHEN status = 'sakit' THEN 1 ELSE 0 END) as sakit,
      SUM(CASE WHEN status = 'izin' THEN 1 ELSE 0 END) as izin,
      SUM(CASE WHEN status = 'alpa' THEN 1 ELSE 0 END) as alpa
    FROM absensi 
    WHERE tanggal = ? AND santri_id IN (${placeholders})
  `).bind(tanggal, ...santriIds).first<{ hadir: number; sakit: number; izin: number; alpa: number }>();

  return {
    hadir: result?.hadir ?? 0,
    sakit: result?.sakit ?? 0,
    izin: result?.izin ?? 0,
    alpa: result?.alpa ?? 0,
  };
}
