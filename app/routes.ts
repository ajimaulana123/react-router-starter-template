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

  // Main app routes (no layout wrapper - each page handles its own layout)
  route("dashboard", "routes/dashboard.tsx"),

  // CRUD Master Data
  route("santri", "routes/santri.tsx"),
  route("ustadz", "routes/ustadz.tsx"),
  route("kelas", "routes/kelas.tsx"),
  route("mapel", "routes/mapel.tsx"),

  // Jadwal & Absensi
  route("jadwal", "routes/jadwal.tsx"),
  route("absensi", "routes/absensi.tsx"),
  route("laporan", "routes/laporan.tsx"),

  // API / Data routes
  route("absensi/data", "routes/absensi.data.ts"),
  route("api/laporan/harian", "routes/api.laporan.harian.ts"),
  route("api/laporan/bulanan", "routes/api.laporan.bulanan.ts"),
] satisfies RouteConfig;
