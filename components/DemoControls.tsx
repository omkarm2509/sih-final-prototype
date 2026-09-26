'use client';
import {useEffect,useState} from 'react';
import {usePathname,useRouter} from 'next/navigation';
import {DEMO_MODE_KEY,DEMO_STEPS,demoBooking,demoQuickAction,resetDemo,enterDemo,exitDemo} from '../lib/demo';
import {readAuth,DemoRole} from '../lib/auth';
const roles:DemoRole[]=['customer','worker','trainee','federation'];
const homes:Record<DemoRole,string>={customer:'/customer',worker:'/worker',trainee:'/trainee',federation:'/federation'};
export default function DemoControls(){
 const [on,setOn]=useState(false),[open,setOpen]=useState(false),[b,setB]=useState<any>(null),[auth,setAuth]=useState<any>(null);
 const router=useRouter(),path=usePathname();
 function refresh(){setOn(localStorage.getItem(DEMO_MODE_KEY)==='true');setB(demoBooking());setAuth(readAuth())}
 useEffect(()=>{refresh();const onChange=()=>refresh();window.addEventListener('storage',onChange);window.addEventListener('sahyogsetu-demo-change',onChange);return()=>{window.removeEventListener('storage',onChange);window.removeEventListener('sahyogsetu-demo-change',onChange)}},[]);
 if(!on||path==='/demo')return null;
 if(!open) return <button onClick={()=>setOpen(true)} aria-label="Open SIH demo controls" className="fixed bottom-3 right-3 z-[80] rounded-full border border-slate-200 bg-white px-4 py-3 text-xs font-black text-slate-800 shadow-xl cursor-pointer">SIH Demo</button>;
 const can=(expected:string)=>b?.status===expected;
 function act(a:string){const r=demoQuickAction(a);if(!r.ok)return;refresh()}
 function switchRole(role:DemoRole){enterDemo(role);router.push(homes[role])}
 return <aside aria-label="SIH demo controls" className="fixed bottom-3 right-3 z-[80] flex max-h-[calc(100vh-1.5rem)] w-[min(380px,calc(100vw-1rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur">
   <div className="min-w-0 overflow-y-auto p-3">
     <div className="flex items-start justify-between gap-2">
       <div className="min-w-0">
         <div className="flex items-center justify-between gap-2"><p className="text-xs font-black uppercase tracking-wide text-amber-700">SIH Demo Team Controls</p><button onClick={()=>setOpen(false)} className="rounded-lg border px-2 py-1 text-xs font-black cursor-pointer">Close</button></div>
         <p className="mt-1 truncate text-xs text-slate-500">{b?.id||'No demo booking'} · {b?.status||'—'}</p>
       </div>
       <button onClick={()=>{if(confirm('Reset the SIH demo environment?')){resetDemo();refresh()}}} className="shrink-0 rounded-lg border border-red-200 px-2.5 py-2 text-xs font-black text-red-700">Reset Demo</button>
     </div>
     <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
       {DEMO_STEPS.map(([a,label,status])=>{
         const enabled=!!b&&((a==='acceptEstimate'&&can('ESTIMATE'))||(a==='service'&&can('ESTIMATE'))||(a==='payment'&&can('COMPLETED'))||(a==='review'&&can('COMPLETED'))||can(status)) && !(a==='acceptEstimate'&&b?.estimateStatus!=='PENDING') && !(a==='service'&&b?.customerDecision!=='ACCEPTED') && !(a==='payment'&&b?.paymentId) && !(a==='review'&&b?.reviewSubmitted);
         return <button key={a} disabled={!enabled} onClick={()=>act(a)} className="min-h-10 min-w-0 rounded-lg border px-3 py-2 text-left text-xs font-bold leading-tight enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-35">{label}</button>
       })}
     </div>
     <div className="mt-3 border-t pt-3">
       <p className="text-[11px] font-black text-slate-500">SWITCH ROLE</p>
       <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
         {roles.map(r=><button key={r} onClick={()=>switchRole(r)} className={'min-h-10 min-w-0 rounded-lg border px-2 py-2 text-xs font-black leading-tight cursor-pointer '+(auth?.role===r?'border-[#16834b] bg-green-50 text-[#16834b]':'')}>{r==='federation'?'Federation':r[0].toUpperCase()+r.slice(1)}</button>)}
       </div>
     </div>
     <div className="mt-3 flex flex-col gap-2 sm:flex-row">
       <button onClick={()=>router.push('/demo')} className="min-h-10 flex-1 rounded-lg bg-slate-900 px-3 py-2 text-xs font-black text-white enabled:cursor-pointer">Demo Progress</button>
       <button onClick={()=>{exitDemo();router.push('/')}} className="min-h-10 rounded-lg border px-3 py-2 text-xs font-black enabled:cursor-pointer">Exit Demo</button>
     </div>
   </div>
 </aside>
}
