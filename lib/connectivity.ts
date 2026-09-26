export type ConnectivityState='online'|'limited'|'offline';
export const CONNECTIVITY_KEY='sahyogsetu_connectivity';
export const SYNC_KEY='sahyogsetu_sync_queue';
export function readConnectivity():ConnectivityState{if(typeof window==='undefined')return 'online';const v=localStorage.getItem(CONNECTIVITY_KEY);return v==='limited'||v==='offline'?v:'online'}
export function setConnectivity(v:ConnectivityState){localStorage.setItem(CONNECTIVITY_KEY,v);window.dispatchEvent(new Event('sahyogsetu-connectivity-change'));if(v==='online')syncQueue()}
export function readQueue():any[]{try{return JSON.parse(localStorage.getItem(SYNC_KEY)||'[]')}catch{return[]}}
export function queueAction(action:any){const q=readQueue();localStorage.setItem(SYNC_KEY,JSON.stringify([...q,{...action,id:action.id||`SYNC-${Date.now()}`,createdAt:action.createdAt||new Date().toISOString()}]));window.dispatchEvent(new Event('sahyogsetu-sync-change'))}
export function syncQueue(){const q=readQueue();if(q.length){localStorage.setItem(SYNC_KEY,'[]');localStorage.setItem('sahyogsetu_last_sync',new Date().toISOString());window.dispatchEvent(new Event('sahyogsetu-sync-change'))}}
