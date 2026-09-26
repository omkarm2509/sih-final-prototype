export const BOOKING_KEY='sahyogsetu_bookings';
export type Period='today'|'week'|'month'|'all';
export function readLocal<T>(key:string, fallback:T):T{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch{return fallback}}
export function periodStart(period:Period){const d=new Date();d.setHours(0,0,0,0);if(period==='today')return d;if(period==='week'){d.setDate(d.getDate()-6);return d}if(period==='month'){d.setDate(1);return d}return new Date(0)}
export function inPeriod(value:string|undefined,period:Period){if(period==='all')return true;const d=new Date(value||'');return !Number.isNaN(d.getTime())&&d>=periodStart(period)}
export function filteredBookings(bookings:any[],period:Period,service:string){return bookings.filter(b=>inPeriod(b.createdAt,period)&&(service==='all'||b.service===service))}
export function csvEscape(v:any){return `"${String(v??'').replaceAll('"','""')}"`}
