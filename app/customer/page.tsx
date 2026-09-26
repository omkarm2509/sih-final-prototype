"use client";
import {useEffect,useState} from 'react';
import Link from 'next/link';
import AuthGuard from '../../components/AuthGuard';
import NotificationBell from '../../components/NotificationBell';
import {languages,Lang,t} from '../../locales';
import {logoutDemo,readAuth} from '../../lib/auth';
import {readCustomerLocation} from '../../lib/customerLocation';
import LocationSelector from '../../components/LocationSelector';
import ServiceDiscovery from '../../components/ServiceDiscovery';

function CustomerContent(){
 const [lang,setLang]=useState<Lang>('en');const [location,setLocation]=useState('');const [user,setUser]=useState('Demo Customer');const [bookings,setBookings]=useState<any[]>([]);
 useEffect(()=>{const l=localStorage.getItem('sahyogsetu-language') as Lang|null;if(l&&languages[l])setLang(l);const loc=readCustomerLocation();if(loc)setLocation(`${loc.area}, ${loc.city}`);const a=readAuth();if(a.user)setUser(a.user.name);try{setBookings(JSON.parse(localStorage.getItem('sahyogsetu_bookings')||'[]'))}catch{}},[]);
 const d=t[lang] as any;
 function changeLang(v:Lang){setLang(v);localStorage.setItem('sahyogsetu-language',v)}
 function logout(){logoutDemo();window.location.replace('/')}
 const active=bookings.find(b=>!['COMPLETED','CANCELLED'].includes(b.status)); const recent=bookings.filter(b=>b!==active).slice(0,4);
 return <main className="min-h-screen bg-slate-50"><header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-4 lg:px-8"><Link href="/" className="text-xl font-black text-[#16834b]">SahyogSetu</Link><div className="flex items-center gap-2"><NotificationBell/><Link href="/customer/profile" className="rounded-xl border px-3 py-2 text-xs font-bold">{d.auth.profile}</Link><select value={lang} onChange={e=>changeLang(e.target.value as Lang)} className="max-w-24 rounded-lg border px-2 py-2 text-xs">{Object.entries(languages).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select><button onClick={logout} className="rounded-lg border px-3 py-2 text-sm font-bold">{d.auth.logout}</button></div></div></header>
 <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8"><div className="rounded-3xl bg-[#12251f] p-7 text-white sm:p-9"><p className="text-sm font-bold text-green-300">{d.auth.customerHome}</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">{d.auth.welcomeCustomer}, {user}</h1><p className="mt-2 text-sm text-white/70">{d.hero?.sub||'Find regional services through cooperative workers.'}</p></div><div className="mt-5"><LocationSelector lang={lang} initial={location} onChange={setLocation}/></div></section>
 {active&&<section className="mx-auto max-w-7xl px-5 pb-4 lg:px-8"><div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase text-[#16834b]">{(d.p14||{}).active||'Active Service'}</p><h2 className="mt-1 text-xl font-black">{d.services.items[active.service]}</h2><p className="mt-1 text-sm text-slate-500">{active.worker} · {active.location}</p></div><span className="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-[#16834b]">{active.status}</span><Link href={`/booking/${active.id}`} className="rounded-xl bg-[#16834b] px-4 py-2 text-sm font-bold text-white">{(d.p14||{}).track||'Track Booking'}</Link></div></div></section>}
 <section className="mx-auto max-w-7xl px-5 pb-12 lg:px-8"><ServiceDiscovery lang={lang} initialLocation={location}/></section>
 {recent.length>0&&<section className="mx-auto max-w-7xl px-5 pb-14 lg:px-8"><h2 className="text-2xl font-black">{(d.p14||{}).recent||'Recent Services'}</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{recent.map(b=><Link href={`/booking/${b.id}`} key={b.id} className="rounded-2xl border bg-white p-4 hover:border-green-200"><p className="text-xs text-slate-500">{b.id}</p><p className="mt-1 font-black">{d.services.items[b.service]}</p><p className="mt-1 text-sm text-slate-500">{b.status}</p></Link>)}</div></section>}
 </main>
}
export default function CustomerPage(){return <AuthGuard><CustomerContent/></AuthGuard>}
