'use client';
import {useEffect,useState} from 'react';
import {useParams,useRouter} from 'next/navigation';
import AuthGuard from '../../../../components/AuthGuard';
import {languages,Lang,t,phase11} from '../../../../locales';
import {readAuth} from '../../../../lib/auth';
import {createOrUpdatePayment,paymentFor,PaymentMethod} from '../../../../lib/payments';
import {notifyBooking} from '../../../../lib/notifications';
import {readConnectivity} from '../../../../lib/connectivity';
import {getBooking,updateBooking} from '../../../../lib/store';
import {getPaymentAmount,getPaymentContext} from '../../../../lib/paymentAmount';

function Page(){
 const{id}=useParams<{id:string}>(),router=useRouter();
 const[lang,setLang]=useState<Lang>('en'),[b,setB]=useState<any>(),[method,setMethod]=useState<PaymentMethod>('UPI'),[msg,setMsg]=useState('');
 const d=(t as any)[lang],p=(phase11 as any)[lang];
 useEffect(()=>{const l=localStorage.getItem('sahyogsetu-language') as Lang|null;if(l)setLang(l);setB(getBooking(id))},[id]);
 function pay(success:boolean){
   if(!b)return;
   if(readConnectivity()==='offline'){setMsg(p.notConfirmed);return}
   const auth=readAuth();const status=success?'PAID':'FAILED';
   const amount = getPaymentAmount(b, getPaymentContext(b));
   const pay=createOrUpdatePayment({bookingId:id,customerId:auth.user?.userId||b.customerId||'CU-001',amount,method,status});
   if(success){
     const all=JSON.parse(localStorage.getItem('sahyogsetu_payments')||'[]');
     const transactionId=pay.transactionId||`TXN-DEMO-${id}`;
     localStorage.setItem('sahyogsetu_payments',JSON.stringify(all.map((x:any)=>x.id===pay.id?{...x,transactionId}:x)));
     updateBooking(id,{paymentId:pay.id,invoiceId:pay.invoiceId});
     notifyBooking('PAYMENT_SUCCESSFUL',{...b},{customer:true});
     notifyBooking('INVOICE_AVAILABLE',{...b},{customer:true});
     setMsg(p.successText);
     setTimeout(()=>router.push(`/customer/invoice/${id}`),500);
   }else setMsg(p.failureText)
 }
 if(!b)return <AuthGuard role="customer"><div className="p-8">Booking not found.</div></AuthGuard>;
 const old=paymentFor(id); const cancelled=b.status==='CANCELLED'; const paymentContext=getPaymentContext(b); const isServicePayment=paymentContext==='SERVICE'; const amount=getPaymentAmount(b,paymentContext); const existingPayment=old && Number(old.amount)===amount ? old : undefined;
 return <AuthGuard role="customer"><main className="min-h-screen bg-slate-50"><header className="border-b bg-white"><div className="mx-auto flex max-w-3xl justify-between px-5 py-4"><button onClick={()=>router.push(`/booking/${id}`)} className="text-xl font-black text-[#16834b]">SahyogSetu</button><select value={lang} onChange={e=>{const v=e.target.value as Lang;setLang(v);localStorage.setItem('sahyogsetu-language',v)}} className="rounded-lg border px-2 py-2">{Object.entries(languages).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></div></header><section className="mx-auto max-w-3xl px-5 py-8"><div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8"><h1 className="text-3xl font-black">{d.booking.paymentTitle}</h1><p className="mt-2 text-sm text-slate-500">{d.booking.paymentIntro}</p><p className="mt-1 text-sm text-slate-500">{p.bookingId}: {b.id}</p><div className="mt-6 rounded-2xl bg-green-50 p-5"><p>{d.services.items[b.service as keyof typeof d.services.items]} · {b.worker}</p><p className="mt-2 text-3xl font-black">₹{amount.toLocaleString('en-IN')}</p><p className="mt-1 text-sm text-slate-600">{isServicePayment ? 'Final service payment' : d.booking.initialChargeLabel}</p></div><h2 className="mt-7 text-xl font-black">{p.paymentMethod}</h2><div className="mt-3 grid gap-3 sm:grid-cols-2">{([['UPI',p.upi],['CARD',p.card],['NET_BANKING',p.netBanking],['CASH',p.cash]] as [PaymentMethod,string][]).map(([v,label])=><button key={v} onClick={()=>setMethod(v)} className={`rounded-xl border p-4 text-left font-bold ${method===v?'border-[#16834b] bg-green-50':''}`}>{label}</button>)}</div>{method==='CASH'?<p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm">{p.cash}</p>:<div className="mt-6 rounded-2xl border p-5"><p className="font-bold">{method==='UPI'?p.upi:method==='CARD'?p.card:p.netBanking} — prototype simulation</p><div className="mt-4 flex flex-col gap-3 sm:flex-row"><button disabled={cancelled} onClick={()=>pay(true)} className="rounded-xl bg-[#16834b] px-5 py-3 font-black text-white">{d.booking.payNow}</button><button disabled={cancelled} onClick={()=>pay(false)} className="rounded-xl border px-5 py-3 font-black">{p.failed}</button></div></div>}{method==='CASH'&&!cancelled&&<button onClick={()=>{createOrUpdatePayment({bookingId:id,customerId:b.customerId||'CU-001',amount,method:'CASH',status:'PENDING'});router.push(`/customer/invoice/${id}`)}} className="mt-6 w-full rounded-xl border px-5 py-3 font-black">{p.pending}</button>}{cancelled&&<div role="alert" className="mt-5 rounded-xl bg-red-50 p-4 font-bold text-red-700">{d.booking.cancelled}</div>}{msg&&<div role="alert" className="mt-5 rounded-xl bg-slate-100 p-4 font-bold">{msg}</div>}{existingPayment&&<button onClick={()=>router.push(`/customer/invoice/${id}`)} className="mt-5 text-sm font-bold text-[#16834b]">{d.booking.receipt}</button>}</div></section></main></AuthGuard>
}
export default Page;
