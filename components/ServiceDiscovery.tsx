"use client";
import {useMemo,useState} from 'react';
import {useRouter} from 'next/navigation';
import {serviceIcons,serviceKeys,ServiceKey} from '../data/services';
import {serviceDetails,serviceLabel} from '../data/regional';
import {areaFor} from '../data/regional';
import {eligibleWorkers,workerAreas,searchServices} from '../lib/serviceDiscovery';
import WorkerTrustCard from './WorkerTrustCard';
import {languages,Lang,t} from '../locales';

export default function ServiceDiscovery({initialLocation='',lang='en',onLocation}:{initialLocation?:string;lang?:Lang;onLocation?:(v:string)=>void}){
 const router=useRouter(); const [q,setQ]=useState(''); const [selected,setSelected]=useState<ServiceKey|null>(null); const [area,setArea]=useState(initialLocation.split(',')[0]||''); const d=t[lang] as any;
 const results=useMemo(()=>searchServices(q),[q]);
 const areaData=areaFor(area);
 const workersFor=selected?eligibleWorkers(selected,area):[];
 const go=(s:ServiceKey)=>{localStorage.setItem('sahyogsetu_pending_intent',s);router.push(`/booking?service=${s}`)};
 const availability=(s:ServiceKey)=>areaData?.supported.includes(s)?'available':areaData?.limited.includes(s)?'limited':'unavailable';
 return <div className="space-y-10">
  <div className="rounded-3xl border bg-white p-5 shadow-soft sm:p-7">
   <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-black uppercase tracking-wide text-[#16834b]">{d.p14?.discover||'Regional Service Discovery'}</p><h2 className="mt-1 text-2xl font-black">{d.p14?.searchTitle||'What service do you need?'}</h2></div>
   <input aria-label={d.p14?.search||'Search services'} value={q} onChange={e=>setQ(e.target.value)} placeholder={d.p14?.searchPlaceholder||'Tap repair, fan installation, painter…'} className="w-full rounded-xl border px-4 py-3 outline-none focus:border-[#16834b] sm:max-w-md"/></div>
   <div className="mt-5 flex flex-wrap gap-2">{results.map(k=><button key={k} onClick={()=>setSelected(k)} className={`rounded-full border px-4 py-2 text-sm font-bold ${selected===k?'border-[#16834b] bg-green-50 text-[#16834b]':''}`}>{serviceIcons[k]} {d.services.items[k]}</button>)}</div>
   {!results.length&&<div className="mt-5 rounded-2xl bg-slate-50 p-5 text-sm font-semibold">{d.p14?.noMatch||'No matching service found.'} <button className="ml-2 font-black text-[#16834b]" onClick={()=>setQ('')}>{d.p14?.browse||'Browse All Services'}</button></div>}
  </div>
  <section><div className="flex items-end justify-between gap-3"><div><h2 className="text-2xl font-black">{d.p14?.popular||'Popular Services'}</h2><p className="mt-1 text-sm text-slate-500">{d.services.desc}</p></div></div>
   <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{serviceKeys.map(k=><button key={k} onClick={()=>setSelected(k)} className="rounded-2xl border bg-white p-5 text-left shadow-sm hover:-translate-y-1 hover:shadow-soft"><div className="text-3xl">{serviceIcons[k]}</div><p className="mt-3 font-extrabold">{d.services.items[k]}</p><p className="mt-1 text-xs text-slate-500">{areaData?(availability(k)==='available'?'✓ '+(d.p14?.available||'Available'):availability(k)==='limited'?'~ '+(d.p14?.limited||'Limited availability'):(d.p14?.notAvailable||'Not currently available')):(d.p14?.selectArea||'Select an area to check availability')}</p></button>)}</div>
  </section>
  {selected&&<section className="rounded-3xl border bg-white p-6 shadow-soft sm:p-8"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm font-bold text-[#16834b]">{serviceLabel(selected)}</p><h2 className="mt-1 text-3xl font-black">{serviceLabel(selected)}</h2><p className="mt-2 text-sm text-slate-600">{d.p14?.finalEstimate||'Final estimate after inspection.'}</p></div><button onClick={()=>setSelected(null)} className="rounded-xl border px-4 py-2 font-bold">×</button></div>
    <div className="mt-6 grid gap-4 md:grid-cols-3"><div className="rounded-2xl bg-slate-50 p-5"><p className="text-xs font-bold text-slate-500">{d.p14?.starting||'Starting from'}</p><p className="mt-2 text-xl font-black">{serviceDetails[selected].starting?`₹${serviceDetails[selected].starting}`:'Estimate after inspection'}</p></div><div className="rounded-2xl bg-slate-50 p-5"><p className="text-xs font-bold text-slate-500">{d.p14?.process||'Typical process'}</p><p className="mt-2 text-sm font-semibold">{serviceDetails[selected].process}</p></div><div className="rounded-2xl bg-slate-50 p-5"><p className="text-xs font-bold text-slate-500">{d.p14?.response||'Regional response'}</p><p className="mt-2 text-sm font-semibold">{serviceDetails[selected].response}</p></div></div>
    <div className="mt-6"><h3 className="font-black">{d.p14?.details||'Available services'}</h3><div className="mt-3 flex flex-wrap gap-2">{serviceDetails[selected].items.map(x=><span key={x} className="rounded-full border px-3 py-2 text-sm">{x}</span>)}</div></div>
    {areaData&&<div className="mt-6 rounded-2xl bg-green-50 p-5"><h3 className="font-black">{areaData.name}, {areaData.city}</h3><p className="mt-1 text-sm text-[#16834b]">{availability(selected)==='available'?'✓ '+(d.p14?.available||'Service available'):(d.p14?.limited||'Limited availability')}</p></div>}
    <div className="mt-6 flex flex-col gap-3 sm:flex-row"><button onClick={()=>go(selected)} className="rounded-xl bg-[#16834b] px-6 py-3 font-bold text-white">{d.p14?.bookService||'Book Service'}</button>{workersFor.length>0&&<button onClick={()=>document.getElementById('matching-preview')?.scrollIntoView({behavior:'smooth'})} className="rounded-xl border px-6 py-3 font-bold">{d.p14?.continueMatching||'Continue to Matching'}</button>}</div>
   </section>}
  {selected&&<section id="matching-preview" className="rounded-3xl border bg-white p-6 shadow-soft sm:p-8"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-bold text-[#16834b]">{d.p14?.matching||'Matching Service Providers'}</p><h2 className="text-2xl font-black">{workersFor.length} {d.p14?.workersAvailable||'cooperative workers available'}</h2></div><p className="text-xs text-slate-500">{d.p14?.neutral||'Matching considers skill, area, availability, workload, distance and verification.'}</p></div><div className="mt-5 space-y-3">{workersFor.slice(0,4).map(w=><WorkerTrustCard key={w.id} worker={w} selected={false} labels={{verified:d.booking.verified,reviews:d.booking.reviews,experience:d.booking.experience,away:d.booking.away,eta:d.booking.eta,select:d.booking.select,selected:d.booking.selected,completed:d.p14?.completed||'completed',cooperative:d.p14?.cooperative||'Cooperative',viewProfile:d.p14?.viewProfile||'View Profile',message:d.p14?.message||'Message',call:d.p14?.call||'Call',messageSimulation:d.p14?.messageSimulation||'Messaging simulation',callSimulation:d.p14?.callSimulation||'Calling simulation'}} onSelect={()=>go(selected!)}/>)}</div></section>}
 </div>
}
