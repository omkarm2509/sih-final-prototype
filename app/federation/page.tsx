'use client';
import {useMemo,useState} from 'react';
import Link from 'next/link';
import AuthGuard from '../../components/AuthGuard';
import FederationShell,{useFederationData,availability,workers} from '../../components/FederationShell';
import {phase13,Lang,t} from '../../locales';
import {trainees} from '../../data/trainees';

const active=['ASSIGNED','ACCEPTED','ON THE WAY','ARRIVED','INSPECTION','ESTIMATE','SERVICE'];
function getLang():Lang{if(typeof window==='undefined')return'en';return (localStorage.getItem('sahyogsetu-language')||'en') as Lang}
function countPending(bookings:any[]){return bookings.filter(b=>b.status==='ESTIMATE').length}
function countPayments(){try{const p=JSON.parse(localStorage.getItem('sahyogsetu_payments')||'[]');return p.filter((x:any)=>x.status==='PENDING').length}catch{return 0}}
function Content(){const {bookings}=useFederationData();const [lang]=useState(getLang);const d=phase13[lang]||phase13.en;
 const stats=[
  [d.activeRequests,bookings.filter(b=>active.includes(b.status)).length],
  [d.unassignedRequests,bookings.filter(b=>!b.workerId&&b.status!=='COMPLETED'&&b.status!=='CANCELLED').length],
  [d.activeWorkers,workers.filter(w=>availability(w.id,bookings)!=='OFFLINE').length],
  [d.availableWorkers,workers.filter(w=>availability(w.id,bookings)==='AVAILABLE').length],
  [d.completedServices,bookings.filter(b=>b.status==='COMPLETED').length],
  [d.pendingEstimates,countPending(bookings)],
  [d.pendingPayments,countPayments()]
 ];
 const demand=useMemo(()=>workers.map(w=>({service:w.service,count:bookings.filter(b=>b.service===w.service).length})).reduce((a,x)=>{a[x.service]=(a[x.service]||0)+x.count;return a as Record<string,number>},{} as Record<string,number>),[bookings]);
 return <section className="mx-auto max-w-7xl px-4 py-6 sm:px-5">
  <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold text-[#16834b]">SahyogSetu</p><h1 className="text-3xl font-black">{d.dashboard}</h1><p className="mt-1 text-sm text-slate-500">{d.regionalDemand}</p></div><div className="flex flex-wrap gap-2"><Link href="/federation/requests" className="rounded-xl bg-[#16834b] px-4 py-3 text-sm font-black text-white">{d.requests}</Link><Link href="/federation/assignment" className="rounded-xl border bg-white px-4 py-3 text-sm font-black">{d.assignment}</Link><Link href="/federation/map" className="rounded-xl border bg-white px-4 py-3 text-sm font-black">{d.map}</Link></div></div>
  <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{stats.map(([label,value])=><div key={String(label)} className="rounded-2xl border bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 text-3xl font-black">{value}</p></div>)}</div>
  <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]"><div className="rounded-2xl border bg-white p-5"><div className="flex items-center justify-between"><h2 className="text-xl font-black">{d.serviceCategories}</h2><Link href="/federation/analytics" className="text-sm font-bold text-[#16834b]">{d.analytics} →</Link></div><div className="mt-5 space-y-4">{Object.entries(demand).map(([key,val])=><div key={key}><div className="mb-1 flex justify-between text-sm"><span>{(t[lang]||t.en).services.items[key]||key}</span><b>{val}</b></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-[#16834b]" style={{width:`${Math.min(100,Math.max(8,(val as number)*10))}%`}}/></div></div>)}</div></div>
  <div className="rounded-2xl border bg-white p-5"><h2 className="text-xl font-black">{d.traineeSummary}</h2><div className="mt-5 grid grid-cols-3 gap-2 text-center"><div><p className="text-2xl font-black">{trainees.length}</p><p className="text-xs text-slate-500">{d.totalTrainees}</p></div><div><p className="text-2xl font-black">{new Set(trainees.map((x:any)=>x.trainingProgram)).size}</p><p className="text-xs text-slate-500">{d.trainingPrograms}</p></div><div><p className="text-2xl font-black">{Math.round(trainees.reduce((s:number,x:any)=>s+(x.progress||0),0)/(trainees.length||1))}%</p><p className="text-xs text-slate-500">{d.trainingProgress}</p></div></div><Link href="/federation/trainees" className="mt-5 inline-block font-bold text-[#16834b]">{d.viewRequest||d.workers} →</Link></div></div>
 </section>
}
export default function FederationPage(){return <AuthGuard role="federation"><FederationShell><Content/></FederationShell></AuthGuard>}
