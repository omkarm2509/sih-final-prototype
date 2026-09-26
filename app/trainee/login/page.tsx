'use client';
import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { languages, Lang, t } from '../../../locales';
import { LANGUAGE_KEY, LOCATION_KEY, loginTraineeDemo, readAuth, roleHome } from '../../../lib/auth';
import { trainees } from '../../../data/trainees';

export default function TraineeLoginPage() {
  const [lang,setLang]=useState<Lang>('en');
  const [phone,setPhone]=useState('');
  const [traineeId,setTraineeId]=useState('TR-001');
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);
  const d=(t as any)[lang];
  const traineeText=d.trainee || (t.en as any).trainee;
  useEffect(()=>{
    const saved=localStorage.getItem(LANGUAGE_KEY) as Lang|null;
    if(saved&&languages[saved])setLang(saved);
    const auth=readAuth();
    if(auth.isAuthenticated)window.location.replace(roleHome(auth.role));
  },[]);
  function changeLang(v:Lang){setLang(v);localStorage.setItem(LANGUAGE_KEY,v)}
  function submit(e:FormEvent){
    e.preventDefault();setError('');
    const clean=phone.replace(/\D/g,'');
    if(clean && clean.length!==10)return setError(traineeText.invalidPhone);
    if(!traineeId.trim())return setError(traineeText.requiredId);
    const id=traineeId.trim().toUpperCase();
    const trainee=trainees.find(x=>x.traineeId===id)||trainees[0];
    setLoading(true);
    loginTraineeDemo(clean||'0000000000',trainee.traineeId,trainee.name,localStorage.getItem(LOCATION_KEY)||trainee.location);
    window.location.replace('/trainee');
  }
  return <main className="min-h-screen bg-slate-50">
    <header className="border-b bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4"><Link href="/" className="text-xl font-black text-[#16834b]">SahyogSetu</Link><div className="flex items-center gap-3"><select aria-label={d.footer.language} value={lang} onChange={e=>changeLang(e.target.value as Lang)} className="rounded-lg border px-2 py-2 text-sm">{Object.entries(languages).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select><Link href="/" className="text-sm font-semibold text-slate-600">{d.auth.backHome}</Link></div></div></header>
    <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-6xl items-center justify-center px-5 py-10"><div className="w-full max-w-md rounded-3xl border bg-white p-6 shadow-soft sm:p-8">
      <span className="inline-flex rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-[#16834b]">{traineeText.title}</span>
      <h1 className="mt-4 text-3xl font-black">{traineeText.loginTitle}</h1><p className="mt-2 text-sm leading-6 text-slate-500">{traineeText.subtitle}</p>
      <form onSubmit={submit} noValidate className="mt-7 space-y-5">
        <div><label htmlFor="traineeId" className="mb-2 block text-sm font-bold">{traineeText.id}</label><input id="traineeId" value={traineeId} onChange={e=>setTraineeId(e.target.value)} className="w-full rounded-xl border px-4 py-3 outline-none focus:border-[#16834b]" placeholder={traineeText.idPlaceholder}/><p className="mt-2 text-xs text-slate-400">Demo ID: TR-001</p></div>
        <div><label htmlFor="phone" className="mb-2 block text-sm font-bold">{traineeText.mobile}</label><div className="flex rounded-xl border focus-within:border-[#16834b]"><span className="flex items-center border-r px-3 text-sm font-semibold text-slate-500">+91</span><input id="phone" inputMode="numeric" value={phone} onChange={e=>setPhone(e.target.value)} className="min-w-0 flex-1 rounded-r-xl px-3 py-3 outline-none" placeholder={traineeText.mobilePlaceholder}/></div></div>
        {error&&<p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
        <button disabled={loading} className="w-full rounded-xl bg-[#16834b] px-5 py-3.5 font-bold text-white disabled:opacity-60">{loading?'…':traineeText.login}</button>
      </form>
      <p className="mt-5 text-xs leading-5 text-slate-400">{traineeText.demo}</p>
    </div></section>
  </main>;
}
