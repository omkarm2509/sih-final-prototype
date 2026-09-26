"use client";
import {useState} from 'react';
import {Lang,t} from '../locales';
import {saveCustomerLocation} from '../lib/customerLocation';
import BookingMap from './booking/BookingMap';

export default function LocationSelector({lang,initial='',onChange}:{lang:Lang;initial?:string;onChange?:(v:string)=>void}){
 const d=t[lang] as any; const [area,setArea]=useState(initial.split(',')[0]||''); const [city,setCity]=useState(initial.split(',')[1]?.trim()||'Pune'); const [landmark,setLandmark]=useState(''); const [open,setOpen]=useState(false); const [status,setStatus]=useState(''); const [coords,setCoords]=useState<{lat:number;lng:number}|undefined>();
 function save(source:'manual'|'current_location'|'demo'){
  if(!area.trim())return setStatus(d.p14?.area||'Enter an area');
  const v={area:area.trim(),city:city.trim()||'Pune',landmark:landmark.trim()||undefined,source};
  saveCustomerLocation(v); onChange?.(`${v.area}, ${v.city}`); setOpen(false); setStatus('');
 }
 function current(){
  if(!navigator.geolocation){setStatus(d.p14?.locationAccessUnavailable||'Location access unavailable.');return}
  setStatus('…');
  navigator.geolocation.getCurrentPosition(p=>{
    setCoords({lat:p.coords.latitude,lng:p.coords.longitude});
    const inPune=p.coords.latitude>18.35&&p.coords.latitude<18.65&&p.coords.longitude>73.65&&p.coords.longitude<74.0;
    if(inPune){setArea('Pune region');setCity('Pune');save('current_location');}
    else {setStatus(d.p14?.manualFallback||'Enter Location Manually');}
  },()=>setStatus(d.p14?.locationAccessUnavailable||'Location access unavailable.'),{enableHighAccuracy:false,timeout:8000});
 }
 return <div className="card p-5 sm:p-7">
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-black uppercase tracking-wide text-[#16834b]">📍 SahyogSetu</p><h2 className="mt-1 text-2xl font-black">{d.location.title}</h2>{initial&&<p className="mt-2 text-sm font-semibold text-[#16834b]">{d.p14?.regional||'Services available in'} {initial}</p>}</div><button onClick={()=>setOpen(v=>!v)} className="btn btn-secondary">{d.p14?.changeLocation||'Change Location'}</button></div>
  {open&&<div className="mt-5 grid gap-4 rounded-2xl bg-slate-50 p-4 sm:grid-cols-3"><div><label className="field-label">{d.p14?.area||'Area / Locality'}</label><input value={area} onChange={e=>setArea(e.target.value)} className="field mt-1"/></div><div><label className="field-label">{d.p14?.city||'City'}</label><input value={city} onChange={e=>setCity(e.target.value)} className="field mt-1"/></div><div><label className="field-label">{d.p14?.landmark||'Landmark'}</label><input value={landmark} onChange={e=>setLandmark(e.target.value)} className="field mt-1"/></div><div className="sm:col-span-3"><BookingMap coords={coords}/></div><div className="flex flex-col gap-2 sm:col-span-3 sm:flex-row"><button onClick={()=>save('manual')} className="btn btn-primary">{d.p14?.saveLocation||'Save Location'}</button><button onClick={current} className="btn btn-secondary">📍 {d.p14?.currentLocation||'Use My Current Location'}</button></div>{status&&<p role="status" className="text-sm font-semibold text-amber-700 sm:col-span-3">{status}</p>}</div>}
 </div>
}
