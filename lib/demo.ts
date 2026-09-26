'use client';
import { loginDemoCustomerIdentity, loginWorkerDemo, loginTraineeDemo, loginFederationDemo, roleHome, DemoRole, logoutDemo } from './auth';
import { readBookings, saveBookings, updateBooking, saveEstimate, syncEstimateFromBooking, BOOKING_KEY, ESTIMATE_KEY, PAYMENT_KEY, INVOICE_KEY } from './store';
import { createOrUpdatePayment } from './payments';
import { saveReview } from './reviews';
import { notifyBooking, notify } from './notifications';

export const DEMO_MODE_KEY='sahyogsetu_demo_mode';
export const DEMO_BACKUP_KEY='sahyogsetu_demo_backup';
export const DEMO_BOOKING_ID='SGS-DEMO-0001';
export const DEMO_CUSTOMER_ID='CUS-DEMO-001';
export const DEMO_WORKER_ID='wrk-demo-001';
export const DEMO_TRAINEE_ID='TRN-DEMO-001';
export const DEMO_FEDERATION_ID='FED-DEMO-001';

const managedKeys=[BOOKING_KEY,ESTIMATE_KEY,PAYMENT_KEY,INVOICE_KEY,'sahyogsetu_reviews','sahyogsetu_notifications','sahyogsetu_worker_availability_'+DEMO_WORKER_ID,'sahyogsetu_worker_rejections_'+DEMO_WORKER_ID,'sahyogsetu_customer','sahyogsetu_worker_profile','sahyogsetu_trainee_profile','sahyogsetu_federation_profile','sahyogsetu_worker_verification','sahyogsetu_auth','sahyogsetu_user','sahyogsetu-language','sahyogsetu-location','sahyogsetu_pending_intent'];

