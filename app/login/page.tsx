'use client';
import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { languages, Lang, t, phase7 } from '../../locales';
import { INTENT_KEY, LANGUAGE_KEY, LOCATION_KEY, loginDemo, readAuth, roleHome } from '../../lib/auth';

type LoginRole = 'customer' | 'worker' | 'trainee' | 'federation';

export default function LoginPage() {
  const [lang, setLang] = useState<Lang>('en');
  const [role, setRole] = useState<LoginRole>('customer');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const d = t[lang];

  useEffect(() => {
    const saved = localStorage.getItem(LANGUAGE_KEY) as Lang | null;
    if (saved && languages[saved]) setLang(saved);
    const existing = readAuth();
    if (existing.isAuthenticated) window.location.replace(roleHome(existing.role));
  }, []);

  function changeLang(value: Lang) {
    setLang(value);
    localStorage.setItem(LANGUAGE_KEY, value);
  }

  function chooseRole(next: LoginRole) {
    setRole(next);
    setError('');
    if (next === 'worker') window.location.replace('/worker/login');
    if (next === 'trainee') window.location.replace('/trainee/login');
    if (next === 'federation') window.location.replace('/federation/login');
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) return setError(d.auth.invalidPhone);
    if (!otp.trim()) return setError(d.auth.requiredOtp);
    setLoading(true);
    const location = localStorage.getItem(LOCATION_KEY) || '';
    loginDemo(cleanPhone, location);
    const intent = localStorage.getItem(INTENT_KEY);
    localStorage.removeItem(INTENT_KEY);
    window.location.replace(intent ? `/booking?service=${encodeURIComponent(intent)}` : '/customer');
  }

  return <main className="min-h-screen bg-slate-50">
    <header className="border-b border-slate-100 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
      <Link href="/" className="text-xl font-black tracking-tight text-[#16834b]">SahyogSetu</Link>
      <div className="flex items-center gap-3"><select aria-label={d.footer.language} value={lang} onChange={e => changeLang(e.target.value as Lang)} className="rounded-lg border px-2 py-2 text-sm">{Object.entries(languages).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select><Link href="/" className="text-sm font-semibold text-slate-600 hover:text-[#16834b]">{d.auth.backHome}</Link></div>
    </div></header>
    <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-6xl items-center justify-center px-5 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-8">
        <div className="mb-7"><span className="inline-flex rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-[#16834b]">SahyogSetu</span><h1 className="mt-4 text-3xl font-black">{d.auth.welcome}</h1><p className="mt-2 text-sm leading-6 text-slate-500">{d.auth.subtitle}</p></div>
        <div className="mb-7 grid grid-cols-2 gap-2 sm:grid-cols-4" role="tablist" aria-label="Login role">
          {(['customer','worker','trainee','federation'] as LoginRole[]).map(item => <button key={item} type="button" onClick={()=>chooseRole(item)} className={`rounded-xl border px-2 py-3 text-xs font-black sm:text-sm ${role===item?'border-[#16834b] bg-green-50 text-[#16834b]':'border-slate-200 text-slate-600'}`}>{item==='customer'?d.auth.customer:item==='worker'?d.worker.title:item==='trainee'?((d as any).trainee?.title||'Trainee'):phase7[lang].role}</button>)}
        </div>
        <form onSubmit={submit} noValidate className="space-y-5">
          <div><label htmlFor="phone" className="mb-2 block text-sm font-bold">{d.auth.mobile}</label><div className="flex rounded-xl border border-slate-200 focus-within:border-[#16834b]"><span className="flex items-center border-r px-3 text-sm font-semibold text-slate-500">+91</span><input id="phone" inputMode="numeric" autoComplete="tel" value={phone} onChange={e=>setPhone(e.target.value)} className="min-w-0 flex-1 rounded-r-xl px-3 py-3 outline-none" placeholder={d.auth.mobilePlaceholder}/></div></div>
          <div><label htmlFor="otp" className="mb-2 block text-sm font-bold">{d.auth.otp}</label><input id="otp" value={otp} onChange={e=>setOtp(e.target.value)} className="field" placeholder={d.auth.otpPlaceholder}/></div>
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
          <button disabled={loading} className="btn btn-primary w-full disabled:opacity-60">{loading ? d.auth.loggingIn : d.auth.login}</button>
        </form>
      </div>
    </section>
  </main>;
}
