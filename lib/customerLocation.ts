import { LOCATION_KEY } from './auth';
export const CUSTOMER_LOCATION_KEY='sahyogsetu_customer_location';
export type CustomerLocation={area:string;city:string;landmark?:string;source:'manual'|'current_location'|'demo'};

export function readCustomerLocation():CustomerLocation|null{
 if(typeof window==='undefined') return null;
 try{
  const raw=localStorage.getItem(CUSTOMER_LOCATION_KEY);
  if(raw) return JSON.parse(raw);
  const legacy=localStorage.getItem(LOCATION_KEY);
  return legacy?{area:legacy,city:'Pune',source:'demo'}:null;
 }catch{return null}
}
export function saveCustomerLocation(v:CustomerLocation){
 localStorage.setItem(CUSTOMER_LOCATION_KEY,JSON.stringify(v));
 localStorage.setItem(LOCATION_KEY,[v.area,v.city].filter(Boolean).join(', '));
}
export function clearCustomerLocation(){localStorage.removeItem(CUSTOMER_LOCATION_KEY);localStorage.removeItem(LOCATION_KEY)}
