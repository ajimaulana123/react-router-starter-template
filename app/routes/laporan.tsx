import { useState } from 'react';
import { useLoaderData } from 'react-router';
import type { Route } from './+types/laporan';
import { getAuthUser, requireRole } from '~/lib/auth';
import { getDB, getAllKelas } from '~/lib/db';
import { Layout } from '~/components/layout';

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

export default function LaporanPage({ loaderData }: Route.ComponentProps) {
  const { user, kelas } = loaderData;
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

  return (
    <Layout user={user}>
      <div className="animate-fade-in">
        <div className="page-header">
          <div>
            <h1 className="page-title">Laporan</h1>
            <p className="page-subtitle">Rekap absensi harian dan bulanan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Laporan Harian */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">📋 Laporan Harian</h2>
            </div>
            <p className="text-sm text-[#6B7280] mb-4">
              Lihat rekap absensi per kelas untuk tanggal tertentu.
            </p>
            <form method="get" action="/api/laporan/harian" className="space-y-4">
              <div>
                <label className="form-label">Tanggal</label>
                <input
                  type="date"
                  name="tanggal"
                  className="form-input"
                  defaultValue={today}
                  required
                />
              </div>
              <div>
                <label className="form-label">Kelas</label>
                <select name="kelas_id" className="form-select" required>
                  <option value="">Semua Kelas</option>
                  {kelas.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.nama_kelas}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-primary w-full">
                Lihat Laporan
              </button>
            </form>
          </div>

          {/* Laporan Bulanan */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">📊 Rekap Bulanan</h2>
            </div>
            <p className="text-sm text-[#6B7280] mb-4">
              Lihat rekap absensi bulanan per santri.
            </p>
            <form method="get" action="/api/laporan/bulanan" className="space-y-4">
              <div>
                <label className="form-label">Bulan</label>
                <input
                  type="month"
                  name="bulan"
                  className="form-input"
                  defaultValue={currentMonth}
                  required
                />
              </div>
              <div>
                <label className="form-label">Kelas</label>
                <select name="kelas_id" className="form-select">
                  <option value="">Semua Kelas</option>
                  {kelas.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.nama_kelas}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-primary w-full">
                Lihat Rekap
              </button>
            </form>
          </div>

          {/* Summary Cards */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">📈 Statistik Kehadiran</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-[#D1FAE5] rounded-[8px]">
                <div className="w-3 h-3 rounded-full bg-[#059669] mx-auto mb-2" />
                <p className="text-2xl font-bold text-[#065F46]">Hadir</p>
              </div>
              <div className="text-center p-4 bg-[#DBEAFE] rounded-[8px]">
                <div className="w-3 h-3 rounded-full bg-[#2563EB] mx-auto mb-2" />
                <p className="text-2xl font-bold text-[#1E40AF]">Sakit</p>
              </div>
              <div className="text-center p-4 bg-[#FEF3C7] rounded-[8px]">
                <div className="w-3 h-3 rounded-full bg-[#D97706] mx-auto mb-2" />
                <p className="text-2xl font-bold text-[#92400E]">Izin</p>
              </div>
              <div className="text-center p-4 bg-[#FEE2E2] rounded-[8px]">
                <div className="w-3 h-3 rounded-full bg-[#DC2626] mx-auto mb-2" />
                <p className="text-2xl font-bold text-[#991B1B]">Alpa</p>
              </div>
            </div>
            <p className="text-xs text-[#9CA3AF] mt-4 text-center">
              Fitur laporan detail dan ekspor PDF/Excel akan segera hadir
            </p>
          </div>

          {/* Quick Info */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">ℹ️ Informasi</h2>
            </div>
            <div className="space-y-3 text-sm text-[#6B7280]">
              <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-[8px]">
                <span className="text-lg">📅</span>
                <span>Laporan harian menampilkan rekap per kelas per tanggal</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-[8px]">
                <span className="text-lg">📊</span>
                <span>Rekap bulanan menampilkan persentase kehadiran per santri</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-[8px]">
                <span className="text-lg">📄</span>
                <span>Ekspor PDF dan Excel akan tersedia di update berikutnya</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
