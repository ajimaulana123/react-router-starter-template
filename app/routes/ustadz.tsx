import { useState, useEffect } from 'react';
import { useLoaderData, useFetcher } from 'react-router';
import type { Route } from './+types/ustadz';
import { getAuthUser, requireRole } from '~/lib/auth';
import { getDB, getAllUstadz, createUstadz, updateUstadz, deleteUstadz } from '~/lib/db';
import { Layout } from '~/components/layout';
import type { Ustadz } from '~/lib/types';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Data Ustadz — Web Absensi Pesantren' }];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const secret = context.cloudflare.env.JWT_SECRET || 'absensi-pesantren-secret-key-2026';
  const db = getDB(context);
  const { user } = await getAuthUser(request, db, secret);
  requireRole(user, ['admin']);
  const ustadz = await getAllUstadz(db);
  return { user: user!, ustadz };
}

export async function action({ request, context }: Route.ActionArgs) {
  const secret = context.cloudflare.env.JWT_SECRET || 'absensi-pesantren-secret-key-2026';
  const db = getDB(context);
  const { user } = await getAuthUser(request, db, secret);
  requireRole(user, ['admin']);
  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  if (intent === 'create') {
    await createUstadz(db, {
      nip: formData.get('nip') as string,
      nama: formData.get('nama') as string,
      kontak: (formData.get('kontak') as string) || undefined,
      bidang: (formData.get('bidang') as string) || undefined,
      status: (formData.get('status') as 'aktif' | 'tidak_aktif') || 'aktif',
    });
  } else if (intent === 'update') {
    await updateUstadz(db, Number(formData.get('id')), {
      nip: formData.get('nip') as string,
      nama: formData.get('nama') as string,
      kontak: (formData.get('kontak') as string) || undefined,
      bidang: (formData.get('bidang') as string) || undefined,
      status: (formData.get('status') as 'aktif' | 'tidak_aktif') || 'aktif',
    });
  } else if (intent === 'delete') {
    await deleteUstadz(db, Number(formData.get('id')));
  }
  return { success: true };
}

export default function UstadzPage({ loaderData }: Route.ComponentProps) {
  const { user, ustadz } = loaderData;
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Ustadz | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Ustadz | null>(null);
  const fetcher = useFetcher();

  function openCreate() { setEditing(null); setShowModal(true); }
  function openEdit(u: Ustadz) { setEditing(u); setShowModal(true); }
  function closeModal() { setShowModal(false); setEditing(null); }

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.success) closeModal();
  }, [fetcher.state, fetcher.data]);

  return (
    <Layout user={user}>
      <div className="animate-fade-in">
        <div className="page-header">
          <div>
            <h1 className="page-title">Data Ustadz</h1>
            <p className="page-subtitle">Kelola data ustadz/ustadzah pengajar</p>
          </div>
          <button onClick={openCreate} className="btn-primary">+ Tambah Ustadz</button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>NIP</th>
                <th>Nama</th>
                <th>Kontak</th>
                <th>Bidang</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {ustadz.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-[#6B7280]">Belum ada data ustadz</td></tr>
              ) : (
                ustadz.map((u, i) => (
                  <tr key={u.id}>
                    <td className="text-[#6B7280]">{i + 1}</td>
                    <td className="font-mono text-xs">{u.nip}</td>
                    <td className="font-medium">{u.nama}</td>
                    <td>{u.kontak || '-'}</td>
                    <td>{u.bidang || '-'}</td>
                    <td>
                      <span className={u.status === 'aktif' ? 'badge-aktif' : 'badge-alumni'}>
                        {u.status === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(u)} className="btn-ghost btn-sm">✏️</button>
                        <button onClick={() => setConfirmDelete(u)} className="btn-ghost btn-sm text-[#DC2626]">🗑️</button>
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
                <h3 className="text-lg font-semibold">{editing ? 'Edit Ustadz' : 'Tambah Ustadz Baru'}</h3>
                <button onClick={closeModal} className="btn-ghost btn-sm">✕</button>
              </div>
              <fetcher.Form method="post" className="modal-body space-y-4">
                <input type="hidden" name="intent" value={editing ? 'update' : 'create'} />
                {editing && <input type="hidden" name="id" value={editing.id} />}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">NIP</label>
                    <input type="text" name="nip" className="form-input" required defaultValue={editing?.nip} />
                  </div>
                  <div>
                    <label className="form-label">Nama Lengkap</label>
                    <input type="text" name="nama" className="form-input" required defaultValue={editing?.nama} />
                  </div>
                  <div>
                    <label className="form-label">Kontak</label>
                    <input type="text" name="kontak" className="form-input" defaultValue={editing?.kontak || ''} />
                  </div>
                  <div>
                    <label className="form-label">Bidang</label>
                    <input type="text" name="bidang" className="form-input" defaultValue={editing?.bidang || ''} />
                  </div>
                  <div>
                    <label className="form-label">Status</label>
                    <select name="status" className="form-select" defaultValue={editing?.status || 'aktif'}>
                      <option value="aktif">Aktif</option>
                      <option value="tidak_aktif">Tidak Aktif</option>
                    </select>
                  </div>
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
              <div className="modal-header"><h3 className="text-lg font-semibold text-[#DC2626]">Hapus Ustadz</h3></div>
              <div className="modal-body text-center">
                <p className="text-[#6B7280]">Hapus <span className="font-semibold">{confirmDelete.nama}</span>?</p>
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
