'use client';
import {useEffect,useMemo,useState} from 'react';
import {useRouter} from 'next/navigation';
import AuthGuard from '../../components/AuthGuard';
import BookingMap from '../../components/booking/BookingMap';
import WorkerCard from '../../components/booking/WorkerCard';
import {languages,Lang,t} from '../../locales';
import {LOCATION_KEY,readAuth} from '../../lib/auth';
import {readCustomerLocation,saveCustomerLocation} from '../../lib/customerLocation';
import {eligibleWorkers} from '../../lib/serviceDiscovery';
import {notifyBooking} from '../../lib/notifications';
import {readBookings,saveBookings} from '../../lib/store';
import {serviceIcons,serviceKeys,requirements,ServiceKey} from '../../data/services';
import {workers} from '../../data/workers';

type Booking={id:string;customer:string;customerId?:string;service:ServiceKey;serviceId:string;serviceName:string;requirement:string;location:string;date:string;time:string;scheduledDate:string;scheduledTime:string;worker:string;workerId:string;workerRating:number;workerExperience:number;status:'ASSIGNED';inspectionCharge:number;initialCharge:number;estimateId:null;paymentId:null;invoiceId:null;createdAt:string;updatedAt:string};
const slots=['morning','lateMorning','afternoon','evening'] as const;
const slotLabels={morning:['morning','morningTime'],lateMorning:['lateMorning','lateMorningTime'],afternoon:['afternoon','afternoonTime'],evening:['evening','eveningTime']} as const;
function slotText(d:any,slot:string){const pair=(slotLabels as Record<string,readonly [string,string]>)[slot];return pair?`${d.booking[pair[0]]} · ${d.booking[pair[1]]}`:slot;}

