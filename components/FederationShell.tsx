'use client';
import {ReactNode,useEffect,useState} from 'react';
import Link from 'next/link';
import {languages,Lang,phase7,phase13,t} from '../locales';
import {LANGUAGE_KEY,logoutDemo,readAuth} from '../lib/auth';
import {federation} from '../data/federation';
import {workers} from '../data/workers';
import {trainees} from '../data/trainees';
import FederationMap from './FederationMap';
import NotificationBell from './NotificationBell';

export type Booking=Record<string,any>&{id:string;status:string;service:string;workerId?:string};
const KEY='sahyogsetu_bookings';
const statuses=['ASSIGNED','ACCEPTED','ON THE WAY','ARRIVED','INSPECTION','ESTIMATE','SERVICE'];
const serviceAreas=['Kothrud','Shivajinagar','Baner','Hadapsar'];
export function readBookings():Booking[]{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}}
export function saveBookings(v:Booking[]){localStorage.setItem(KEY,JSON.stringify(v))}
export function eligibleWorkers(service:string){return workers.filter(w=>w.service===service)}
function availability(id:string,bookings:Booking[]){if(localStorage.getItem(`sahyogsetu_worker_availability_${id}`)==='false')return 'OFFLINE';if(bookings.some(b=>b.workerId===id&&statuses.includes(b.status)))return 'BUSY';return 'AVAILABLE'}

export default function FederationShell({children}:{children:ReactNode}){
 const [lang,setLang]=useState<Lang>('en'),[bookings,setBookings]=useState<Booking[]>([]);
 const d=phase7[lang]; const op=phase13[lang]||phase13.en;
 useEffect(()=>{const l=localStorage.getItem(LANGUAGE_KEY) as Lang|null;if(l&&languages[l])setLang(l);setBookings(readBookings())},[]);
 function logout(){logoutDemo();window.location.replace('/')}
 const links=[['/federation',op.dashboard],['/federation/requests',op.requests],['/federation/workers',op.workers],['/federation/assignment',op.assignment],['/federation/map',op.map],['/federation/service-areas',op.serviceAreas],['/federation/analytics',op.analytics],['/federation/trainees',d.trainees],['/federation/profile',d.profile]];
 return <main className="min-h-screen bg-slate-50"><header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-5"><Link href="/federation" className="text-xl font-black text-[#16834b]">SahyogSetu</Link><div className="hidden items-center gap-2 lg:flex">{links.slice(0,6).map(([href,label])=><Link key={href} href={href} className="min-h-10 rounded-lg px-2 py-2 text-xs font-bold hover:bg-green-50 focus-visible:outline-none">{label}</Link>)}</div><div className="flex items-center gap-2"><NotificationBell/><select value={lang} onChange={e=>{const v=e.target.value as Lang;setLang(v);localStorage.setItem(LANGUAGE_KEY,v);window.dispatchEvent(new Event('sahyogsetu-lang-change'))}} className="min-h-10 max-w-28 rounded-lg border border-slate-200 px-2 py-2 text-xs">{Object.entries(languages).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select><span className="hidden min-h-10 items-center rounded-lg bg-green-50 px-3 py-2 text-xs font-black text-[#16834b] sm:inline-flex">{d.role}</span><button onClick={logout} className="btn btn-secondary text-xs">{d.logout}</button></div></div></header><div className="mx-auto max-w-7xl px-4 py-3 sm:px-5"></div><div className="mx-auto max-w-7xl px-4 py-4 lg:hidden"><div className="grid grid-cols-5 gap-2">{links.slice(0,5).map(([href,label])=><Link key={href} href={href} className="min-h-11 rounded-xl border bg-white p-2 text-center text-[11px] font-bold hover:border-green-200">{label}</Link>)}</div></div>{children}</main>
}
export function useFederationData(){const [bookings,setBookings]=useState<Booking[]>([]);useEffect(()=>{const load=()=>setBookings(readBookings());load();const i=window.setInterval(load,1000);return()=>window.clearInterval(i)},[]);return {bookings,setBookings,dummy:0}}
export {federation,workers,trainees,serviceAreas,availability};