function snapshot(){
  const existing:any={}; managedKeys.forEach(k=>{existing[k]=localStorage.getItem(k)}); localStorage.setItem(DEMO_BACKUP_KEY,JSON.stringify(existing));
}
function clearManaged(){managedKeys.forEach(k=>localStorage.removeItem(k));}
function seedDemoBooking(status:any='REQUESTED'){
 return {id:DEMO_BOOKING_ID,customerId:DEMO_CUSTOMER_ID,customerName:'Demo Customer',customer:'Demo Customer',federationId:DEMO_FEDERATION_ID,serviceId:'plumbing',service:'plumbing',serviceName:'Plumbing',requirement:'Tap and pipe leakage repair',location:'Kothrud, Pune',locationSnapshot:{area:'Kothrud',city:'Pune',landmark:'Demo service area'},scheduledDate:'Today',scheduledTime:'Afternoon',date:'Today',time:'Afternoon',worker:'',workerId:undefined,workerRating:4.8,workerExperience:8,status,estimateId:null,paymentId:null,invoiceId:null,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
}
function historicalBooking(){return {id:'SGS-DEMO-0002',customerId:DEMO_CUSTOMER_ID,customer:'Demo Customer',customerName:'Demo Customer',federationId:DEMO_FEDERATION_ID,serviceId:'cleaning',service:'cleaning',serviceName:'Cleaning',requirement:'Bathroom deep cleaning',location:'Baner, Pune',date:'Yesterday',time:'Afternoon',scheduledDate:'Yesterday',scheduledTime:'Afternoon',worker:'Demo Worker',workerId:DEMO_WORKER_ID,status:'COMPLETED',estimateTotal:850,laborCost:600,materialCost:349,inspectionCharge:100,customerDecision:'ACCEPTED',estimateStatus:'ACCEPTED',completedAt:new Date().toISOString(),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};}

export function seedDemo(){
  clearManaged();
  const now=new Date().toISOString();
  saveBookings([seedDemoBooking(),historicalBooking()]);
  saveEstimate({id:'EST-SGS-DEMO-0002',bookingId:'SGS-DEMO-0002',workerId:DEMO_WORKER_ID,customerId:DEMO_CUSTOMER_ID,labour:600,materials:349,other:0,inspectionCharge:100,adjustment:-100,total:850,status:'ACCEPTED',createdAt:now});
  createOrUpdatePayment({bookingId:'SGS-DEMO-0002',estimateId:'EST-SGS-DEMO-0002',customerId:DEMO_CUSTOMER_ID,amount:850,method:'UPI',status:'PAID'});
  localStorage.setItem('sahyogsetu_payments',JSON.stringify([{...JSON.parse(localStorage.getItem('sahyogsetu_payments')||'[]')[0],transactionId:'TXN-DEMO-HISTORY'}]));
  localStorage.setItem('sahyogsetu_worker_availability_'+DEMO_WORKER_ID,'true');
  localStorage.setItem('sahyogsetu_customer',JSON.stringify({name:'Demo Customer',phone:'9000000001',email:'demo.customer@sahyogsetu.local',location:'Kothrud, Pune',language:localStorage.getItem('sahyogsetu-language')||'en',avatar:'👤'}));
  localStorage.setItem('sahyogsetu_worker_profile',JSON.stringify({[DEMO_WORKER_ID]:{id:DEMO_WORKER_ID,name:'Demo Worker',bio:'Verified plumbing professional for the SIH demonstration.',avatar:'👨‍🔧',primarySkill:'plumbing',additionalSkills:['Pipe Repair','Leak Detection'],experience:8,serviceAreas:['Kothrud','Baner','Shivajinagar'],availability:'AVAILABLE',cooperative:'Pune Labour Cooperative Federation',verified:true,verificationStatus:'VERIFIED',identityVerified:true,skillVerified:true,certificationVerified:true,certifications:[{name:'Plumbing Safety',year:2025,status:'Certified'},{name:'Workplace Safety',year:2025,status:'Certified'}]}}));
  localStorage.setItem('sahyogsetu_trainee_profile',JSON.stringify({traineeId:DEMO_TRAINEE_ID,name:'Demo Trainee',phone:'9000000002',email:'demo.trainee@sahyogsetu.local',location:'Pune',cooperative:'Pune Labour Cooperative Federation',trainingProgram:'Electrical Skills',skillCategory:'Electrical',trainingLevel:'Beginner',enrollmentDate:'2026-08-01',trainingStatus:'IN TRAINING',progress:65,skillProgress:[{name:'Electrical Safety',progress:80},{name:'Basic Wiring',progress:60}],certifications:[{name:'Workplace Safety',completed:true},{name:'Advanced Electrical Skills',completed:false}],assignedTrainer:'Demo Trainer'}));
  localStorage.setItem('sahyogsetu_federation_profile',JSON.stringify({federationId:DEMO_FEDERATION_ID,name:'Pune Labour Cooperative Federation',region:'Pune',serviceAreas:['Kothrud','Baner','Wakad','Shivajinagar','Hadapsar','Katraj'],coordinatorName:'Demo Federation Team'}));
  notify({userId:DEMO_TRAINEE_ID,role:'trainee',type:'TRAINING_UPDATE',title:'Training Update',message:'Demo training progress is ready.'});
  notify({userId:DEMO_FEDERATION_ID,role:'federation',type:'FEDERATION_ALERT',title:'Federation Alert',message:'Demo regional requests are ready.'});
}

function announceDemoChange(){if(typeof window!=='undefined')window.dispatchEvent(new Event('sahyogsetu-demo-change'));}

export function enterDemo(role:DemoRole='customer'){
  const already=localStorage.getItem(DEMO_MODE_KEY)==='true';
  if(!already){snapshot();localStorage.setItem(DEMO_MODE_KEY,'true');seedDemo();}
  localStorage.setItem('sahyogsetu-language',localStorage.getItem('sahyogsetu-language')||'en');
  announceDemoChange();
  switch(role){
    case 'worker': loginWorkerDemo('9000000003',DEMO_WORKER_ID,'Demo Worker','Kothrud, Pune'); break;
    case 'trainee': loginTraineeDemo('9000000002',DEMO_TRAINEE_ID,'Demo Trainee','Pune'); break;
    case 'federation': loginFederationDemo(DEMO_FEDERATION_ID,'Pune Labour Cooperative Federation','Pune'); break;
    default: loginDemoCustomerIdentity('9000000001','Kothrud, Pune',DEMO_CUSTOMER_ID);
  }
}

export function resetDemo(){
  if(localStorage.getItem(DEMO_MODE_KEY)!=='true') return;
  seedDemo();
  loginDemoCustomerIdentity('9000000001','Kothrud, Pune',DEMO_CUSTOMER_ID);
}
export function exitDemo(){
  const raw=localStorage.getItem(DEMO_BACKUP_KEY); logoutDemo(); if(raw){try{const backup=JSON.parse(raw); clearManaged(); Object.entries(backup).forEach(([k,v])=>{if(v!==null)localStorage.setItem(k,String(v))});}catch{}}
  localStorage.removeItem(DEMO_BACKUP_KEY);localStorage.removeItem(DEMO_MODE_KEY);announceDemoChange();
}
export function isDemoMode(){return typeof window!=='undefined'&&localStorage.getItem(DEMO_MODE_KEY)==='true';}
export function demoBooking(){return readBookings().find(b=>b.id===DEMO_BOOKING_ID)||null;}

export function demoQuickAction(action:string){
 const b=demoBooking(); if(!b) return {ok:false,error:'NO_DEMO_BOOKING'};
 const patch:any={};
 if(action==='assign'&&b.status==='REQUESTED') Object.assign(patch,{status:'ASSIGNED',workerId:DEMO_WORKER_ID,worker:'Demo Worker',workerRating:4.8,workerExperience:8});
 else if(action==='accept'&&b.status==='ASSIGNED') patch.status='ACCEPTED';
 else if(action==='travel'&&b.status==='ACCEPTED') patch.status='ON THE WAY';
 else if(action==='arrived'&&b.status==='ON THE WAY') Object.assign(patch,{status:'ARRIVED',arrivedAt:new Date().toISOString()});
 else if(action==='inspection'&&b.status==='ARRIVED') patch.status='INSPECTION';
 else if(action==='estimate'&&b.status==='INSPECTION') Object.assign(patch,{status:'ESTIMATE',workerId:DEMO_WORKER_ID,worker:'Demo Worker',inspectionCharge:100,laborCost:700,materialCost:500,otherCharges:0,estimateTotal:1200,estimateStatus:'PENDING',customerDecision:'PENDING',estimateId:`EST-${DEMO_BOOKING_ID}`,estimateCreatedAt:new Date().toISOString(),inspectionNotes:'Tap and pipe leakage identified during demo inspection.'});
 else if(action==='acceptEstimate'&&b.status==='ESTIMATE'&&b.estimateStatus==='PENDING') Object.assign(patch,{status:'ESTIMATE',estimateStatus:'ACCEPTED',customerDecision:'ACCEPTED',estimateAccepted:true});
 else if(action==='service'&&b.status==='ESTIMATE'&&b.customerDecision==='ACCEPTED') Object.assign(patch,{status:'SERVICE',serviceStartedAt:new Date().toISOString()});
 else if(action==='complete'&&b.status==='SERVICE') Object.assign(patch,{status:'COMPLETED',completedAt:new Date().toISOString()});
 else if(action==='payment'&&b.status==='COMPLETED'){const pay=createOrUpdatePayment({bookingId:b.id,estimateId:b.estimateId||`EST-${b.id}`,customerId:DEMO_CUSTOMER_ID,amount:Number(b.estimateTotal||0),method:'UPI',status:'PAID'});const all=JSON.parse(localStorage.getItem(PAYMENT_KEY)||'[]');localStorage.setItem(PAYMENT_KEY,JSON.stringify(all.map((x:any)=>x.id===pay.id?{...x,transactionId:`TXN-DEMO-${b.id}`}:x)));updateBooking(b.id,{paymentId:pay.id,invoiceId:pay.invoiceId});notifyBooking('PAYMENT_SUCCESSFUL',getFresh(),{customer:true,worker:true,federation:true});notifyBooking('INVOICE_AVAILABLE',getFresh(),{customer:true});return {ok:true,next:getFresh()};}
 else if(action==='review'&&b.status==='COMPLETED'){const ok=saveReview({reviewId:`REV-${b.id}`,bookingId:b.id,customerId:DEMO_CUSTOMER_ID,workerId:DEMO_WORKER_ID,rating:5,feedback:'Good service.',createdAt:new Date().toISOString()});if(ok){updateBooking(b.id,{reviewSubmitted:true});notifyBooking('REVIEW_RECEIVED',getFresh(),{customer:false,worker:true,federation:true});}return {ok};}
 else return {ok:false,error:'ACTION_NOT_ALLOWED'};
 const result=updateBooking(b.id,patch); if(!result.ok)return result; const next=result.next;
 if(action==='estimate') syncEstimateFromBooking(next);
 const event:any={assign:'WORKER_ASSIGNED',accept:'BOOKING_ACCEPTED',travel:'WORKER_ON_THE_WAY',arrived:'WORKER_ARRIVED',inspection:'INSPECTION_STARTED',estimate:'ESTIMATE_READY',acceptEstimate:'ESTIMATE_ACCEPTED',service:'SERVICE_STARTED',complete:'SERVICE_COMPLETED'}[action];
 if(event) notifyBooking(event,next,{customer:true,worker:true,federation:true});
 if(action==='accept') localStorage.setItem('sahyogsetu_worker_availability_'+DEMO_WORKER_ID,'false');
 if(action==='complete') localStorage.setItem('sahyogsetu_worker_availability_'+DEMO_WORKER_ID,'true');
 return {ok:true,next};
}
function getFresh(){return readBookings().find(x=>x.id===DEMO_BOOKING_ID)||null}
export const DEMO_STEPS=[['assign','Assign Worker','REQUESTED'],['accept','Accept Job','ASSIGNED'],['travel','Start Travel','ACCEPTED'],['arrived','Mark Arrived','ON THE WAY'],['inspection','Start Inspection','ARRIVED'],['estimate','Create Estimate','INSPECTION'],['acceptEstimate','Accept Estimate','ESTIMATE'],['service','Start Service','ESTIMATE'],['complete','Complete Service','SERVICE'],['payment','Mark Payment','COMPLETED'],['review','Submit Review','COMPLETED']] as const;
