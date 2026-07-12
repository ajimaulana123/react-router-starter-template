import { useState, useEffect } from 'react';
import { Form, useLoaderData, useFetcher, useNavigation, useSearchParams } from 'react-router';
import type { Route } from './+types/absensi';
import { getAuthUser, requireRole } from '~/lib/auth';
import { getDB, getAllJadwal, getSantriByKelas, getAbsensiByJadwalTanggal, batchCreateAbsensi } from '~/lib/db';
import { Layout } from '~/components/layout';
import type { StatusAbsensi, AbsensiWithSantri, SantriWithKelas } from '~/lib/types';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Absensi — Web Absensi Pesantren' }];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const secret = context.cloudflare.env.JWT_SECRET || 'absensi-pesantren-secret-key-2026';
  const db = getDB(context);
  const { user } = await getAuthUser(request, db, secret);
  requireRole(user, ['admin', 'ustadz']);

  const jadwal = await getAllJadwal(db);
  const today = new Date().toISOString().split('T')[0];

  return { user: user!, jadwal, today };
}

export async function action({ request, context }: Route.ActionArgs) {
  const secret = context.cloudflare.env.JWT_SECRET || 'absensi-pesantren-secret-key-2026';
  const db = getDB(context);
  const { user } = await getAuthUser(request, db, secret);
  requireRole(user, ['admin', 'ustadz']);

  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  if (intent === 'save') {
    const jadwalId = Number(formData.get('jadwal_id'));
    const tanggal = formData.get('tanggal') as string;

    const santriIds = (formData.get('santri_ids') as string).split(',').filter(Boolean);

    const records = santriIds.map((santriId) => ({
      santri_id: Number(santriId),
      jadwal_id: jadwalId,
      tanggal,
      status: (formData.get(`status_${santriId}`) as StatusAbsensi) || 'hadir',
      catatan: (formData.get(`catatan_${santriId}`) as string) || undefined,
    }));

    await batchCreateAbsensi(db, records);
    return { success: true, message: 'Absensi berhasil disimpan!' };
  }

  return { success: false, error: 'Invalid intent' };
}

