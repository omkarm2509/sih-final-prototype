'use client';
import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { languages, Lang, t } from '../../../locales';
import { LOCATION_KEY, loginWorkerDemo, readAuth, roleHome } from '../../../lib/auth';
import { workers } from '../../../data/workers';

export default function WorkerLoginPage() {
  const [lang,setLang]=useState<Lang>('en');
  const [phone,setPhone]=useState('');
  const [workerId,setWorkerId]=useState('');
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);
  const d=t[lang];
  useEffect(()=>{
    const saved=localStorage.getItem('sahyogsetu-language') as Lang|null;
    if(saved&&languages[saved])setLang(saved);
    const auth=readAuth();
    if(auth.isAuthenticated) window.location.replace(roleHome(auth.role));
  },[]);
  function changeLang(v:Lang){setLang(v);localStorage.setItem('sahyogsetu-language',v)}
  function submit(e:FormEvent){
    e.preventDefault(); setError('');
    const clean=phone.replace(/\D/g,'');
    if(clean.length!==10)return setError(d.worker.invalidPhone);
    if(!workerId.trim())return setError(d.worker.requiredId);
    const id=workerId.trim().toLowerCase();
    const worker=workers.find(w=>w.id===id)||workers[0];
    setLoading(true);
    loginWorkerDemo(clean,worker.id,worker.name,localStorage.getItem(LOCATION_KEY)||'Pune');
    window.location.replace('/worker');
  }
  return <main className="min-h-screen bg-slate-50">
    <header className="border-b bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
      <Link href="/" className="text-xl font-black text-[#16834b]">SahyogSetu</Link>
      <div className="flex items-center gap-3"><select aria-label={d.footer.language} value={lang} onChange={e=>changeLang(e.target.value as Lang)} className="rounded-lg border px-2 py-2 text-sm">{Object.entries(languages).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select><Link href="/" className="text-sm font-semibold text-slate-600">{d.auth.backHome}</Link></div>
    </div></header>
    <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-6xl items-center justify-center px-5 py-10">
      <div className="w-full max-w-md rounded-3xl border bg-white p-6 shadow-soft sm:p-8">
        <span className="inline-flex rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-[#16834b]">{d.worker.title}</span>
        <h1 className="mt-4 text-3xl font-black">{d.worker.loginTitle}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">{d.worker.subtitle}</p>
        <form onSubmit={submit} noValidate className="mt-7 space-y-5">
          <div><label htmlFor="phone" className="mb-2 block text-sm font-bold">{d.worker.mobile}</label><div className="flex rounded-xl border focus-within:border-[#16834b]"><span className="flex items-center border-r px-3 text-sm font-semibold text-slate-500">+91</span><input id="phone" inputMode="numeric" autoComplete="tel" value={phone} onChange={e=>setPhone(e.target.value)} className="min-w-0 flex-1 rounded-r-xl px-3 py-3 outline-none" placeholder={d.worker.mobilePlaceholder}/></div></div>
          <div><label htmlFor="workerId" className="mb-2 block text-sm font-bold">{d.worker.id}</label><input id="workerId" value={workerId} onChange={e=>setWorkerId(e.target.value)} className="w-full rounded-xl border px-4 py-3 outline-none focus:border-[#16834b]" placeholder={d.worker.idPlaceholder}/><p className="mt-2 text-xs text-slate-400">Demo IDs: W1–W9</p></div>
          {error&&<p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
          <button disabled={loading} className="w-full rounded-xl bg-[#16834b] px-5 py-3.5 font-bold text-white disabled:opacity-60">{loading?'…':d.worker.login}</button>
        </form>
        <p className="mt-5 text-xs leading-5 text-slate-400">{d.worker.demo}</p>
      </div>
    </section>
  </main>;
}
