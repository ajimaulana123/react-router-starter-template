import { useState } from 'react';
import { useLoaderData, useFetcher } from 'react-router';
import type { Route } from './+types/laporan';
import { getAuthUser, requireRole } from '~/lib/auth';
import { getDB, getAllKelas } from '~/lib/db';
import { Layout } from '~/components/layout';
import type { LaporanHarian, LaporanBulanan, StatusAbsensi } from '~/lib/types';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Laporan — Web Absensi Pesantren' }];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const secret = context.cloudflare.env.JWT_SECRET || 'absensi-pesantren-secret-key-2026';
  const db = getDB(context);
  const { user } = await getAuthUser(request, db, secret);
  requireRole(user, ['admin']);
  const kelas = await getAllKelas(db);
  return { user: user!, kelas };
}

const statusLabels: Record<StatusAbsensi, string> = {
  hadir: 'Hadir', sakit: 'Sakit', izin: 'Izin', alpa: 'Alpa',
};

const statusColors: Record<string, string> = {
  hadir: 'badge-hadir', sakit: 'badge-sakit', izin: 'badge-izin', alpa: 'badge-alpa',
};

export default function LaporanPage({ loaderData }: Route.ComponentProps) {
  const { user, kelas } = loaderData;
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

  const [tab, setTab] = useState<'harian' | 'bulanan'>('harian');
  const [tanggal, setTanggal] = useState(today);
  const [bulan, setBulan] = useState(currentMonth);
  const [kelasId, setKelasId] = useState('');

  const harianFetcher = useFetcher<{ laporan: LaporanHarian[] }>();
  const bulananFetcher = useFetcher<{ laporan: LaporanBulanan[] }>();

  function loadHarian() {
    const params = new URLSearchParams({ tanggal });
    if (kelasId) params.set('kelas_id', kelasId);
    harianFetcher.load(`/api/laporan/harian?${params}`);
  }

  function loadBulanan() {
    const params = new URLSearchParams({ bulan });
    if (kelasId) params.set('kelas_id', kelasId);
    bulananFetcher.load(`/api/laporan/bulanan?${params}`);
  }

  const harianData = harianFetcher.data?.laporan ?? [];
  const bulananData = bulananFetcher.data?.laporan ?? [];

  return (
    <Layout user={user}>
      <div className="animate-fade-in">
        <div className="page-header">
          <div>
            <h1 className="page-title">Laporan</h1>
            <p className="page-subtitle">Rekap absensi harian dan bulanan</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab('harian')}
            className={`px-5 py-2.5 rounded-[8px] text-sm font-semibold transition-colors ${tab === 'harian' ? 'bg-[#0D6B3E] text-white' : 'bg-white text-[#6B7280] border border-[#D1D5DB]'}`}>
            📋 Laporan Harian
          </button>
          <button onClick={() => setTab('bulanan')}
            className={`px-5 py-2.5 rounded-[8px] text-sm font-semibold transition-colors ${tab === 'bulanan' ? 'bg-[#0D6B3E] text-white' : 'bg-white text-[#6B7280] border border-[#D1D5DB]'}`}>
            📊 Rekap Bulanan
          </button>
        </div>

        {tab === 'harian' ? (
          <>
            <div className="card mb-6">
              <div className="flex flex-wrap gap-4 items-end">
                <div>
                  <label className="form-label">Tanggal</label>
                  <input type="date" className="form-input" value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Kelas</label>
                  <select className="form-select" value={kelasId} onChange={(e) => setKelasId(e.target.value)}>
                    <option value="">Semua Kelas</option>
                    {kelas.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
                  </select>
                </div>
                <button onClick={loadHarian} className="btn-primary"
                  disabled={harianFetcher.state === 'loading'}>
                  {harianFetcher.state === 'loading' ? '⏳ Memuat...' : '🔍 Tampilkan'}
                </button>
              </div>
            </div>

            {harianFetcher.state === 'loading' ? (
              <div className="flex justify-center py-12"><div className="loading-spinner" /></div>
            ) : harianData.length > 0 ? (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Kelas</th>
                      <th>Total Santri</th>
                      <th>✅ Hadir</th>
                      <th>🤒 Sakit</th>
                      <th>📝 Izin</th>
                      <th>❌ Alpa</th>
                      <th>📈 % Kehadiran</th>
                    </tr>
                  </thead>
                  <tbody>
                    {harianData.map((l, i) => (
                      <tr key={i}>
                        <td className="font-medium">{l.kelas_nama}</td>
                        <td>{l.total_santri}</td>
                        <td><span className="badge-hadir">{l.hadir}</span></td>
                        <td><span className="badge-sakit">{l.sakit}</span></td>
                        <td><span className="badge-izin">{l.izin}</span></td>
                        <td><span className="badge-alpa">{l.alpa}</span></td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                              <div className="h-full bg-[#059669] rounded-full transition-all"
                                style={{ width: `${l.persentase_kehadiran}%` }} />
                            </div>
                            <span className="text-sm font-semibold"
                              style={{ color: l.persentase_kehadiran >= 80 ? '#059669' : l.persentase_kehadiran >= 60 ? '#D97706' : '#DC2626' }}>
                              {l.persentase_kehadiran}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : harianFetcher.data ? (
              <div className="empty-state py-12">
                <div className="empty-icon">📋</div>
                <p className="empty-text">Tidak ada data absensi untuk tanggal ini</p>
              </div>
            ) : (
              <div className="empty-state py-12">
                <div className="empty-icon">📋</div>
                <p className="empty-text">Pilih tanggal dan klik "Tampilkan"</p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="card mb-6">
              <div className="flex flex-wrap gap-4 items-end">
                <div>
                  <label className="form-label">Bulan</label>
                  <input type="month" className="form-input" value={bulan}
                    onChange={(e) => setBulan(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Kelas</label>
                  <select className="form-select" value={kelasId} onChange={(e) => setKelasId(e.target.value)}>
                    <option value="">Semua Kelas</option>
                    {kelas.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
                  </select>
                </div>
                <button onClick={loadBulanan} className="btn-primary"
                  disabled={bulananFetcher.state === 'loading'}>
                  {bulananFetcher.state === 'loading' ? '⏳ Memuat...' : '🔍 Tampilkan'}
                </button>
              </div>
            </div>

            {bulananFetcher.state === 'loading' ? (
              <div className="flex justify-center py-12"><div className="loading-spinner" /></div>
            ) : bulananData.length > 0 ? (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>NIS</th>
                      <th>Nama Santri</th>
                      <th>Kelas</th>
                      <th>Total</th>
                      <th>✅ Hadir</th>
                      <th>🤒 Sakit</th>
                      <th>📝 Izin</th>
                      <th>❌ Alpa</th>
                      <th>📈 %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulananData.map((l, i) => (
                      <tr key={i}>
                        <td className="font-mono text-xs">{l.santri_nis}</td>
                        <td className="font-medium">{l.santri_nama}</td>
                        <td>{l.kelas_nama}</td>
                        <td className="text-center">{l.total_hari}</td>
                        <td><span className="badge-hadir">{l.hadir}</span></td>
                        <td><span className="badge-sakit">{l.sakit}</span></td>
                        <td><span className="badge-izin">{l.izin}</span></td>
                        <td><span className="badge-alpa">{l.alpa}</span></td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                              <div className="h-full bg-[#059669] rounded-full transition-all"
                                style={{ width: `${l.persentase_kehadiran}%` }} />
                            </div>
                            <span className="text-xs font-semibold"
                              style={{ color: l.persentase_kehadiran >= 80 ? '#059669' : l.persentase_kehadiran >= 60 ? '#D97706' : '#DC2626' }}>
                              {l.persentase_kehadiran}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : bulananFetcher.data ? (
              <div className="empty-state py-12">
                <div className="empty-icon">📊</div>
                <p className="empty-text">Tidak ada data untuk bulan ini</p>
              </div>
            ) : (
              <div className="empty-state py-12">
                <div className="empty-icon">📊</div>
                <p className="empty-text">Pilih bulan dan klik "Tampilkan"</p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
