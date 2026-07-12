import { useState } from 'react';
import { useLoaderData, useFetcher } from 'react-router';
import type { Route } from './+types/jadwal';
import { getAuthUser, requireRole } from '~/lib/auth';
import { getDB, getAllJadwal, createJadwal, deleteJadwal, getAllUstadz, getAllKelas, getAllMataPelajaran } from '~/lib/db';
import { Layout } from '~/components/layout';
import type { JadwalWithRelations, Hari } from '~/lib/types';
import { HARI } from '~/lib/types';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Jadwal — Web Absensi Pesantren' }];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const secret = context.cloudflare.env.JWT_SECRET || 'absensi-pesantren-secret-key-2026';
  const db = getDB(context);
  const { user } = await getAuthUser(request, db, secret);
  requireRole(user, ['admin', 'ustadz']);

  const jadwal = await getAllJadwal(db);
  const ustadz = await getAllUstadz(db);
  const kelas = await getAllKelas(db);
  const mapel = await getAllMataPelajaran(db);

  return { user: user!, jadwal, ustadz, kelas, mapel };
}

export async function action({ request, context }: Route.ActionArgs) {
  const secret = context.cloudflare.env.JWT_SECRET || 'absensi-pesantren-secret-key-2026';
  const db = getDB(context);
  const { user } = await getAuthUser(request, db, secret);
  requireRole(user, ['admin']);

  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  if (intent === 'create') {
    await createJadwal(db, {
      ustadz_id: Number(formData.get('ustadz_id')),
      mapel_id: Number(formData.get('mapel_id')),
      kelas_id: Number(formData.get('kelas_id')),
      hari: formData.get('hari') as string,
      jam_masuk: formData.get('jam_masuk') as string,
      jam_keluar: formData.get('jam_keluar') as string,
    });
  } else if (intent === 'delete') {
    await deleteJadwal(db, Number(formData.get('id')));
  }

  return { success: true };
}

