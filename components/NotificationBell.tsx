'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {readAuth} from '../lib/auth';
import {readNotifications} from '../lib/notifications';

export default function NotificationBell(){
 const [count,setCount]=useState(0);
 function load(){const a=readAuth();setCount(a.user?.userId?readNotifications().filter(n=>n.userId===a.user?.userId&&n.role===a.role&&!n.read).length:0)}
 useEffect(()=>{load();const i=setInterval(load,1000);return()=>clearInterval(i)},[]);
 return <Link href="/notifications" aria-label={`Notifications${count?`, ${count} unread`:''}`} className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg hover:bg-slate-50 focus-visible:outline-none">
   <span aria-hidden="true">🔔</span>{count>0&&<span aria-hidden="true" className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white">{count>9?'9+':count}</span>}
 </Link>
}
