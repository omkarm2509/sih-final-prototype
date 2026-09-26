'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import NotificationBell from '../../components/NotificationBell';
import AuthGuard from '../../components/AuthGuard';
import { languages, Lang, t } from '../../locales';
import { LANGUAGE_KEY, TRAINEE_KEY, logoutDemo, readAuth } from '../../lib/auth';
import { trainees } from '../../data/trainees';

function TraineeContent(){
  const [lang,setLang]=useState<Lang>('en');
  const [traineeId,setTraineeId]=useState('TR-001');
  const d=(t as any)[lang];
  const tr=d.trainee || (t.en as any).trainee;
  useEffect(()=>{
    const saved=localStorage.getItem(LANGUAGE_KEY) as Lang|null;
    if(saved&&languages[saved])setLang(saved);
    const auth=readAuth();
    if(auth.user?.traineeId){setTraineeId(auth.user.traineeId);}
  },[]);
  function changeLang(v:Lang){setLang(v);localStorage.setItem(LANGUAGE_KEY,v)}
  function logout(){logoutDemo();window.location.replace('/')}
  const profile=trainees.find(x=>x.traineeId===traineeId)||trainees[0];
  const completed=profile.certifications.filter(x=>x.completed).length;
  return <main className="min-h-screen bg-slate-50">
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-5 lg:px-8"><Link href="/" className="text-lg font-black text-[#16834b] sm:text-xl">SahyogSetu</Link><div className="flex items-center gap-2"><span className="hidden rounded-full bg-green-50 px-3 py-2 text-xs font-bold text-[#16834b] sm:inline">{profile.name}</span><NotificationBell/><Link href="/trainee/profile" className="rounded-xl border px-3 py-2 text-xs font-bold">{tr.profile}</Link><select aria-label={d.footer.language} value={lang} onChange={e=>changeLang(e.target.value as Lang)} className="max-w-24 rounded-lg border px-1 py-2 text-xs">{Object.entries(languages).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select><button onClick={logout} className="rounded-xl border px-3 py-2 text-xs font-bold sm:text-sm">{tr.logout}</button></div></div></header>
    <section className="mx-auto max-w-7xl px-4 py-5 sm:px-5 lg:px-8">
      <div className="rounded-3xl bg-[#12251f] p-5 text-white shadow-soft sm:p-7"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-wide text-green-300">{tr.dashboard}</p><h1 className="mt-1 text-2xl font-black sm:text-3xl">{tr.welcome}, {profile.name}</h1><p className="mt-1 text-sm text-white/70">{tr.id}: {profile.traineeId}</p></div><div className="rounded-2xl bg-white/10 px-4 py-3"><p className="text-xs text-white/60">{tr.trainingStatus}</p><p className="mt-1 font-black text-green-200">{tr.inTraining}</p></div></div></div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
        <div className="space-y-5">
          <section className="grid gap-4 sm:grid-cols-2"><article className="rounded-2xl border bg-white p-5 shadow-sm"><p className="text-sm font-semibold text-slate-500">{tr.trainingProgram}</p><h2 className="mt-2 text-xl font-black">{profile.trainingProgram}</h2><p className="mt-1 text-sm text-slate-500">{profile.skillCategory} · {profile.trainingLevel}</p></article><article className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-500">{tr.progress}</p><strong className="text-xl font-black text-[#16834b]">{profile.progress}%</strong></div><div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#16834b]" style={{width:`${profile.progress}%`}}/></div><p className="mt-2 text-xs text-slate-500">{tr.overallProgress}</p></article></section>
          <section className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-xl font-black">{tr.myProgress}</h2><span className="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-[#16834b]">{profile.progress}%</span></div><div className="mt-5 space-y-4">{profile.skillProgress.map(item=><div key={item.name}><div className="flex justify-between gap-3 text-sm font-bold"><span>{item.name}</span><span>{item.progress}%</span></div><div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#16834b]" style={{width:`${item.progress}%`}}/></div></div>)}</div></section>
          <section className="rounded-2xl border bg-white p-5 shadow-sm"><h2 className="text-xl font-black">{tr.upcomingTraining}</h2><div className="mt-4 rounded-2xl bg-slate-50 p-4"><p className="font-black">{tr.upcomingTitle}</p><p className="mt-1 text-sm text-slate-600">{profile.trainingProgram} · {profile.assignedTrainer}</p></div></section>
        </div>
        <aside className="space-y-5">
          <section className="rounded-2xl border bg-white p-5 shadow-sm"><h2 className="text-xl font-black">{tr.certifications}</h2><p className="mt-1 text-sm text-slate-500">{completed} / {profile.certifications.length} {tr.completed}</p><div className="mt-4 space-y-3">{profile.certifications.map(c=><div key={c.name} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm font-semibold"><span className={`flex h-7 w-7 items-center justify-center rounded-full ${c.completed?'bg-green-100 text-[#16834b]':'bg-slate-200 text-slate-500'}`}>{c.completed?'✓':'○'}</span><span>{c.name}</span></div>)}</div><p className="mt-4 text-xs leading-5 text-slate-400">{tr.demoCertification}</p></section>
          <section className="rounded-2xl border bg-white p-5 shadow-sm"><h2 className="text-xl font-black">{tr.trainer}</h2><p className="mt-3 text-lg font-black">{profile.assignedTrainer}</p><p className="mt-1 text-sm text-slate-500">{tr.coordinator}: {profile.cooperative}</p></section>
          <section className="rounded-2xl border bg-white p-5 shadow-sm"><h2 className="text-xl font-black">{tr.profile}</h2><dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between gap-3"><dt className="text-slate-500">{tr.location}</dt><dd className="font-bold text-right">{profile.location}</dd></div><div className="flex justify-between gap-3"><dt className="text-slate-500">{tr.skill}</dt><dd className="font-bold text-right">{profile.skillCategory}</dd></div><div className="flex justify-between gap-3"><dt className="text-slate-500">{tr.level}</dt><dd className="font-bold text-right">{profile.trainingLevel}</dd></div></dl></section>
        </aside>
      </div>
      <nav className="fixed bottom-3 left-3 right-3 z-30 grid grid-cols-5 gap-1 rounded-2xl border bg-white p-2 shadow-lg md:hidden">{[tr.home,tr.training,tr.progress,tr.certificates,tr.profile].map((x:string,i:number)=><span key={i} className={`rounded-xl px-1 py-2 text-center text-[11px] font-bold ${i===0?'bg-green-50 text-[#16834b]':'text-slate-600'}`}>{x}</span>)}</nav>
    </section>
  </main>;
}

export default function TraineePage(){return <AuthGuard role="trainee"><TraineeContent/></AuthGuard>}
