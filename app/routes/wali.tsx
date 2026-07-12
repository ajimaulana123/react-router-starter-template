import { useState, useEffect, useCallback } from 'react';
import { useLoaderData, useFetcher } from 'react-router';
import type { Route } from './+types/wali';
import { getAuthUser, requireRole } from '~/lib/auth';
import { getDB, getAllWaliSantri, getAllSantri, createWaliSantri, updateWaliSantri, deleteWaliSantri } from '~/lib/db';
import { Layout } from '~/components/layout';
import { Toast } from '~/components/toast';
import type { WaliSantriWithSantri } from '~/lib/types';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Wali Santri — Web Absensi Pesantren' }];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const secret = context.cloudflare.env.JWT_SECRET || 'absensi-pesantren-secret-key-2026';
  const db = getDB(context);
  const { user } = await getAuthUser(request, db, secret);
  requireRole(user, ['admin']);
  const wali = await getAllWaliSantri(db);
  const santri = await getAllSantri(db);
  return { user: user!, wali, santri };
}

export async function action({ request, context }: Route.ActionArgs) {
  const secret = context.cloudflare.env.JWT_SECRET || 'absensi-pesantren-secret-key-2026';
  const db = getDB(context);
  const { user } = await getAuthUser(request, db, secret);
  requireRole(user, ['admin']);
  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  if (intent === 'create') {
    await createWaliSantri(db, {
      nama: formData.get('nama') as string,
      kontak: (formData.get('kontak') as string) || undefined,
      hubungan: (formData.get('hubungan') as string) || undefined,
      santri_id: Number(formData.get('santri_id')),
    });
  } else if (intent === 'update') {
    await updateWaliSantri(db, Number(formData.get('id')), {
      nama: formData.get('nama') as string,
      kontak: (formData.get('kontak') as string) || undefined,
      hubungan: (formData.get('hubungan') as string) || undefined,
      santri_id: Number(formData.get('santri_id')),
    });
  } else if (intent === 'delete') {
    await deleteWaliSantri(db, Number(formData.get('id')));
  }
  return { success: true };
}

export default function WaliPage({ loaderData }: Route.ComponentProps) {
  const { user, wali, santri } = loaderData;
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<WaliSantriWithSantri | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<WaliSantriWithSantri | null>(null);
  const [search, setSearch] = useState('');
  const fetcher = useFetcher();

  const filtered = wali.filter(w =>
    w.nama.toLowerCase().includes(search.toLowerCase()) ||
    w.santri_nama?.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() { setEditing(null); setShowModal(true); }
  function openEdit(w: WaliSantriWithSantri) { setEditing(w); setShowModal(true); }
  function closeModal() { setShowModal(false); setEditing(null); }

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.success) {
      closeModal();
      const wasDelete = confirmDelete !== null;
      setConfirmDelete(null);
      setToast({
        message: wasDelete ? 'Data berhasil dihapus!' : 'Data berhasil disimpan!',
        type: 'success',
      });
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <Layout user={user}>
      <div className="animate-fade-in">
        <div className="page-header">
          <div>
            <h1 className="page-title">Wali Santri</h1>
            <p className="page-subtitle">Kelola data wali/orang tua santri</p>
          </div>
          <button onClick={openCreate} className="btn-primary">+ Tambah Wali</button>
        </div>

        <input id="search-wali" type="text" placeholder="Cari wali atau nama santri..." className="form-input max-w-md mb-4"
          value={search} onChange={(e) => setSearch(e.target.value)} />

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Wali</th>
                <th>Kontak</th>
                <th>Hubungan</th>
                <th>Santri</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-[#6B7280]">Belum ada data wali santri</td></tr>
              ) : (
                filtered.map((w, i) => (
                  <tr key={w.id}>
                    <td className="text-[#6B7280]">{i + 1}</td>
                    <td className="font-medium">{w.nama}</td>
                    <td>{w.kontak || '-'}</td>
                    <td>{w.hubungan || '-'}</td>
                    <td>{w.santri_nama} <span className="text-xs text-[#6B7280]">({w.santri_nis})</span></td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(w)} className="btn-ghost btn-sm">✏️</button>
                        <button onClick={() => setConfirmDelete(w)} className="btn-ghost btn-sm text-[#DC2626]">🗑️</button>
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
            <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="text-lg font-semibold">{editing ? 'Edit Wali' : 'Tambah Wali Baru'}</h3>
                <button onClick={closeModal} className="btn-ghost btn-sm">✕</button>
              </div>
              <fetcher.Form method="post" className="modal-body space-y-4">
                <input type="hidden" name="intent" value={editing ? 'update' : 'create'} />
                {editing && <input type="hidden" name="id" value={editing.id} />}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="nama" className="form-label">Nama Wali</label>
                    <input id="nama" type="text" name="nama" className="form-input" required defaultValue={editing?.nama} />
                  </div>
                  <div>
                    <label htmlFor="kontak" className="form-label">Kontak (No. HP)</label>
                    <input id="kontak" type="text" name="kontak" className="form-input" defaultValue={editing?.kontak || ''} />
                  </div>
                  <div>
                    <label htmlFor="hubungan" className="form-label">Hubungan</label>
                    <select id="hubungan" name="hubungan" className="form-select" defaultValue={editing?.hubungan || ''}>
                      <option value="">Pilih Hubungan</option>
                      <option value="Ayah">Ayah</option>
                      <option value="Ibu">Ibu</option>
                      <option value="Kakak">Kakak</option>
                      <option value="Paman">Paman</option>
                      <option value="Bibi">Bibi</option>
                      <option value="Kakek">Kakek</option>
                      <option value="Nenek">Nenek</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="santri_id" className="form-label">Santri</label>
                    <select id="santri_id" name="santri_id" className="form-select" required defaultValue={editing?.santri_id}>
                      <option value="">Pilih Santri</option>
                      {santri.map(s => (
                        <option key={s.id} value={s.id}>{s.nama} ({s.nis})</option>
                      ))}
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
              <div className="modal-header"><h3 className="text-lg font-semibold text-[#DC2626]">Hapus Wali</h3></div>
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

        <Toast message={toast?.message ?? null} type={toast?.type} onClose={closeToast} />
      </div>
    </Layout>
  );
}
