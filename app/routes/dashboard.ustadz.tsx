import { data } from 'react-router';
import type { Route } from './+types/dashboard.ustadz';
import { getAuthUser, requireRole } from '~/lib/auth';
import { getDB, getJadwalByUstadz, getUstadzById } from '~/lib/db';
import { Layout } from '~/components/layout';
import { HARI } from '~/lib/types';
import type { JadwalWithRelations } from '~/lib/types';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Dashboard — Ustadz | Web Absensi Pesantren' }];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const secret = context.cloudflare.env.JWT_SECRET || 'absensi-pesantren-secret-key-2026';
  const db = getDB(context);
  const { user } = await getAuthUser(request, db, secret);
  requireRole(user, ['ustadz']);

  const ustadz = await getUstadzById(db, user.ustadz_id!);
  const jadwal = await getJadwalByUstadz(db, user.ustadz_id!);
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const todayName = new Date().toLocaleDateString('id-ID', { weekday: 'long' });

  // Get today's schedule
  const jadwalHariIni = jadwal.filter(j => j.hari.toLowerCase() === todayName.toLowerCase());

  return { user: user!, ustadz, jadwal, jadwalHariIni, today, todayName };
}

export default function DashboardUstadz({ loaderData }: Route.ComponentProps) {
  const { user, ustadz, jadwal, jadwalHariIni, today, todayName } = loaderData;

  const groupedJadwal = HARI.reduce((acc, hari) => {
    const filtered = jadwal.filter(j => j.hari === hari);
    if (filtered.length > 0) acc[hari] = filtered;
    return acc;
  }, {} as Record<string, JadwalWithRelations[]>);

  return (
    <Layout user={user}>
      <div className="animate-fade-in">
        <div className="page-header">
          <div>
            <h1 className="page-title">Dashboard Ustadz</h1>
            <p className="page-subtitle">Selamat datang, {ustadz?.nama || user.username}</p>
          </div>
          <div className="text-sm text-[#6B7280]">📅 {today}</div>
        </div>

        {/* Info Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="stat-card">
            <div className="stat-icon bg-[#E8F5EF]">📅</div>
            <p className="stat-value">{jadwal.length}</p>
            <p className="stat-label">Total Jadwal Mengajar</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-[#FDF5E6]">📚</div>
            <p className="stat-value">{new Set(jadwal.map(j => j.mapel_nama)).size}</p>
            <p className="stat-label">Mata Pelajaran</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-[#DBEAFE]">🏫</div>
            <p className="stat-value">{new Set(jadwal.map(j => j.kelas_nama)).size}</p>
            <p className="stat-label">Kelas Diajar</p>
          </div>
        </div>

        {/* Jadwal Hari Ini */}
        <div className="card mb-6">
          <div className="card-header">
            <h2 className="card-title">📋 Jadwal Hari Ini ({todayName})</h2>
          </div>
          {jadwalHariIni.length === 0 ? (
            <div className="empty-state py-8">
              <div className="empty-icon">📅</div>
              <p className="empty-text">Tidak ada jadwal hari ini</p>
              <p className="empty-subtext">Silakan istirahat atau persiapkan materi</p>
            </div>
          ) : (
            <div className="space-y-3">
              {jadwalHariIni.map(j => (
                <div key={j.id} className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-[8px] border-l-4 border-[#0D6B3E]">
                  <div>
                    <p className="font-semibold text-[#1A1D23]">{j.mapel_nama}</p>
                    <p className="text-sm text-[#6B7280]">{j.kelas_nama}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#0D6B3E]">{j.jam_masuk} - {j.jam_keluar}</p>
                    <a href={`/absensi?jadwal_id=${j.id}`} className="text-xs text-[#0D6B3E] hover:underline">
                      ✅ Lakukan Absensi
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Semua Jadwal */}
        <div className="card mb-6">
          <div className="card-header">
            <h2 className="card-title">📅 Semua Jadwal Mengajar</h2>
          </div>
          {Object.keys(groupedJadwal).length === 0 ? (
            <div className="empty-state py-8">
              <div className="empty-icon">📅</div>
              <p className="empty-text">Belum ada jadwal</p>
            </div>
          ) : (
            <div className="space-y-6">
              {HARI.map(hari => {
                const items = groupedJadwal[hari];
                if (!items) return null;
                return (
                  <div key={hari}>
                    <h3 className="font-semibold text-[#1A1D23] mb-2">{hari}</h3>
                    <div className="space-y-2">
                      {items.map(j => (
                        <div key={j.id} className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-[8px]">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-[#0D6B3E] min-w-[70px]">{j.jam_masuk}</span>
                            <div className="w-px h-8 bg-[#E5E7EB]" />
                            <div>
                              <p className="text-sm font-medium">{j.mapel_nama}</p>
                              <p className="text-xs text-[#6B7280]">{j.kelas_nama}</p>
                            </div>
                          </div>
                          <a href={`/absensi?jadwal_id=${j.id}`} className="btn-secondary btn-sm">Absen</a>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
