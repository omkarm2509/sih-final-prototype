'use client';
import { useEffect, useState } from 'react';
import { DemoRole, readAuth, roleLogin } from '../lib/auth';

export default function AuthGuard({ children, role = 'customer' }: { children: React.ReactNode; role?: DemoRole }) {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const auth = readAuth();
    if (auth.isAuthenticated && auth.role === role) setAllowed(true);
    else window.location.replace(auth.isAuthenticated ? roleLogin(auth.role || 'customer') : roleLogin(role));
  }, [role]);
  if (!allowed) return <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6"><div className="rounded-2xl bg-white p-6 text-center shadow-soft">Loading…</div></main>;
  return <>{children}</>;
}