export default function AbsensiPage({ loaderData }: Route.ComponentProps) {
  const { user, jadwal, today } = loaderData;
  const [searchParams] = useSearchParams();
  const initialJadwalId = searchParams.get('jadwal_id');
  const [selectedJadwalId, setSelectedJadwalId] = useState<number | null>(
    initialJadwalId ? Number(initialJadwalId) : null
  );
  const [selectedTanggal, setSelectedTanggal] = useState(today);
  const [santri, setSantri] = useState<SantriWithKelas[]>([]);
  const [existingAbsensi, setExistingAbsensi] = useState<AbsensiWithSantri[]>([]);
  const [statuses, setStatuses] = useState<Record<number, StatusAbsensi>>({});
  const [catatans, setCatatans] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fetcher = useFetcher();

  const selectedJadwal = jadwal.find((j) => j.id === selectedJadwalId);

  // Auto-load when page opens with ?jadwal_id=X from dashboard ustadz
  useEffect(() => {
    if (selectedJadwalId) {
      handleJadwalSelect(selectedJadwalId);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch santri data via API route when jadwal changes
  async function handleJadwalSelect(jadwalId: number) {
    setSelectedJadwalId(jadwalId);
    setLoading(true);
    setMessage(null);

    try {
      // For now, fetch via loader with query params
      const response = await fetch(
        `/absensi/data?jadwal_id=${jadwalId}&tanggal=${selectedTanggal}`,
      );
      const data = await response.json();
      if (data.santri) {
        setSantri(data.santri);
        const initialStatuses: Record<number, StatusAbsensi> = {};
        const initialCatatans: Record<number, string> = {};
        data.santri.forEach((s: SantriWithKelas) => {
          const existing = data.absensi?.find(
            (a: AbsensiWithSantri) => a.santri_id === s.id,
          );
          initialStatuses[s.id] = existing?.status || 'hadir';
          initialCatatans[s.id] = existing?.catatan || '';
        });
        setStatuses(initialStatuses);
        setCatatans(initialCatatans);
        setExistingAbsensi(data.absensi || []);
      }
    } catch (err) {
      console.error('Failed to load absensi data', err);
    } finally {
      setLoading(false);
    }
  }

  const statusColors: Record<StatusAbsensi, { bg: string; text: string; label: string }> = {
    hadir: { bg: '#D1FAE5', text: '#065F46', label: 'Hadir' },
    sakit: { bg: '#DBEAFE', text: '#1E40AF', label: 'Sakit' },
    izin: { bg: '#FEF3C7', text: '#92400E', label: 'Izin' },
    alpa: { bg: '#FEE2E2', text: '#991B1B', label: 'Alpa' },
  };

  return (
    <Layout user={user}>
      <div className="animate-fade-in">
        <div className="page-header">
          <div>
            <h1 className="page-title">Absensi</h1>
            <p className="page-subtitle">Catat kehadiran santri per jadwal</p>
          </div>
        </div>

        {/* Selection */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Pilih Jadwal</label>
              <select
                className="form-select"
                value={selectedJadwalId || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) handleJadwalSelect(Number(val));
                  else setSelectedJadwalId(null);
                }}
              >
                <option value="">Pilih Jadwal</option>
                {jadwal.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.mapel_nama} — {j.kelas_nama} ({j.hari}, {j.jam_masuk})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Tanggal</label>
              <input
                type="date"
                className="form-input"
                value={selectedTanggal}
                onChange={(e) => {
                  setSelectedTanggal(e.target.value);
                  if (selectedJadwalId) handleJadwalSelect(selectedJadwalId);
                }}
              />
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-4 ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {message.text}
          </div>
        )}

        {/* Absensi Form */}
        {selectedJadwal && (
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">{selectedJadwal.mapel_nama}</h2>
                <p className="text-sm text-[#6B7280]">
                  {selectedJadwal.kelas_nama} — {selectedJadwal.ustadz_nama}
                </p>
              </div>
              <span className="text-sm text-[#6B7280]">{selectedTanggal}</span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="loading-spinner" />
              </div>
            ) : santri.length === 0 ? (
              <div className="empty-state py-12">
                <div className="empty-icon">👨‍🎓</div>
                <p className="empty-text">Tidak ada santri di kelas ini</p>
              </div>
            ) : (
              <fetcher.Form method="post" className="space-y-3">
                <input type="hidden" name="intent" value="save" />
                <input type="hidden" name="jadwal_id" value={selectedJadwalId || ''} />
                <input type="hidden" name="tanggal" value={selectedTanggal} />
                <input
                  type="hidden"
                  name="santri_ids"
                  value={santri.map((s) => s.id).join(',')}
                />

                <div className="space-y-2">
                  {santri.map((s, i) => (
                    <div
                      key={s.id}
                      className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-[8px] hover:bg-[#E8F5EF] transition-colors"
                    >
                      <span className="text-xs text-[#6B7280] w-6">{i + 1}.</span>
                      <div className="w-8 h-8 rounded-full bg-[#0D6B3E] flex items-center justify-center text-white text-xs font-semibold">
                        {s.nama.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1A1D23]">{s.nama}</p>
                        <p className="text-xs text-[#6B7280]">{s.nis}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {(Object.entries(statusColors) as [StatusAbsensi, typeof statusColors[StatusAbsensi]][]).map(
                          ([key, val]) => (
                            <label
                              key={key}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-150 ${
                                statuses[s.id] === key
                                  ? 'ring-2 ring-offset-1'
                                  : 'opacity-60 hover:opacity-100'
                              }`}
                              style={{
                                backgroundColor: val.bg,
                                color: val.text,
                                ringColor: statuses[s.id] === key ? val.text : 'transparent',
                              }}
                            >
                              <input
                                type="radio"
                                name={`status_${s.id}`}
                                value={key}
                                checked={statuses[s.id] === key}
                                onChange={() =>
                                  setStatuses((prev) => ({ ...prev, [s.id]: key }))
                                }
                                className="sr-only"
                              />
                              {val.label}
                            </label>
                          ),
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
                  <p className="text-sm text-[#6B7280]">
                    {santri.length} santri
                  </p>
                  <button
                    type="submit"
                    className="btn-primary"
                    onClick={() => {
                      setMessage({ type: 'success', text: 'Absensi berhasil disimpan!' });
                    }}
                  >
                    💾 Simpan Absensi
                  </button>
                </div>
              </fetcher.Form>
            )}
          </div>
        )}

        {!selectedJadwal && (
          <div className="empty-state py-16">
            <div className="empty-icon">✅</div>
            <p className="empty-text">Pilih jadwal untuk memulai absensi</p>
            <p className="empty-subtext">Pilih jadwal dan tanggal di atas</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
