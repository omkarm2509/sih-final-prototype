'use client';
import { workers, Worker } from '../data/workers';
import { trainees } from '../data/trainees';
import { federation } from '../data/federation';
import { readReviews, Review } from './reviews';
import { readAuth } from './auth';

export const CUSTOMER_PROFILE_KEY='sahyogsetu_customer';
export const WORKER_PROFILE_KEY='sahyogsetu_worker_profile';
export const TRAINEE_PROFILE_KEY='sahyogsetu_trainee_profile';
export const FEDERATION_PROFILE_KEY='sahyogsetu_federation_profile';
export const VERIFICATION_KEY='sahyogsetu_worker_verification';

export type WorkerProfile={
 id:string; name:string; bio:string; avatar:string; primarySkill:string; additionalSkills:string[];
 experience:number; serviceAreas:string[]; availability:'AVAILABLE'|'BUSY'|'OFFLINE'; cooperative:string;
 verified:boolean; verificationStatus:'VERIFIED'|'PENDING'|'NOT VERIFIED'; identityVerified:boolean;
 skillVerified:boolean; certificationVerified:boolean; certifications:{name:string;year:number;status:'Certified'|'Pending'}[];
};
export type CustomerProfile={name:string;phone:string;email:string;location:string;language:string;avatar:string};

const workerDefaults:Record<string,WorkerProfile>=Object.fromEntries(workers.map(w=>[w.id,{
 id:w.id,name:w.name,bio:`Skilled ${w.service} professional serving local households.`,avatar:w.avatar,
 primarySkill:w.service,additionalSkills:w.service==='plumbing'?['Pipe Repair','Bathroom Fitting','Water Tank Installation','Leak Detection']:
 w.service==='electrical'?['Basic Wiring','Electrical Safety','Appliance Wiring']:['Service & Maintenance','Safety Practices'],
 experience:w.experience,serviceAreas:w.id==='w1'?['Kothrud','Baner','Shivajinagar']:w.cooperative.includes('West')?['Kothrud','Baner']:['Pune'],
 availability:'AVAILABLE',cooperative:w.cooperative,verified:w.verified,verificationStatus:w.verified?'VERIFIED':'PENDING',identityVerified:w.verified,skillVerified:w.verified,certificationVerified:w.verified,
 certifications:[{name:`${w.service[0].toUpperCase()+w.service.slice(1)} Safety`,year:2025,status:'Certified'},{name:'Workplace Safety',year:2024,status:'Certified'}]
}]));

export function readWorkerProfile(id?:string):WorkerProfile{
 const wid=id||readAuth().user?.workerId||'w1';
 try{const all=JSON.parse(localStorage.getItem(WORKER_PROFILE_KEY)||'{}');const base={...workerDefaults[wid],...(all[wid]||{})};const av=localStorage.getItem(`sahyogsetu_worker_availability_${wid}`);return av===null?base:{...base,availability:av==='false'?'OFFLINE':'AVAILABLE'}}catch{return workerDefaults[wid]}
}
export function saveWorkerProfile(profile:WorkerProfile){const all=JSON.parse(localStorage.getItem(WORKER_PROFILE_KEY)||'{}');all[profile.id]=profile;localStorage.setItem(WORKER_PROFILE_KEY,JSON.stringify(all));}
export function readCustomerProfile():CustomerProfile{
 const auth=readAuth();
 const base={name:auth.user?.name||'Demo Customer',phone:auth.user?.phone||'',email:'demo@sahyogsetu.local',location:auth.user?.location||'',language:localStorage.getItem('sahyogsetu-language')||'en',avatar:'👤'};
 try{return {...base,...JSON.parse(localStorage.getItem(CUSTOMER_PROFILE_KEY)||'{}')}}catch{return base}
}
export function saveCustomerProfile(p:CustomerProfile){localStorage.setItem(CUSTOMER_PROFILE_KEY,JSON.stringify(p));}
export function readTraineeProfile(){const base=trainees[0];try{return {...base,...JSON.parse(localStorage.getItem(TRAINEE_PROFILE_KEY)||'{}')}}catch{return base}}
export function saveTraineeProfile(p:any){localStorage.setItem(TRAINEE_PROFILE_KEY,JSON.stringify(p));}
export function readFederationProfile(){try{return {...federation,...JSON.parse(localStorage.getItem(FEDERATION_PROFILE_KEY)||'{}')}}catch{return federation}}
export function workerReviews(workerId:string):Review[]{return readReviews().filter(r=>r.workerId===workerId)}
export function workerStats(workerId:string){
 const reviews=workerReviews(workerId); const bookings:any[]=(()=>{try{return JSON.parse(localStorage.getItem('sahyogsetu_bookings')||'[]')}catch{return[]}})();
 const completed=bookings.filter(b=>b.workerId===workerId&&b.status==='COMPLETED').length;
 const avg=reviews.length?reviews.reduce((s,r)=>s+r.rating,0)/reviews.length:undefined;
 const fallback=workers.find(w=>w.id===workerId);
 return {reviews,completed,rating:avg===undefined?fallback?.rating||0:Number(avg.toFixed(1)),reviewCount:reviews.length||fallback?.reviews||0}
}
export function workerCompleteness(p:WorkerProfile){const checks=[p.name,p.bio,p.primarySkill,p.additionalSkills.length,p.experience,p.serviceAreas.length,p.avatar];return Math.round(checks.filter(Boolean).length/checks.length*100)}
export function readVerification(workerId:string){const p=readWorkerProfile(workerId);try{const all=JSON.parse(localStorage.getItem(VERIFICATION_KEY)||'{}');return {...p,...(all[workerId]||{})}}catch{return p}}
export function saveVerification(workerId:string,patch:Partial<WorkerProfile>){const all=JSON.parse(localStorage.getItem(VERIFICATION_KEY)||'{}');all[workerId]={...(all[workerId]||{}),...patch};localStorage.setItem(VERIFICATION_KEY,JSON.stringify(all));}
