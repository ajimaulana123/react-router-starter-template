import { data } from 'react-router';
import type { Route } from './+types/api.laporan.bulanan';
import { getAuthUser, requireRole } from '~/lib/auth';
import { getDB, getAllKelas, getSantriByKelas } from '~/lib/db';
import type { LaporanBulanan } from '~/lib/types';

export async function loader({ request, context }: Route.LoaderArgs) {
  const secret = context.cloudflare.env.JWT_SECRET || 'absensi-pesantren-secret-key-2026';
  const db = getDB(context);
  const { user } = await getAuthUser(request, db, secret);
  requireRole(user, ['admin']);

  const url = new URL(request.url);
  const bulan = url.searchParams.get('bulan') || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  const kelasId = url.searchParams.get('kelas_id');
  const [tahun, month] = bulan.split('-');

  // Get the first and last day of the month
  const startDate = `${bulan}-01`;
  const lastDay = new Date(Number(tahun), Number(month), 0).getDate();
  const endDate = `${bulan}-${String(lastDay).padStart(2, '0')}`;

  if (kelasId) {
    const santri = await getSantriByKelas(db, Number(kelasId));
    const laporan = await Promise.all(santri.map(async (s) => {
      const stats = await getSantriMonthlyStats(db, s.id, startDate, endDate);
      return {
        bulan,
        tahun: Number(tahun),
        santri_id: s.id,
        santri_nama: s.nama,
        santri_nis: s.nis,
        kelas_nama: s.kelas_nama,
        ...stats,
        persentase_kehadiran: stats.total_hari > 0 ? Math.round((stats.hadir / stats.total_hari) * 100) : 0,
      } satisfies LaporanBulanan;
    }));
    return data({ laporan, bulan, tahun: Number(tahun), kelas_nama: santri[0]?.kelas_nama || '' });
  }

  // All classes
  const kelas = await getAllKelas(db);
  let allLaporan: LaporanBulanan[] = [];

  for (const k of kelas) {
    const santri = await getSantriByKelas(db, k.id);
    const laporan = await Promise.all(santri.map(async (s) => {
      const stats = await getSantriMonthlyStats(db, s.id, startDate, endDate);
      return {
        bulan,
        tahun: Number(tahun),
        santri_id: s.id,
        santri_nama: s.nama,
        santri_nis: s.nis,
        kelas_nama: s.kelas_nama,
        ...stats,
        persentase_kehadiran: stats.total_hari > 0 ? Math.round((stats.hadir / stats.total_hari) * 100) : 0,
      } satisfies LaporanBulanan;
    }));
    allLaporan = [...allLaporan, ...laporan];
  }

  return data({ laporan: allLaporan, bulan, tahun: Number(tahun) });
}

async function getSantriMonthlyStats(db: D1Database, santriId: number, startDate: string, endDate: string) {
  const result = await db.prepare(`
    SELECT 
      COUNT(*) as total_hari,
      SUM(CASE WHEN status = 'hadir' THEN 1 ELSE 0 END) as hadir,
      SUM(CASE WHEN status = 'sakit' THEN 1 ELSE 0 END) as sakit,
      SUM(CASE WHEN status = 'izin' THEN 1 ELSE 0 END) as izin,
      SUM(CASE WHEN status = 'alpa' THEN 1 ELSE 0 END) as alpa
    FROM absensi 
    WHERE santri_id = ? AND tanggal >= ? AND tanggal <= ?
  `).bind(santriId, startDate, endDate).first<{
    total_hari: number;
    hadir: number;
    sakit: number;
    izin: number;
    alpa: number;
  }>();

  return {
    total_hari: result?.total_hari ?? 0,
    hadir: result?.hadir ?? 0,
    sakit: result?.sakit ?? 0,
    izin: result?.izin ?? 0,
    alpa: result?.alpa ?? 0,
  };
}
