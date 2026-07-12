import { useState, useEffect } from 'react';
import { useLoaderData, useFetcher } from 'react-router';
import type { Route } from './+types/mapel';
import { getAuthUser, requireRole } from '~/lib/auth';
import { getDB, getAllMataPelajaran, createMataPelajaran, updateMataPelajaran, deleteMataPelajaran } from '~/lib/db';
import { Layout } from '~/components/layout';
import type { MataPelajaran } from '~/lib/types';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Mata Pelajaran — Web Absensi Pesantren' }];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const secret = context.cloudflare.env.JWT_SECRET || 'absensi-pesantren-secret-key-2026';
  const db = getDB(context);
  const { user } = await getAuthUser(request, db, secret);
  requireRole(user, ['admin']);
  const mapel = await getAllMataPelajaran(db);
  return { user: user!, mapel };
}

export async function action({ request, context }: Route.ActionArgs) {
  const secret = context.cloudflare.env.JWT_SECRET || 'absensi-pesantren-secret-key-2026';
  const db = getDB(context);
  const { user } = await getAuthUser(request, db, secret);
  requireRole(user, ['admin']);
  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  if (intent === 'create') {
    await createMataPelajaran(db, {
      kode: formData.get('kode') as string,
      nama: formData.get('nama') as string,
      deskripsi: (formData.get('deskripsi') as string) || undefined,
    });
  } else if (intent === 'update') {
    await updateMataPelajaran(db, Number(formData.get('id')), {
      kode: formData.get('kode') as string,
      nama: formData.get('nama') as string,
      deskripsi: (formData.get('deskripsi') as string) || undefined,
    });
  } else if (intent === 'delete') {
    await deleteMataPelajaran(db, Number(formData.get('id')));
  }
  return { success: true };
}

export default function MapelPage({ loaderData }: Route.ComponentProps) {
  const { user, mapel } = loaderData;
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<MataPelajaran | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<MataPelajaran | null>(null);
  const fetcher = useFetcher();

  function openCreate() { setEditing(null); setShowModal(true); }
  function openEdit(m: MataPelajaran) { setEditing(m); setShowModal(true); }
  function closeModal() { setShowModal(false); setEditing(null); }

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.success) closeModal();
  }, [fetcher.state, fetcher.data]);

  return (
    <Layout user={user}>
      <div className="animate-fade-in">
        <div className="page-header">
          <div>
            <h1 className="page-title">Mata Pelajaran</h1>
            <p className="page-subtitle">Kelola data mata pelajaran pondok pesantren</p>
          </div>
          <button onClick={openCreate} className="btn-primary">+ Tambah Mapel</button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Kode</th>
                <th>Nama</th>
                <th>Deskripsi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {mapel.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-[#6B7280]">Belum ada data mata pelajaran</td></tr>
              ) : (
                mapel.map((m, i) => (
                  <tr key={m.id}>
                    <td className="text-[#6B7280]">{i + 1}</td>
                    <td className="font-mono text-xs">{m.kode}</td>
                    <td className="font-medium">{m.nama}</td>
                    <td className="max-w-[300px] truncate text-[#6B7280]">{m.deskripsi || '-'}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(m)} className="btn-ghost btn-sm">✏️</button>
                        <button onClick={() => setConfirmDelete(m)} className="btn-ghost btn-sm text-[#DC2626]">🗑️</button>
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
                <h3 className="text-lg font-semibold">{editing ? 'Edit Mapel' : 'Tambah Mapel Baru'}</h3>
                <button onClick={closeModal} className="btn-ghost btn-sm">✕</button>
              </div>
              <fetcher.Form method="post" className="modal-body space-y-4">
                <input type="hidden" name="intent" value={editing ? 'update' : 'create'} />
                {editing && <input type="hidden" name="id" value={editing.id} />}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Kode</label>
                    <input type="text" name="kode" className="form-input" required defaultValue={editing?.kode} />
                  </div>
                  <div>
                    <label className="form-label">Nama</label>
                    <input type="text" name="nama" className="form-input" required defaultValue={editing?.nama} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="form-label">Deskripsi</label>
                    <textarea name="deskripsi" className="form-textarea" rows={2} defaultValue={editing?.deskripsi || ''} />
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
              <div className="modal-header"><h3 className="text-lg font-semibold text-[#DC2626]">Hapus Mapel</h3></div>
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
