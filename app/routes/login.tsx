import { useState } from 'react';
import { useNavigate, useSearchParams, Form, useActionData, useNavigation, data } from 'react-router';
import type { Route } from './+types/login';
import { loginUser } from '~/lib/auth';
import { getDB } from '~/lib/db';
import { createTokenCookie } from '~/lib/auth';
import type { ApiResponse, LoginResponse } from '~/lib/types';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Masuk — Web Absensi Pesantren' },
    { name: 'description', content: 'Halaman masuk Web Absensi Pondok Pesantren' },
  ];
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const secret = context.cloudflare.env.JWT_SECRET || 'absensi-pesantren-secret-key-2026';

  if (!username || !password) {
    return { success: false, error: 'Username dan password harus diisi' } satisfies ApiResponse;
  }

  const db = getDB(context);
  const result = await loginUser(db, username, password, secret);

  if (!result) {
    return {
      success: false,
      error: 'Username atau password salah',
    } satisfies ApiResponse;
  }

  // Set token cookie and redirect
  const cookie = createTokenCookie(result.token);
  const redirectTo = formData.get('redirectTo') as string || '/dashboard';

  return data(
    { success: true, redirectTo } satisfies ApiResponse,
    {
      status: 302,
      headers: {
        'Set-Cookie': cookie,
        Location: redirectTo,
      },
    } as ResponseInit,
  );
}

export default function Login({ actionData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#0D6B3E] flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-[#0D6B3E]/20">
            🕌
          </div>
          <h1 className="text-[28px] font-bold text-[#1A1D23]">
            Web Absensi
          </h1>
          <p className="text-[#6B7280] mt-1">
            Pondok Pesantren — Digitalisasi Absensi
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-8">
          <h2 className="text-xl font-semibold text-[#1A1D23] mb-6">
            Masuk ke Akun
          </h2>

          {actionData && 'error' in actionData && actionData.error && (
            <div className="alert-error mb-4">{actionData.error}</div>
          )}

          <Form method="post" className="space-y-5">
            <div>
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-input"
                placeholder="Masukkan username"
                required
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="Masukkan password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses...
                </span>
              ) : (
                'Masuk'
              )}
            </button>
          </Form>

          <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
            <p className="text-xs text-[#9CA3AF] text-center">
              Demo: <span className="font-medium text-[#6B7280]">admin</span> / <span className="font-medium text-[#6B7280]">admin123</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#9CA3AF] mt-6">
          &copy; {new Date().getFullYear()} Web Absensi Pesantren
        </p>
      </div>
    </div>
  );
}
