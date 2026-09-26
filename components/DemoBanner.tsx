'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {DEMO_MODE_KEY} from '../lib/demo';
export default function DemoBanner(){const [on,setOn]=useState(false);useEffect(()=>{const f=()=>setOn(localStorage.getItem(DEMO_MODE_KEY)==='true');f();window.addEventListener('storage',f);return()=>window.removeEventListener('storage',f)},[]);if(!on)return null;return <div className="sticky top-0 z-[90] border-b border-amber-200 bg-amber-50/95 px-3 py-2 text-center backdrop-blur"><span className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-white px-3 py-1 text-xs font-black text-amber-800"><span className="h-2 w-2 rounded-full bg-amber-500"/>SIH DEMO MODE</span><Link href="/demo" className="ml-2 text-xs font-bold text-amber-900 underline">Demo controls</Link></div>}
