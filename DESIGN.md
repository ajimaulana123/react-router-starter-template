# Design System — Web Absensi Pesantren

> Desain yang Islami, bersih, dan profesional — mencerminkan nilai-nilai pesantren dengan tampilan modern.

---

## 1. Visual Theme & Atmosphere

Desain menggabungkan estetika Islami tradisional dengan tampilan web modern. Warna hijau sebagai warna identitas Islam, dipadukan dengan emas/nusantara untuk aksen. Tipografi jelas dan hierarkis. Nuansa tenang, terpercaya, dan profesional.

**Key Characteristics:**
- 🟢 **Warna Islami** — Hijau sebagai warna utama (simbol Islam), kombinasi netral yang hangat
- ✨ **Bersih & Minimalis** — Fokus pada fungsi, tidak berlebihan
- 📱 **Mobile-First** — Ustadz sering absen dari HP
- 🔤 **Tipografi Jelas** — Ukuran baca yang nyaman
- 🕌 **Sentuhan Islami** — Ornamen halus, aksen geometris

---

## 2. Color Palette & Roles

### Background & Text
- **Background** (`#F8F9FA`): Background utama halaman — putih sedikit abu-abu agar tidak silau
- **Surface** (`#FFFFFF`): Kartu, container, form — putih bersih
- **Primary Text** (`#1A1D23`): Teks utama — hitam pekat hangat
- **Secondary Text** (`#6B7280`): Teks sekunder, deskripsi — abu-abu

### Brand Colors

**Hijau Islami (Primary)**
- **Hijau Tua** (`#0D6B3E`): Tombol primary, header aktif, link
- **Hijau Medium** (`#1B8A5A`): Hover state, badge aktif
- **Hijau Muda** (`#E8F5EF`): Background ringan, highlight, tabel baris genap

**Emas Nusantara (Accent)**
- **Emas** (`#C8963E`): Aksen dekoratif, badge premium
- **Emas Muda** (`#FDF5E6`): Background aksen ringan

### Surface & Border
- **Primary Border** (`#D1D5DB`): Border standar kartu/input
- **Secondary Border** (`#E5E7EB`): Pemisah halus, divider

### Semantic Colors
| Token | Color | Usage |
|-------|-------|-------|
| `--success` | `#059669` | Hadir, aktif, berhasil |
| `--warning` | `#D97706` | Izin, pending |
| `--error` | `#DC2626` | Alpa, error, gagal |
| `--info` | `#2563EB` | Informasi, sakit |

---

## 3. Typography Rules

### Font Families
- **Primary**: `Inter`, fallback: system-ui, sans-serif
- **Arabic/Islami**: `Amiri` atau `Noto Naskh Arabic` untuk teks Arab (jika perlu)
- **Monospace**: `JetBrains Mono`, fallback: `Fira Code`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Heading 1 | Inter | 28px / 1.75rem | 700 (Bold) | 1.3 | Judul halaman |
| Heading 2 | Inter | 22px / 1.375rem | 600 (Semibold) | 1.35 | Section title |
| Heading 3 | Inter | 18px / 1.125rem | 600 (Semibold) | 1.4 | Card title |
| Body | Inter | 15px / 0.9375rem | 400 (Regular) | 1.6 | Teks utama |
| Body Small | Inter | 13px / 0.8125rem | 400 | 1.5 | Teks bantuan |
| Caption | Inter | 12px / 0.75rem | 500 (Medium) | 1.4 | Label, timestamp |
| Button | Inter | 14px / 0.875rem | 600 (Semibold) | 1 | Tombol |

---

## 4. Component Stylings

### Buttons

**Primary Button** (Hijau)
- Background: `#0D6B3E`
- Text: `#FFFFFF`
- Padding: `10px 20px`
- Border: none
- Radius: `8px`
- Hover: `#0A5A33`
- Active: `#074A2A`
- Disabled: `#94BBA5`

**Secondary Button**
- Background: `transparent`
- Text: `#0D6B3E`
- Border: `2px solid #0D6B3E`
- Radius: `8px`
- Hover: `#E8F5EF`

**Ghost / Tertiary**
- Background: `transparent`
- Text: `#6B7280`
- Hover: `#F3F4F6`

### Cards & Containers
- Background: `#FFFFFF`
- Border: `1px solid #E5E7EB`
- Radius: `12px`
- Shadow: `0 1px 3px rgba(0, 0, 0, 0.06)`
- Padding: `20px`

