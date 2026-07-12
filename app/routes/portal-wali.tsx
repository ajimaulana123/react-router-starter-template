import { useState } from 'react';
import { useLoaderData } from 'react-router';
import type { Route } from './+types/portal-wali';
import { getAuthUser, requireRole } from '~/lib/auth';
import { getDB, getWaliSantriBySantriId } from '~/lib/db';
import type { WaliSantri, Santri, AbsensiWithSantri, StatusAbsensi } from '~/lib/types';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Portal Wali — Web Absensi Pesantren' }];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const secret = context.cloudflare.env.JWT_SECRET || 'absensi-pesantren-secret-key-2026';
  const db = getDB(context);
  const { user } = await getAuthUser(request, db, secret);
  requireRole(user, ['wali']);

  // Guard: if wali has no santri_id linked, show empty state
  if (!user.santri_id) {
    return { user: user!, waliList: [], today: '', currentMonth: '', noSantri: true };
  }

  // Get santri linked to this wali
  const waliList = await getWaliSantriBySantriId(db, user.santri_id);

  const today = new Date().toISOString().split('T')[0];
  const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

  return { user: user!, waliList, today, currentMonth, noSantri: false };
}

export default function PortalWali({ loaderData }: Route.ComponentProps) {
  const { user, waliList, today, currentMonth, noSantri } = loaderData as typeof loaderData & { noSantri?: boolean };
  const [absensi, setAbsensi] = useState<AbsensiWithSantri[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'harian' | 'bulanan'>('harian');
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const statusLabels: Record<StatusAbsensi, { label: string; bg: string; text: string }> = {
    hadir: { label: 'Hadir', bg: '#D1FAE5', text: '#065F46' },
    sakit: { label: 'Sakit', bg: '#DBEAFE', text: '#1E40AF' },
    izin: { label: 'Izin', bg: '#FEF3C7', text: '#92400E' },
    alpa: { label: 'Alpa', bg: '#FEE2E2', text: '#991B1B' },
  };

  async function loadAbsensi() {
    setLoading(true);
    try {
      // Fetch via bulanan API which aggregates by santri
      const url = `/api/laporan/bulanan?bulan=${selectedMonth}`;
      const res = await fetch(url);
      const data = await res.json();
      // Filter only absensi for this wali's santri
      if (data.laporan) {
        // Transform bulanan data to display format
        setAbsensi(data.laporan.map((l: { santri_nama: string; tanggal: string; status: string }) => ({
          id: 0,
          santri_id: 0,
          jadwal_id: 0,
          tanggal: l.tanggal || selectedDate,
          santri_nis: '',
          santri_nama: l.santri_nama,
          kelas_nama: '',
          status: l.status as StatusAbsensi,
          catatan: null,
          created_at: '',
          updated_at: '',
        })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (noSantri) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0D6B3E] flex items-center justify-center text-white">🕌</div>
              <h1 className="font-semibold text-[#1A1D23] text-sm">Portal Wali Santri</h1>
            </div>
            <form action="/logout" method="post">
              <button type="submit" className="btn-ghost btn-sm">🚪 Keluar</button>
            </form>
          </div>
        </header>
        <main className="max-w-[1200px] mx-auto p-4 md:p-6">
          <div className="empty-state py-16">
            <div className="empty-icon">👪</div>
            <p className="empty-text">Belum terhubung dengan santri</p>
            <p className="empty-subtext">Hubungi admin untuk menghubungkan akun Anda dengan santri</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0D6B3E] flex items-center justify-center text-white">🕌</div>
            <div>
              <h1 className="font-semibold text-[#1A1D23] text-sm">Portal Wali Santri</h1>
              <p className="text-[10px] text-[#6B7280]">Web Absensi Pesantren</p>
            </div>
          </div>
          <form action="/logout" method="post">
            <button type="submit" className="btn-ghost btn-sm">🚪 Keluar</button>
          </form>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto p-4 md:p-6">
        <div className="animate-fade-in">
          <div className="page-header">
            <div>
              <h1 className="page-title">Pantau Absensi</h1>
              <p className="page-subtitle">Lihat absensi santri wali Anda</p>
            </div>
          </div>

          {/* Info Wali */}
          <div className="card mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#0D6B3E] flex items-center justify-center text-white text-lg font-semibold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-[#1A1D23]">{user.username}</p>
                <p className="text-sm text-[#6B7280]">Role: Wali Santri</p>
              </div>
            </div>
            {waliList.length > 0 && (
              <div className="mt-3 p-3 bg-[#E8F5EF] rounded-[8px]">
                <p className="text-sm text-[#0D6B3E]">
                  📌 Terdaftar sebagai wali dari <strong>{waliList.length} santri</strong>
                </p>
              </div>
            )}
          </div>

          {/* Picker */}
          <div className="card mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex gap-2">
                <button onClick={() => setViewMode('harian')}
                  className={`px-4 py-2 rounded-[8px] text-sm font-medium transition-colors ${viewMode === 'harian' ? 'bg-[#0D6B3E] text-white' : 'bg-white text-[#6B7280] border border-[#D1D5DB]'}`}>Harian</button>
                <button onClick={() => setViewMode('bulanan')}
                  className={`px-4 py-2 rounded-[8px] text-sm font-medium transition-colors ${viewMode === 'bulanan' ? 'bg-[#0D6B3E] text-white' : 'bg-white text-[#6B7280] border border-[#D1D5DB]'}`}>Bulanan</button>
              </div>
              {viewMode === 'harian' ? (
                <input type="date" className="form-input max-w-[200px]" value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)} />
              ) : (
                <input type="month" className="form-input max-w-[200px]" value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)} />
              )}
              <button onClick={loadAbsensi} className="btn-primary">🔍 Lihat</button>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="loading-spinner" />
            </div>
          )}

          {/* Hasil Absensi */}
          {!loading && absensi.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">📋 Data Absensi</h2>
                <span className="text-sm text-[#6B7280]">{absensi.length} catatan</span>
              </div>
              <div className="space-y-2">
                {absensi.map(a => (
                  <div key={a.id} className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-[8px]">
                    <div>
                      <p className="text-sm font-medium text-[#1A1D23]">{a.santri_nama}</p>
                      <p className="text-xs text-[#6B7280]">{a.tanggal}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: statusLabels[a.status].bg, color: statusLabels[a.status].text }}>
                      {statusLabels[a.status].label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && absensi.length === 0 && (
            <div className="empty-state py-16">
              <div className="empty-icon">📋</div>
              <p className="empty-text">Belum ada data absensi</p>
              <p className="empty-subtext">Pilih tanggal dan klik "Lihat" untuk memantau absensi</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
