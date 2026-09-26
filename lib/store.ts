'use client';

export const BOOKING_KEY = 'sahyogsetu_bookings';
export const ESTIMATE_KEY = 'sahyogsetu_estimates';
export const PAYMENT_KEY = 'sahyogsetu_payments';
export const INVOICE_KEY = 'sahyogsetu_invoices';

export const BOOKING_STATUSES = ['REQUESTED','ASSIGNED','ACCEPTED','ON THE WAY','ARRIVED','INSPECTION','ESTIMATE','SERVICE','COMPLETED','CANCELLED'] as const;
export type BookingStatus = typeof BOOKING_STATUSES[number];

const transitions: Record<BookingStatus, BookingStatus[]> = {
  REQUESTED:['ASSIGNED','CANCELLED'],
  ASSIGNED:['ACCEPTED','CANCELLED'],
  ACCEPTED:['ON THE WAY','CANCELLED'],
  'ON THE WAY':['ARRIVED','CANCELLED'],
  ARRIVED:['INSPECTION','CANCELLED'],
  INSPECTION:['ESTIMATE','CANCELLED'],
  ESTIMATE:['SERVICE','CANCELLED'],
  SERVICE:['COMPLETED'],
  COMPLETED:[],
  CANCELLED:[],
};

export function safeRead<T>(key:string, fallback:T):T {
  if(typeof window==='undefined') return fallback;
  try {
    const raw=localStorage.getItem(key);
    if(!raw) return fallback;
    const value=JSON.parse(raw);
    return value===null||value===undefined?fallback:value as T;
  } catch { return fallback; }
}
export function safeWrite<T>(key:string,value:T){ if(typeof window!=='undefined') localStorage.setItem(key,JSON.stringify(value)); }

function stableBookingId(index:number){return `SGS-2026-${String(index+1).padStart(4,'0')}`}

export function normalizeBooking(raw:any,index:number):any {
  const status = BOOKING_STATUSES.includes(raw?.status) ? raw.status : 'REQUESTED';
  const locationObj = typeof raw?.location === 'object' && raw.location ? raw.location : null;
  const area = locationObj?.area || (typeof raw?.location==='string' ? raw.location.split(',')[0]?.trim() : '') || 'Pune';
  const city = locationObj?.city || (typeof raw?.location==='string' ? raw.location.split(',')[1]?.trim() : '') || 'Pune';
  const landmark = locationObj?.landmark || raw?.landmark || '';
  return {
    ...raw,
    id: raw?.id || stableBookingId(index),
    customerId: raw?.customerId || 'CU-001',
    customerName: raw?.customerName || raw?.customer || 'Demo Customer',
    customer: raw?.customer || raw?.customerName || 'Demo Customer',
    workerId: raw?.workerId || undefined,
    worker: raw?.worker || '',
    serviceId: raw?.serviceId || raw?.service || 'other',
    service: raw?.service || raw?.serviceId || 'other',
    serviceName: raw?.serviceName || raw?.service || raw?.serviceId || 'Other',
    requirement: raw?.requirement || '',
    location: typeof raw?.location==='string' ? raw.location : [area,city].filter(Boolean).join(', '),
    locationSnapshot:{area,city,landmark},
    scheduledDate: raw?.scheduledDate || raw?.date || '',
    scheduledTime: raw?.scheduledTime || raw?.time || '',
    date: raw?.date || raw?.scheduledDate || '',
    time: raw?.time || raw?.scheduledTime || '',
    status,
    estimateId: raw?.estimateId || null,
    paymentId: raw?.paymentId || null,
    invoiceId: raw?.invoiceId || null,
    createdAt: raw?.createdAt || new Date().toISOString(),
    updatedAt: raw?.updatedAt || raw?.createdAt || new Date().toISOString(),
  };
}

export function readBookings():any[]{
  const raw=safeRead<any[]>(BOOKING_KEY,[]);
  const list=Array.isArray(raw)?raw:[];
  return list.map(normalizeBooking);
}
export function saveBookings(bookings:any[]){safeWrite(BOOKING_KEY,bookings.map((b,i)=>normalizeBooking(b,i)));}
export function getBooking(id:string){return readBookings().find(b=>b.id===id)||null;}

export function canTransition(from:BookingStatus,to:BookingStatus){return from===to || transitions[from]?.includes(to)===true;}
export function updateBooking(id:string, patch:Record<string,any>, opts:{allowSame?:boolean}={}) {
  const list=readBookings();
  const before=list.find(b=>b.id===id);
  if(!before) return {ok:false,error:'BOOKING_NOT_FOUND' as const};
  const nextStatus=(patch.status||before.status) as BookingStatus;
  if(nextStatus!==before.status && !canTransition(before.status,nextStatus)) return {ok:false,error:'INVALID_STATUS_TRANSITION' as const,before};
  const next={...before,...patch,updatedAt:new Date().toISOString()};
  saveBookings(list.map(b=>b.id===id?next:b));
  return {ok:true,before,next};
}

export function readEstimates(){const v=safeRead<any>(ESTIMATE_KEY,[]);return Array.isArray(v)?v:[];}
export function saveEstimate(estimate:any){const all=safeRead<any[]>(ESTIMATE_KEY,[]);const next={...estimate,id:estimate.id||`EST-${estimate.bookingId}`,updatedAt:new Date().toISOString()};safeWrite(ESTIMATE_KEY,[next,...all.filter(x=>x?.bookingId!==next.bookingId)]);return next;}
export function estimateFor(bookingId:string){return safeRead<any[]>(ESTIMATE_KEY,[]).find(x=>x?.bookingId===bookingId)||null;}

export function syncEstimateFromBooking(booking:any){
  if(!booking?.estimateTotal && !booking?.laborCost && !booking?.materialCost) return null;
  const estimate=saveEstimate({id:booking.estimateId||`EST-${booking.id}`,bookingId:booking.id,workerId:booking.workerId||'',customerId:booking.customerId||'CU-001',labour:Number(booking.laborCost||0),materials:Number(booking.materialCost||0),other:Number(booking.otherCharges||0),inspectionCharge:Number(booking.inspectionCharge ?? 100),adjustment:booking.customerDecision==='ACCEPTED'?-Number(booking.inspectionCharge ?? 100):0,total:Number(booking.estimateTotal||0),status:booking.estimateStatus||'PENDING',createdAt:booking.estimateCreatedAt||booking.updatedAt||new Date().toISOString()});
  return estimate;
}

export function syncPaymentToBooking(payment:any){
  const b=getBooking(payment.bookingId); if(!b) return;
  const patch:any={paymentId:payment.id};
  if(payment.invoiceId) patch.invoiceId=payment.invoiceId;
  updateBooking(b.id,patch);
}

export function ensureDataIntegrity(){
  if(typeof window==='undefined') return;
  const bookings=readBookings(); saveBookings(bookings);
  // Normalize legacy payment rows and attach them to bookings without inventing new transactions.
  const payments=safeRead<any[]>(PAYMENT_KEY,[]).map((p:any)=>({...p,bookingId:p.bookingId||'',customerId:p.customerId||'CU-001',amount:Number(p.amount||0),status:['PENDING','PAID','FAILED'].includes(p.status)?p.status:'PENDING'}));
  safeWrite(PAYMENT_KEY,payments);
  const invoices=safeRead<any[]>(INVOICE_KEY,[]); safeWrite(INVOICE_KEY,invoices);
  bookings.forEach(b=>syncEstimateFromBooking(b));
}
