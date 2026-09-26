import {workers} from '../data/workers';
import {areaFor} from '../data/regional';
import type {ServiceKey} from '../data/services';

const serviceAreas:Record<string,string[]>={
 w1:['Kothrud','Baner','Shivajinagar'],w2:['Kothrud','Baner'],w3:['Kothrud','Wakad','Shivajinagar'],w4:['Kothrud','Baner','Hadapsar'],
 w5:['Baner','Wakad','Hadapsar'],w6:['Kothrud','Shivajinagar','Wakad'],w7:['Wakad','Hadapsar','Katraj'],w8:['Kothrud','Baner','Hadapsar'],w9:['Kothrud','Katraj','Shivajinagar']
};
export function workerAreas(id:string){return serviceAreas[id]||[]}
export function eligibleWorkers(service:ServiceKey,area:string){
 return workers.filter(w=>w.service===service && workerAreas(w.id).some(a=>a.toLowerCase()===area.toLowerCase()));
}
export function availabilityFor(service:ServiceKey,area:string){
 const matches=eligibleWorkers(service,area);
 return {count:matches.length,available:matches.filter(w=>w.reviews>=0).length};
}
export function searchServices(q:string){
 const s=q.trim().toLowerCase();
 const catalog:Record<ServiceKey,string[]>={
  plumbing:['plumbing','tap repair','pipe leakage','bathroom fitting','water tank repair'],
  electrical:['electrical','fan installation','switch','socket','wiring','light installation'],
  cleaning:['cleaning','bathroom cleaning','kitchen cleaning','deep home cleaning'],
  painting:['painting','painter','wall touch-up','room painting'],
  carpentry:['carpentry','furniture repair','door repair','shelf installation'],
  gardening:['gardening','garden maintenance','lawn','plant care'],
  appliance:['appliance repair','ac repair','washing machine','refrigerator'],
  other:['other','household assistance','community maintenance','general repair']
 };
 if(!s)return Object.keys(catalog) as ServiceKey[];
 return (Object.entries(catalog).filter(([_,words])=>words.some(x=>x.includes(s)||s.includes(x))).map(([k])=>k) as ServiceKey[]);
}