function BookingContent(){
 const router=useRouter();
 const [lang,setLang]=useState<Lang>('en');
 const [step,setStep]=useState(0);
 const [service,setService]=useState<ServiceKey|''>('');
 const [requirement,setRequirement]=useState('');
 const [location,setLocation]=useState('');
 const [date,setDate]=useState('');
 const [time,setTime]=useState('');
 const [workerId,setWorkerId]=useState('');
 const [filter,setFilter]=useState('all');
 const [coords,setCoords]=useState<{lat:number;lng:number}|undefined>();
 const [error,setError]=useState('');
 const [creating,setCreating]=useState(false);
 const d=t[lang] as any;

 useEffect(()=>{
   const l=localStorage.getItem('sahyogsetu-language') as Lang|null;
   if(l&&languages[l])setLang(l);
   const saved=readCustomerLocation();
   if(saved)setLocation(`${saved.area}, ${saved.city}`);
 },[]);
 function changeLang(v:Lang){setLang(v);localStorage.setItem('sahyogsetu-language',v)}
 const candidates=useMemo(()=>{
   let list=service&&location?eligibleWorkers(service,location.split(',')[0].trim()):workers.filter(w=>!service||w.service===service);
   if(!list.length)list=workers.filter(w=>!service||w.service===service);
   if(filter==='rating')list.sort((a,b)=>b.rating-a.rating);
   if(filter==='experience')list.sort((a,b)=>b.experience-a.experience);
   if(filter==='distance')list.sort((a,b)=>a.distance-b.distance);
   return list;
 },[service,filter,location]);
 function next(){
   setError('');
   if(step===0&&!location.trim())return setError(d.booking.validationLocation);
   if(step===1&&!service)return setError(d.booking.validationService);
   if(step===1&&!requirement.trim())return setError(d.booking.validationRequirement);
   if(step===2&&(!date||!time))return setError(!date?d.booking.validationDate:d.booking.validationTime);
   if(step===3&&!workerId)return setError(d.booking.validationWorker);
   if(step===3)return createBookingAndContinueToPayment();
   setStep(s=>Math.min(3,s+1));
 }
 function back(){setError('');setStep(s=>Math.max(0,s-1))}
 function cancel(){if(confirm(d.booking.cancelQuestion))router.push('/customer')}
 function saveLocation(v:string){
   setLocation(v);localStorage.setItem(LOCATION_KEY,v);
   const parts=v.split(',').map(x=>x.trim());
   saveCustomerLocation({area:parts[0]||v,city:parts[1]||'Pune',source:'manual'});
 }
 function useCurrent(){
   if(!navigator.geolocation){setError(d.location.unsupported);return}
   navigator.geolocation.getCurrentPosition(p=>{
     setCoords({lat:p.coords.latitude,lng:p.coords.longitude});
     const inPune=p.coords.latitude>18.35&&p.coords.latitude<18.65&&p.coords.longitude>73.65&&p.coords.longitude<74.0;
     if(inPune)saveLocation('Pune region, Pune');else setError(d.location.denied);
   },()=>setError(d.location.denied),{enableHighAccuracy:false,timeout:8000});
 }
 function createBookingAndContinueToPayment(){
   if(!service||!workerId||!location||!date||!time||creating)return;
   setCreating(true);
   const w=workers.find(x=>x.id===workerId); if(!w){setCreating(false);return}
   const auth=readAuth();
   const existing=readBookings();
   const id=`SGS-2026-${String(existing.length+1).padStart(4,'0')}`;
   const initialCharge=100;
   const b:Booking={
     id,customer:auth.user?.name||'Demo Customer',customerId:auth.user?.userId||'CU-001',service,serviceId:service,serviceName:d.services.items[service],requirement:requirement.trim(),location,date,time,scheduledDate:date,scheduledTime:time,
     worker:w.name,workerId:w.id,workerRating:w.rating,workerExperience:w.experience,status:'ASSIGNED',inspectionCharge:initialCharge,initialCharge,estimateId:null,paymentId:null,invoiceId:null,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()
   };
   saveBookings([b,...existing]);
   notifyBooking('BOOKING_CREATED',b,{customer:true,federation:true});
   notifyBooking('WORKER_ASSIGNED',b,{customer:true,worker:true,federation:true});
   router.push(`/customer/payment/${id}`);
 }
 return <main className="min-h-screen bg-slate-50">
   <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8"><button onClick={()=>router.push('/customer')} className="text-xl font-black text-[#16834b]">SahyogSetu</button><select aria-label={d.footer.language} value={lang} onChange={e=>changeLang(e.target.value as Lang)} className="rounded-lg border px-2 py-2 text-sm">{Object.entries(languages).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></div></header>
   <section className="mx-auto max-w-5xl px-5 py-8 lg:px-8">
    <div className="mb-7"><p className="text-sm font-bold text-[#16834b]">{d.booking.title}</p><div className="mt-4 grid grid-cols-4 gap-1 sm:gap-2">{d.booking.flowSteps.slice(0,4).map((x:string,i:number)=><div key={x} className="min-w-0 text-center"><div className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${i<=step?'bg-[#16834b] text-white':'bg-slate-200 text-slate-500'}`}>{i+1}</div><p className={`mt-2 truncate text-xs font-bold ${i===step?'text-[#16834b]':'text-slate-500'}`}>{x}</p></div>)}</div></div>
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft sm:p-8">
      {step===0&&<section><h1 className="text-2xl font-black">{d.booking.locationFirstTitle}</h1><p className="mt-2 text-slate-500">{d.location.title}</p><div className="mt-5 flex flex-col gap-3 sm:flex-row"><input value={location} onChange={e=>saveLocation(e.target.value)} className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3" placeholder={d.location.placeholder}/><button onClick={useCurrent} className="rounded-xl border px-5 py-3 font-bold">{d.location.current}</button></div><div className="mt-5"><BookingMap coords={coords}/></div></section>}
      {step===1&&<section><h1 className="text-2xl font-black">{d.booking.serviceTypeTitle}</h1><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{serviceKeys.map(k=><button key={k} onClick={()=>{setService(k);setWorkerId('');setError('')}} className={`rounded-2xl border p-4 text-left transition ${service===k?'border-[#16834b] bg-green-50 ring-2 ring-green-100':'border-slate-200 hover:shadow-sm'}`}><div className="text-3xl">{serviceIcons[k]}</div><p className="mt-3 font-extrabold">{d.services.items[k]}</p>{service===k&&<p className="mt-1 text-xs font-bold text-[#16834b]">✓</p>}</button>)}</div>{service&&<div className="mt-6"><p className="text-sm font-bold text-slate-700">{d.booking.requirementQuestion}</p><div className="mt-3 flex flex-wrap gap-2">{requirements[service].map(x=><button key={x} onClick={()=>setRequirement(x)} className={`rounded-full border px-4 py-2 text-sm font-semibold ${requirement===x?'border-[#16834b] bg-green-50 text-[#16834b]':'bg-white'}`}>{x}</button>)}</div><textarea value={requirement} onChange={e=>setRequirement(e.target.value)} rows={4} className="mt-4 w-full rounded-2xl border border-slate-200 p-4 outline-none focus:border-[#16834b]" placeholder={d.booking.customPlaceholder}/></div>}</section>}
      {step===2&&<section><h1 className="text-2xl font-black">{d.booking.timeSlotTitle}</h1><label className="mt-6 block text-sm font-bold">{d.booking.date}</label><input type="date" min={new Date().toISOString().split('T')[0]} value={date} onChange={e=>setDate(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 sm:max-w-xs"/><p className="mt-6 text-sm font-semibold text-slate-600">{d.booking.approximate}</p><div className="mt-3 grid gap-3 sm:grid-cols-2">{slots.map(s=>{const [a,b]=slotLabels[s];return <button key={s} onClick={()=>setTime(s)} className={`rounded-2xl border p-4 text-left ${time===s?'border-[#16834b] bg-green-50 ring-2 ring-green-100':'border-slate-200'}`}><p className="font-extrabold">{d.booking[a as keyof typeof d.booking]}</p><p className="mt-1 text-sm text-slate-500">{d.booking[b]}</p></button>})}</div></section>}
      {step===3&&<section><h1 className="text-2xl font-black">{d.booking.workerTitle}</h1><p className="mt-2 text-sm text-slate-500">{d.booking.matchingNote}</p><div className="mt-5 flex flex-wrap gap-2">{[['all',d.booking.all],['rating',d.booking.filterRating],['experience',d.booking.filterExperience],['distance',d.booking.filterDistance]].map(([k,v])=><button key={k} onClick={()=>setFilter(k)} className={`rounded-full border px-4 py-2 text-sm font-bold ${filter===k?'border-[#16834b] bg-green-50 text-[#16834b]':''}`}>{v}</button>)}</div><div className="mt-5 space-y-3">{candidates.map(w=><WorkerCard key={w.id} worker={w} selected={workerId===w.id} onSelect={()=>setWorkerId(w.id)} labels={{verified:d.booking.verified,reviews:d.booking.reviews,experience:d.booking.experience,away:d.booking.away,eta:d.booking.eta,select:d.booking.select,selected:d.booking.selected}}/>)}{!candidates.length&&<p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">{d.booking.notFound}</p>}</div></section>}
      {error&&<p role="alert" className="mt-6 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
      <div className="mt-8 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-between"><button onClick={cancel} className="rounded-xl border px-5 py-3 font-bold text-slate-600">{d.booking.cancel}</button><div className="flex gap-3">{step>0&&<button onClick={back} className="rounded-xl border px-5 py-3 font-bold">{d.booking.back}</button>}<button disabled={creating} onClick={next} className="rounded-xl bg-[#16834b] px-6 py-3 font-bold text-white">{step===3?d.booking.payNow:d.booking.continue}</button></div></div>
    </div>
   </section>
 </main>
}
export default function BookingPage(){return <AuthGuard role="customer"><BookingContent/></AuthGuard>}