### Inputs & Forms
- Background: `#FFFFFF`
- Text: `#1A1D23`
- Border: `1px solid #D1D5DB`
- Focus: `2px solid #0D6B3E` + ring shadow
- Radius: `8px`
- Padding: `10px 14px`
- Error: `1px solid #DC2626`
- Placeholder: `#9CA3AF`

### Navigation
- **Sidebar Navigation**: Background `#FFFFFF`, border-right `1px solid #E5E7EB`
- **Links**: `#0D6B3E` dengan weight 500
- **Active**: Background `#E8F5EF`, text `#0D6B3E`, border-left `3px solid #0D6B3E`
- **Mobile**: Bottom navigation bar atau hamburger menu

### Status Badges (Absensi)
| Status | Background | Text Color |
|--------|------------|------------|
| Hadir | `#D1FAE5` | `#065F46` |
| Sakit | `#DBEAFE` | `#1E40AF` |
| Izin | `#FEF3C7` | `#92400E` |
| Alpa | `#FEE2E2` | `#991B1B` |

---

## 5. Layout Principles

### Spacing System
- Base unit: `4px`
- Scale: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64`

### Grid & Container
- Max content width: `1200px`
- Sidebar width: `260px`
- Gutter: `24px`

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <640px | Single column, bottom nav, full-width cards |
| Tablet | 640-1024px | 2-column grids, sidebar collapsible |
| Desktop | >1024px | Full layout with sidebar |

### Border Radius Scale
- Sharp (`4px`): Inputs dalam tabel
- Standard (`8px`): Buttons, inputs, cards
- Large (`12px`): Modals, containers besar
- Pill (`9999px`): Badges, status tags

---

## 6. Depth & Elevation

| Level | Shadow | Use |
|-------|--------|-----|
| Level 0 | None | Page background, sidebar |
| Level 1 | `0 1px 3px rgba(0,0,0,0.06)` | Cards, stat boxes |
| Level 2 | `0 4px 12px rgba(0,0,0,0.08)` | Dropdowns, popovers |
| Level 3 | `0 8px 24px rgba(0,0,0,0.12)` | Modals |
| Level 4 | `0 16px 48px rgba(0,0,0,0.16)` | Toasts, notifications |

---

## 7. Do's and Don'ts

### Do
- ✅ Gunakan warna hijau sebagai identitas utama
- ✅ Tambahkan ikon untuk memperjelas aksi (centang untuk hadir, silang untuk alpa)
- ✅ Buat tabel yang rapi dengan zebra striping
- ✅ Mobile-first — ustadz absen dari HP
- ✅ Responsive — layar besar menampilkan lebih banyak data

### Don't
- ❌ Jangan gunakan warna terlalu mencolok — pesantren identik dengan kesederhanaan
- ❌ Jangan gunakan font dekoratif berlebihan
- ❌ Jangan buat flow absensi yang rumit — harus cepat
- ❌ Jangan sembunyikan status kehadiran di balik hover/tap

---

## 8. Responsive Behavior

### Touch Targets
- Minimum: `44px` untuk tombol dan interactive elements
- Status badges: `28px` minimum (tap-friendly)

### Collapsing Strategy
- Tabel data: jadi kartu di mobile (card view)
- Sidebar navigasi: jadi bottom nav atau hamburger di mobile
- Form absensi: daftar santri vertikal di mobile, tabel di desktop
- Dashboard: 1 kolom mobile, 2-4 kolom di desktop

---

## 9. Agent Prompt Guide

### Quick Color Reference
- Background: `#F8F9FA`
- Text: `#1A1D23`
- Primary: `#0D6B3E`
- Success (Hadir): `#059669`
- Warning (Izin): `#D97706`
- Error (Alpa): `#DC2626`
- Info (Sakit): `#2563EB`

### Example Component Prompts
```
Buat komponen Card AbsensiSantri yang menampilkan daftar santri dengan:
- Avatar/inisial lingkaran dengan warna random
- Nama santri dan NIS
- Status badge (Hadir/Sakit/Izin/Alpa) yang bisa diklik
- Animasi transisi saat status berubah
Gunakan warna hijau #0D6B3E sebagai primary.
Status badge: Hadir=#059669, Sakit=#2563EB, Izin=#D97706, Alpa=#DC2626
```

```
Buat tabel absensi kelas 3A dengan:
- Kolom: No, NIS, Nama, Hadir, Sakit, Izin, Alpa (sebagai kolom centang)
- Header tabel background hijau #0D6B3E text putih
- Zebra striping ringan #F8F9FA
- Responsive: jadi kartu di mobile
```

```

``` 

---

_Last updated: {{ CURRENT_DATE }}_
