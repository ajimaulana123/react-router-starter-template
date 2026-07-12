import { useState, useEffect } from 'react';
import { useLoaderData, useFetcher } from 'react-router';
import type { Route } from './+types/kelas';
import { getAuthUser, requireRole } from '~/lib/auth';
import { getDB, getAllKelas, createKelas, updateKelas, deleteKelas, getAllUstadz } from '~/lib/db';
import { Layout } from '~/components/layout';
import type { KelasWithWali } from '~/lib/types';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Data Kelas — Web Absensi Pesantren' }];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const secret = context.cloudflare.env.JWT_SECRET || 'absensi-pesantren-secret-key-2026';
  const db = getDB(context);
  const { user } = await getAuthUser(request, db, secret);
  requireRole(user, ['admin']);

  const kelas = await getAllKelas(db);
  const ustadz = await getAllUstadz(db);

  return { user: user!, kelas, ustadz };
}

export async function action({ request, context }: Route.ActionArgs) {
  const secret = context.cloudflare.env.JWT_SECRET || 'absensi-pesantren-secret-key-2026';
  const db = getDB(context);
  const { user } = await getAuthUser(request, db, secret);
  requireRole(user, ['admin']);

  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  if (intent === 'create') {
    await createKelas(db, {
      nama_kelas: formData.get('nama_kelas') as string,
      tingkat: (formData.get('tingkat') as string) || undefined,
      wali_kelas_id: formData.get('wali_kelas_id')
        ? Number(formData.get('wali_kelas_id'))
        : undefined,
    });
  } else if (intent === 'update') {
    const id = Number(formData.get('id'));
    await updateKelas(db, id, {
      nama_kelas: formData.get('nama_kelas') as string,
      tingkat: (formData.get('tingkat') as string) || undefined,
      wali_kelas_id: formData.get('wali_kelas_id')
        ? Number(formData.get('wali_kelas_id'))
        : undefined,
    });
  } else if (intent === 'delete') {
    await deleteKelas(db, Number(formData.get('id')));
  }

  return { success: true };
}

export default function KelasPage({ loaderData }: Route.ComponentProps) {
  const { user, kelas, ustadz } = loaderData;
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<KelasWithWali | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<KelasWithWali | null>(null);
  const fetcher = useFetcher();

  function openCreate() { setEditing(null); setShowModal(true); }
  function openEdit(k: KelasWithWali) { setEditing(k); setShowModal(true); }
  function closeModal() { setShowModal(false); setEditing(null); }

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.success) closeModal();
  }, [fetcher.state, fetcher.data]);

  return (
    <Layout user={user}>
      <div className="animate-fade-in">
        <div className="page-header">
          <div>
            <h1 className="page-title">Data Kelas</h1>
            <p className="page-subtitle">Kelola data kelas/tingkatan pondok pesantren</p>
          </div>
          <button onClick={openCreate} className="btn-primary">+ Tambah Kelas</button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Kelas</th>
                <th>Tingkat</th>
                <th>Wali Kelas</th>
                <th>Jumlah Santri</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {kelas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#6B7280]">
                    Belum ada data kelas
                  </td>
                </tr>
              ) : (
                kelas.map((k, i) => (
                  <tr key={k.id}>
                    <td className="text-[#6B7280]">{i + 1}</td>
                    <td className="font-medium">{k.nama_kelas}</td>
                    <td>{k.tingkat || '-'}</td>
                    <td>{k.wali_kelas_nama || '-'}</td>
                    <td>
                      <span className="badge-aktif">{k.jumlah_santri} santri</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(k)} className="btn-ghost btn-sm">✏️</button>
                        <button onClick={() => setConfirmDelete(k)} className="btn-ghost btn-sm text-[#DC2626]">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="text-lg font-semibold">{editing ? 'Edit Kelas' : 'Tambah Kelas Baru'}</h3>
                <button onClick={closeModal} className="btn-ghost btn-sm">✕</button>
              </div>
              <fetcher.Form method="post" className="modal-body space-y-4">
                <input type="hidden" name="intent" value={editing ? 'update' : 'create'} />
                {editing && <input type="hidden" name="id" value={editing.id} />}
                <div>
                  <label className="form-label">Nama Kelas</label>
                  <input type="text" name="nama_kelas" className="form-input" required defaultValue={editing?.nama_kelas} />
                </div>
                <div>
                  <label className="form-label">Tingkat</label>
                  <input type="text" name="tingkat" className="form-input" defaultValue={editing?.tingkat || ''} placeholder="Contoh: 1, 2, 3 atau A, B, C" />
                </div>
                <div>
                  <label className="form-label">Wali Kelas</label>
                  <select name="wali_kelas_id" className="form-select" defaultValue={editing?.wali_kelas_id || ''}>
                    <option value="">Pilih Wali Kelas</option>
                    {ustadz.map((u) => (
                      <option key={u.id} value={u.id}>{u.nama}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-footer px-0 pb-0">
                  <button type="button" onClick={closeModal} className="btn-ghost">Batal</button>
                  <button type="submit" className="btn-primary" disabled={fetcher.state === 'submitting'}>
                    {fetcher.state === 'submitting' ? '⏳ Menyimpan...' : (editing ? 'Simpan' : 'Tambah')}
                  </button>
                </div>
              </fetcher.Form>
            </div>
          </div>
        )}

        {confirmDelete && (
          <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
            <div className="modal-content max-w-sm" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="text-lg font-semibold text-[#DC2626]">Hapus Kelas</h3>
              </div>
              <div className="modal-body text-center">
                <p className="text-[#6B7280]">
                  Apakah Anda yakin ingin menghapus <span className="font-semibold text-[#1A1D23]">{confirmDelete.nama_kelas}</span>?
                </p>
                <p className="text-xs text-[#9CA3AF] mt-2">Tindakan ini tidak dapat dibatalkan.</p>
              </div>
              <div className="modal-footer">
                <button onClick={() => setConfirmDelete(null)} className="btn-ghost">Batal</button>
                <fetcher.Form method="post">
                  <input type="hidden" name="intent" value="delete" />
                  <input type="hidden" name="id" value={confirmDelete.id} />
                  <button type="submit" className="btn-danger" disabled={fetcher.state === 'submitting'}>
                    {fetcher.state === 'submitting' ? '⏳ Menghapus...' : 'Ya, Hapus'}
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