export default function JadwalPage({ loaderData }: Route.ComponentProps) {
  const { user, jadwal, ustadz, kelas, mapel } = loaderData;
  const [showModal, setShowModal] = useState(false);
  const [selectedHari, setSelectedHari] = useState<string>('');
  const [confirmDelete, setConfirmDelete] = useState<JadwalWithRelations | null>(null);
  const fetcher = useFetcher();

  const filteredJadwal = selectedHari
    ? jadwal.filter((j) => j.hari === selectedHari)
    : jadwal;

  const groupedByHari = HARI.reduce(
    (acc, hari) => {
      acc[hari] = filteredJadwal.filter((j) => j.hari === hari);
      return acc;
    },
    {} as Record<string, JadwalWithRelations[]>,
  );

  return (
    <Layout user={user}>
      <div className="animate-fade-in">
        <div className="page-header">
          <div>
            <h1 className="page-title">Jadwal Mengajar</h1>
            <p className="page-subtitle">Kelola jadwal kegiatan belajar mengajar</p>
          </div>
          {user.role === 'admin' && (
            <button onClick={() => setShowModal(true)} className="btn-primary">
              + Tambah Jadwal
            </button>
          )}
        </div>

        {/* Filter Hari */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedHari('')}
            className={`px-4 py-2 rounded-[8px] text-sm font-medium transition-colors ${
              !selectedHari
                ? 'bg-[#0D6B3E] text-white'
                : 'bg-white text-[#6B7280] border border-[#D1D5DB] hover:bg-[#F3F4F6]'
            }`}
          >
            Semua
          </button>
          {HARI.map((hari) => (
            <button
              key={hari}
              onClick={() => setSelectedHari(hari)}
              className={`px-4 py-2 rounded-[8px] text-sm font-medium transition-colors ${
                selectedHari === hari
                  ? 'bg-[#0D6B3E] text-white'
                  : 'bg-white text-[#6B7280] border border-[#D1D5DB] hover:bg-[#F3F4F6]'
              }`}
            >
              {hari}
            </button>
          ))}
        </div>

        {/* Jadwal Cards per Hari */}
        {HARI.map((hari) => {
          const jadwalHari = groupedByHari[hari];
          if (jadwalHari.length === 0 && selectedHari && selectedHari !== hari) return null;
          if (jadwalHari.length === 0 && !selectedHari) return null;

          return (
            <div key={hari} className="mb-6">
              {!selectedHari && (
                <h3 className="text-lg font-semibold text-[#1A1D23] mb-3">{hari}</h3>
              )}
              <div className="space-y-2">
                {jadwalHari.length === 0 ? (
                  <p className="text-sm text-[#6B7280] italic">Tidak ada jadwal</p>
                ) : (
                  jadwalHari.map((j) => (
                    <div
                      key={j.id}
                      className="flex items-center justify-between bg-white rounded-[8px] border border-[#E5E7EB] p-4 hover:border-[#0D6B3E]/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center min-w-[60px]">
                          <p className="text-sm font-bold text-[#0D6B3E]">{j.jam_masuk}</p>
                          <p className="text-xs text-[#6B7280]">{j.jam_keluar}</p>
                        </div>
                        <div className="w-px h-10 bg-[#E5E7EB]" />
                        <div>
                          <p className="font-medium text-[#1A1D23]">{j.mapel_nama}</p>
                          <p className="text-sm text-[#6B7280]">
                            {j.ustadz_nama} — {j.kelas_nama}
                          </p>
                        </div>
                      </div>
                      {user.role === 'admin' && (
                        <button
                          onClick={() => setConfirmDelete(j)}
                          className="btn-ghost btn-sm text-[#DC2626]"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}

        {jadwal.length === 0 && (
          <div className="empty-state py-16">
            <div className="empty-icon">📅</div>
            <p className="empty-text">Belum ada jadwal</p>
            <p className="empty-subtext">Buat jadwal untuk memulai absensi</p>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="text-lg font-semibold">Tambah Jadwal Baru</h3>
                <button onClick={() => setShowModal(false)} className="btn-ghost btn-sm">✕</button>
              </div>
              <fetcher.Form method="post" className="modal-body space-y-4">
                <input type="hidden" name="intent" value="create" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Ustadz</label>
                    <select name="ustadz_id" className="form-select" required>
                      <option value="">Pilih Ustadz</option>
                      {ustadz.filter(u => u.status === 'aktif').map((u) => (
                        <option key={u.id} value={u.id}>{u.nama}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Mata Pelajaran</label>
                    <select name="mapel_id" className="form-select" required>
                      <option value="">Pilih Mapel</option>
                      {mapel.map((m) => (
                        <option key={m.id} value={m.id}>{m.nama}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Kelas</label>
                    <select name="kelas_id" className="form-select" required>
                      <option value="">Pilih Kelas</option>
                      {kelas.map((k) => (
                        <option key={k.id} value={k.id}>{k.nama_kelas}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Hari</label>
                    <select name="hari" className="form-select" required>
                      <option value="">Pilih Hari</option>
                      {HARI.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Jam Masuk</label>
                    <input type="time" name="jam_masuk" className="form-input" required />
                  </div>
                  <div>
                    <label className="form-label">Jam Keluar</label>
                    <input type="time" name="jam_keluar" className="form-input" required />
                  </div>
                </div>
                <div className="modal-footer px-0 pb-0">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-ghost">Batal</button>
                  <button type="submit" className="btn-primary" onClick={() => setShowModal(false)}>Tambah</button>
                </div>
              </fetcher.Form>
            </div>
          </div>
        )}

        {confirmDelete && (
          <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
            <div className="modal-content max-w-sm" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header"><h3 className="text-lg font-semibold text-[#DC2626]">Hapus Jadwal</h3></div>
              <div className="modal-body text-center">
                <p className="text-[#6B7280]">Hapus jadwal <span className="font-semibold">{confirmDelete.mapel_nama}</span>?</p>
              </div>
              <div className="modal-footer">
                <button onClick={() => setConfirmDelete(null)} className="btn-ghost">Batal</button>
                <fetcher.Form method="post">
                  <input type="hidden" name="intent" value="delete" />
                  <input type="hidden" name="id" value={confirmDelete.id} />
                  <button type="submit" className="btn-danger" onClick={() => setConfirmDelete(null)}>Ya, Hapus</button>
                </fetcher.Form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
