export type PaymentStatus='PENDING'|'PAID'|'FAILED';
export type PaymentMethod='UPI'|'CARD'|'NET_BANKING'|'CASH';
export type Payment={id:string;bookingId:string;estimateId?:string;customerId:string;amount:number;method:PaymentMethod;status:PaymentStatus;transactionId?:string;createdAt:string;invoiceId:string};
export const PAYMENTS_KEY='sahyogsetu_payments';
export function readPayments():Payment[]{if(typeof window==='undefined')return [];try{const v=JSON.parse(localStorage.getItem(PAYMENTS_KEY)||'[]');return Array.isArray(v)?v:[]}catch{return []}}
export function savePayments(v:Payment[]){if(typeof window!=='undefined')localStorage.setItem(PAYMENTS_KEY,JSON.stringify(v))}
export function paymentFor(bookingId:string){return readPayments().find(x=>x.bookingId===bookingId)}
export function invoiceIdFor(bookingId:string){const n=bookingId.replace(/\D/g,'').slice(-4)||String(Date.now()).slice(-4);return `INV-${new Date().getFullYear()}-${n}`}
export function createOrUpdatePayment(input:{bookingId:string;estimateId?:string;customerId:string;amount:number;method:PaymentMethod;status:PaymentStatus}):Payment{
 const all=readPayments(),old=all.find(x=>x.bookingId===input.bookingId);
 const next:Payment=old?{...old,...input}:{id:`PAY-${input.bookingId}`,...input,createdAt:new Date().toISOString(),invoiceId:invoiceIdFor(input.bookingId)};
 savePayments(old?all.map(x=>x.id===old.id?next:x):[next,...all]);
 const invoices=(()=>{try{const v=JSON.parse(localStorage.getItem('sahyogsetu_invoices')||'[]');return Array.isArray(v)?v:[]}catch{return[]}})();
 const bookingList=(()=>{try{const v=JSON.parse(localStorage.getItem('sahyogsetu_bookings')||'[]');return Array.isArray(v)?v:[]}catch{return[]}})();
 const booking=bookingList.find((b:any)=>b.id===next.bookingId);
 const inv={id:next.invoiceId,invoiceId:next.invoiceId,bookingId:next.bookingId,paymentId:next.id,customerId:next.customerId,workerId:booking?.workerId||'',amount:next.amount,createdAt:next.createdAt,status:next.status};
 localStorage.setItem('sahyogsetu_invoices',JSON.stringify([inv,...invoices.filter((x:any)=>x.bookingId!==next.bookingId)]));
 return next;
}
