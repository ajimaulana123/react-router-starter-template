import { data } from 'react-router';
import type { Route } from './+types/absensi.data';
import { getAuthUser, requireRole } from '~/lib/auth';
import { getDB, getSantriByKelas, getAbsensiByJadwalTanggal, getJadwalById } from '~/lib/db';

export async function loader({ request, context }: Route.LoaderArgs) {
  const secret = context.cloudflare.env.JWT_SECRET || 'absensi-pesantren-secret-key-2026';
  const db = getDB(context);
  const { user } = await getAuthUser(request, db, secret);
  requireRole(user, ['admin', 'ustadz']);

  const url = new URL(request.url);
  const jadwalId = Number(url.searchParams.get('jadwal_id'));
  const tanggal = url.searchParams.get('tanggal') || new Date().toISOString().split('T')[0];

  if (!jadwalId) {
    return data({ santri: [], absensi: [] });
  }

  const jadwal = await getJadwalById(db, jadwalId);
  if (!jadwal) {
    return data({ santri: [], absensi: [] });
  }

  const [santri, absensi] = await Promise.all([
    getSantriByKelas(db, jadwal.kelas_id),
    getAbsensiByJadwalTanggal(db, jadwalId, tanggal),
  ]);

  return data({ santri, absensi });
}
