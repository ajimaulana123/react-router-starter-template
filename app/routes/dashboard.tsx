import { data } from 'react-router';
import type { Route } from './+types/dashboard';
import { getAuthUser, requireRole } from '~/lib/auth';
import { getDB, getDashboardStats } from '~/lib/db';
import { Layout } from '~/components/layout';
import type { StatusAbsensi } from '~/lib/types';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Dashboard — Web Absensi Pesantren' },
  ];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const secret = context.cloudflare.env.JWT_SECRET || 'absensi-pesantren-secret-key-2026';
  const db = getDB(context);
  const { user } = await getAuthUser(request, db, secret);

  requireRole(user, ['admin']);

  const stats = await getDashboardStats(db);

  return { user: user!, stats };
}

const statusLabels: Record<StatusAbsensi, string> = {
  hadir: 'Hadir',
  sakit: 'Sakit',
  izin: 'Izin',
  alpa: 'Alpa',
};

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { user, stats } = loaderData;

  return (
    <Layout user={user}>
      <div className="animate-fade-in">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">
              Selamat datang, {user.username}! Berikut overview absensi hari ini.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <span>📅</span>
            <span>
              {new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon="👨‍🎓"
            label="Total Santri Aktif"
            value={stats.total_santri}
            bgColor="bg-[#E8F5EF]"
          />
          <StatCard
            icon="👨‍🏫"
            label="Total Ustadz Aktif"
            value={stats.total_ustadz}
            bgColor="bg-[#FDF5E6]"
          />
          <StatCard
            icon="🏫"
            label="Total Kelas"
            value={stats.total_kelas}
            bgColor="bg-[#DBEAFE]"
          />
          <StatCard
            icon="📖"
            label="Mata Pelajaran"
            value={stats.total_mapel}
            bgColor="bg-[#F3E8FF]"
          />
        </div>

        {/* Absensi Hari Ini & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Absensi Hari Ini Card */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Absensi Hari Ini</h2>
            </div>
            <div className="flex items-center gap-6 p-4 bg-[#F8F9FA] rounded-[8px]">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#0D6B3E]">
                  {stats.absensi_hari_ini}
                </p>
                <p className="text-xs text-[#6B7280] mt-1">Total Absensi</p>
              </div>
              <div className="w-px h-12 bg-[#E5E7EB]" />
              <div className="text-center">
                <p className="text-3xl font-bold text-[#059669]">
                  {stats.santri_hadir_hari_ini}
                </p>
                <p className="text-xs text-[#6B7280] mt-1">Hadir</p>
              </div>
              <div className="w-px h-12 bg-[#E5E7EB]" />
              <div className="text-center">
                <p className="text-3xl font-bold text-[#6B7280]">
                  {stats.absensi_hari_ini > 0
                    ? Math.round(
                        (stats.santri_hadir_hari_ini / stats.absensi_hari_ini) *
                          100,
                      )
                    : 0}
                  %
                </p>
                <p className="text-xs text-[#6B7280] mt-1">Kehadiran</p>
              </div>
            </div>
          </div>

          {/* Recent Absensi */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Absensi Terbaru</h2>
            </div>
            {stats.recent_absensi.length === 0 ? (
              <div className="empty-state py-8">
                <div className="empty-icon">📋</div>
                <p className="empty-text">Belum ada absensi hari ini</p>
                <p className="empty-subtext">
                  Silakan lakukan absensi di menu Absensi
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recent_absensi.map((absensi) => (
                  <div
                    key={absensi.id}
                    className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-[8px]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0D6B3E] flex items-center justify-center text-white text-xs font-semibold">
                        {absensi.santri_nama.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1A1D23]">
                          {absensi.santri_nama}
                        </p>
                        <p className="text-xs text-[#6B7280]">
                          {absensi.kelas_nama} — {absensi.santri_nis}
                        </p>
                      </div>
                    </div>
                    <span className={`badge-${absensi.status}`}>
                      {statusLabels[absensi.status]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({
  icon,
  label,
  value,
  bgColor,
}: {
  icon: string;
  label: string;
  value: number;
  bgColor: string;
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${bgColor}`}>{icon}</div>
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
    </div>
  );
}
