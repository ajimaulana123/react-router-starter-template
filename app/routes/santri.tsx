import { useState } from 'react';
import {
  Form,
  useLoaderData,
  useFetcher,
  useNavigation,
  useSearchParams,
} from 'react-router';
import type { Route } from './+types/santri';
import { getAuthUser, requireRole } from '~/lib/auth';
import { getDB, getAllSantri, createSantri, updateSantri, deleteSantri, getAllKelas } from '~/lib/db';
import { Layout } from '~/components/layout';
import type { UserPublic, SantriWithKelas, KelasWithWali } from '~/lib/types';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Data Santri — Web Absensi Pesantren' }];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const secret = context.cloudflare.env.JWT_SECRET || 'absensi-pesantren-secret-key-2026';
  const db = getDB(context);
  const { user } = await getAuthUser(request, db, secret);
  requireRole(user, ['admin']);

  const santri = await getAllSantri(db);
  const kelas = await getAllKelas(db);

  return { user: user!, santri, kelas };
}

export async function action({ request, context }: Route.ActionArgs) {
  const secret = context.cloudflare.env.JWT_SECRET || 'absensi-pesantren-secret-key-2026';
  const db = getDB(context);
  const { user } = await getAuthUser(request, db, secret);
  requireRole(user, ['admin']);

  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  if (intent === 'create') {
    await createSantri(db, {
      nis: formData.get('nis') as string,
      nama: formData.get('nama') as string,
      kelas_id: Number(formData.get('kelas_id')),
      alamat: (formData.get('alamat') as string) || undefined,
      no_telp_wali: (formData.get('no_telp_wali') as string) || undefined,
      status: (formData.get('status') as 'aktif' | 'alumni') || 'aktif',
    });
  } else if (intent === 'update') {
    const id = Number(formData.get('id'));
    await updateSantri(db, id, {
      nis: formData.get('nis') as string,
      nama: formData.get('nama') as string,
      kelas_id: Number(formData.get('kelas_id')),
      alamat: (formData.get('alamat') as string) || undefined,
      no_telp_wali: (formData.get('no_telp_wali') as string) || undefined,
      status: (formData.get('status') as 'aktif' | 'alumni') || 'aktif',
    });
  } else if (intent === 'delete') {
    const id = Number(formData.get('id'));
    await deleteSantri(db, id);
  }

  return { success: true };
}

export default function SantriPage({ loaderData }: Route.ComponentProps) {
  const { user, santri, kelas } = loaderData;
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSantri, setEditingSantri] = useState<SantriWithKelas | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<SantriWithKelas | null>(null);
  const fetcher = useFetcher();

  const filteredSantri = santri.filter(
    (s) =>
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nis.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  function openCreate() {
    setEditingSantri(null);
    setShowModal(true);
  }

  function openEdit(s: SantriWithKelas) {
    setEditingSantri(s);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingSantri(null);
  }

  return (
    <Layout user={user}>
      <div className="animate-fade-in">
        <div className="page-header">
          <div>
            <h1 className="page-title">Data Santri</h1>
            <p className="page-subtitle">
              Kelola data santri pondok pesantren
            </p>
          </div>
          <button onClick={openCreate} className="btn-primary">
            + Tambah Santri
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Cari santri berdasarkan nama atau NIS..."
            className="form-input max-w-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>NIS</th>
                <th>Nama</th>
                <th>Kelas</th>
                <th>Alamat</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredSantri.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#6B7280]">
                    {searchQuery
                      ? 'Tidak ada santri yang cocok dengan pencarian'
                      : 'Belum ada data santri'}
                  </td>
                </tr>
              ) : (
                filteredSantri.map((s, i) => (
                  <tr key={s.id}>
                    <td className="text-[#6B7280]">{i + 1}</td>
                    <td className="font-mono text-xs">{s.nis}</td>
                    <td className="font-medium">{s.nama}</td>
                    <td>{s.kelas_nama}</td>
                    <td className="max-w-[200px] truncate text-[#6B7280]">
                      {s.alamat || '-'}
                    </td>
                    <td>
                      <span className={s.status === 'aktif' ? 'badge-aktif' : 'badge-alumni'}>
                        {s.status === 'aktif' ? 'Aktif' : 'Alumni'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(s)}
                          className="btn-ghost btn-sm"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => setConfirmDelete(s)}
                          className="btn-ghost btn-sm text-[#DC2626]"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="text-lg font-semibold text-[#1A1D23]">
                  {editingSantri ? 'Edit Santri' : 'Tambah Santri Baru'}
                </h3>
                <button onClick={closeModal} className="btn-ghost btn-sm">
                  ✕
                </button>
              </div>
              <fetcher.Form method="post" className="modal-body space-y-4">
                <input
                  type="hidden"
                  name="intent"
                  value={editingSantri ? 'update' : 'create'}
                />
                {editingSantri && (
                  <input type="hidden" name="id" value={editingSantri.id} />
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">NIS</label>
                    <input
                      type="text"
                      name="nis"
                      className="form-input"
                      required
                      defaultValue={editingSantri?.nis}
                    />
                  </div>
                  <div>
                    <label className="form-label">Nama Lengkap</label>
                    <input
                      type="text"
                      name="nama"
                      className="form-input"
                      required
                      defaultValue={editingSantri?.nama}
                    />
                  </div>
                  <div>
                    <label className="form-label">Kelas</label>
                    <select
                      name="kelas_id"
                      className="form-select"
                      required
                      defaultValue={editingSantri?.kelas_id}
                    >
                      <option value="">Pilih Kelas</option>
                      {kelas.map((k) => (
                        <option key={k.id} value={k.id}>
                          {k.nama_kelas}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Status</label>
                    <select
                      name="status"
                      className="form-select"
                      defaultValue={editingSantri?.status || 'aktif'}
                    >
                      <option value="aktif">Aktif</option>
                      <option value="alumni">Alumni</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="form-label">Alamat</label>
                    <textarea
                      name="alamat"
                      className="form-textarea"
                      rows={2}
                      defaultValue={editingSantri?.alamat || ''}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="form-label">No. Telepon Wali</label>
                    <input
                      type="text"
                      name="no_telp_wali"
                      className="form-input"
                      defaultValue={editingSantri?.no_telp_wali || ''}
                    />
                  </div>
                </div>
                <div className="modal-footer px-0 pb-0">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-ghost"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    onClick={closeModal}
                  >
                    {editingSantri ? 'Simpan Perubahan' : 'Tambah Santri'}
                  </button>
                </div>
              </fetcher.Form>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {confirmDelete && (
          <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
            <div className="modal-content max-w-sm" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="text-lg font-semibold text-[#DC2626]">
                  Hapus Santri
                </h3>
              </div>
              <div className="modal-body text-center">
                <p className="text-[#6B7280]">
                  Apakah Anda yakin ingin menghapus{' '}
                  <span className="font-semibold text-[#1A1D23]">
                    {confirmDelete.nama}
                  </span>
                  ?
                </p>
                <p className="text-xs text-[#9CA3AF] mt-2">
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="btn-ghost"
                >
                  Batal
                </button>
                <fetcher.Form method="post">
                  <input type="hidden" name="intent" value="delete" />
                  <input type="hidden" name="id" value={confirmDelete.id} />
                  <button
                    type="submit"
                    className="btn-danger"
                    onClick={() => setConfirmDelete(null)}
                  >
                    Ya, Hapus
                  </button>
                </fetcher.Form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
