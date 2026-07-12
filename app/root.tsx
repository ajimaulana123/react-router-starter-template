import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0D6B3E" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "Halaman tidak ditemukan" : "Error";
    details =
      error.status === 404
        ? "Halaman yang Anda cari tidak tersedia."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-[#DC2626]/10 flex items-center justify-center text-3xl mx-auto mb-4">
          ⚠️
        </div>
        <h1 className="text-[28px] font-bold text-[#1A1D23] mb-2">{message}</h1>
        <p className="text-[#6B7280] mb-6">{details}</p>
        {stack && (
          <pre className="w-full p-4 overflow-x-auto bg-[#1A1D23] text-[#D1D5DB] rounded-[8px] text-xs text-left mb-6">
            <code>{stack}</code>
          </pre>
        )}
        <a href="/dashboard" className="btn-primary">
          Kembali ke Dashboard
        </a>
      </div>
    </main>
  );
}
