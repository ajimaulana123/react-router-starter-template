import { redirect, data } from "react-router";
import type { Route } from "./+types/home";
import { getAuthUser } from "~/lib/auth";
import { getDB } from "~/lib/db";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Web Absensi Pesantren" },
    { name: "description", content: "Sistem Absensi Digital Pondok Pesantren" },
  ];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const secret = context.cloudflare.env.JWT_SECRET || "absensi-pesantren-secret-key-2026";
  const db = getDB(context);
  const { user } = await getAuthUser(request, db, secret);

  if (user) {
    // Role-aware redirect
    if (user.role === 'admin') return redirect('/dashboard');
    if (user.role === 'ustadz') return redirect('/dashboard/ustadz');
    if (user.role === 'wali') return redirect('/portal-wali');
    if (user.role === 'santri') return redirect('/portal-wali');
    return redirect('/dashboard');
  }

  return redirect("/login");
}

export default function Home() {
  return null;
}
