'use client';
import Link from 'next/link';
import type { Worker } from '../data/workers';
import { readWorkerProfile, workerStats } from '../lib/profiles';
export default function WorkerTrustCard({worker,selected,onSelect,labels}:{worker:Worker;selected:boolean;onSelect:()=>void;labels:any}){
 const p=readWorkerProfile(worker.id),s=workerStats(worker.id);
 return <article className={`card card-hover p-4 ${selected?'border-[#16834b] bg-green-50 ring-2 ring-green-100':''}`}>
  <div className="flex gap-4"><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-3xl" aria-hidden="true">{p.avatar}</div><div className="min-w-0 flex-1">
   <div className="flex flex-wrap items-center gap-2"><h3 className="font-extrabold">{p.name}</h3>{p.verificationStatus==='VERIFIED'&&<span className="status-badge status-completed">{labels.verified}</span>}</div>
   <p className="mt-1 text-sm text-slate-500">{p.primarySkill} · {p.experience} {labels.experience}</p>
   <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4"><span>★ {s.rating} · {s.reviewCount} {labels.reviews}</span><span>{s.completed} {labels.completed}</span><span>{p.serviceAreas[0]||worker.distance+' km'}</span><span>{labels.eta}: {worker.eta}</span></div>
   <p className="mt-2 text-xs font-semibold text-slate-500">{labels.cooperative}: {p.cooperative}</p>
  </div></div>
  <div className="mt-4 flex flex-wrap gap-2"><Link href={`/workers/${worker.id}`} className="btn btn-secondary text-xs">{labels.viewProfile}</Link><button type="button" onClick={onSelect} className={selected?'btn btn-primary text-xs':'btn btn-secondary text-xs'}>{selected?labels.selected:labels.select}</button><button type="button" onClick={()=>window.alert(labels.messageSimulation)} className="btn btn-secondary text-xs">{labels.message}</button><button type="button" onClick={()=>window.alert(labels.callSimulation)} className="btn btn-secondary text-xs">{labels.call}</button></div>
 </article>
}
