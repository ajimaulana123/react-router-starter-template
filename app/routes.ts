import {
  type RouteConfig,
  index,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  // Auth
  route("login", "routes/login.tsx"),
  route("logout", "routes/logout.ts"),

  // Dashboards
  route("dashboard", "routes/dashboard.tsx"),
  route("dashboard/ustadz", "routes/dashboard.ustadz.tsx"),

  // CRUD Master Data
  route("santri", "routes/santri.tsx"),
  route("ustadz", "routes/ustadz.tsx"),
  route("kelas", "routes/kelas.tsx"),
  route("mapel", "routes/mapel.tsx"),
  route("wali", "routes/wali.tsx"),

  // Jadwal & Absensi
  route("jadwal", "routes/jadwal.tsx"),
  route("absensi", "routes/absensi.tsx"),
  route("laporan", "routes/laporan.tsx"),

  // Portal Wali
  route("portal-wali", "routes/portal-wali.tsx"),

  // API / Data routes
  route("absensi/data", "routes/absensi.data.ts"),
  route("api/laporan/harian", "routes/api.laporan.harian.ts"),
  route("api/laporan/bulanan", "routes/api.laporan.bulanan.ts"),
] satisfies RouteConfig;
