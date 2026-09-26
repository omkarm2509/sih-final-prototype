import type { ServiceKey } from './services';

export type RegionalArea = {
  name: string;
  city: string;
  supported: ServiceKey[];
  limited: ServiceKey[];
};

export const regionalAreas: RegionalArea[] = [
  {name:'Kothrud',city:'Pune',supported:['plumbing','electrical','cleaning','carpentry','painting','appliance'],limited:['gardening','other']},
  {name:'Baner',city:'Pune',supported:['plumbing','electrical','cleaning','painting','carpentry','appliance'],limited:['gardening','other']},
  {name:'Wakad',city:'Pune',supported:['plumbing','electrical','cleaning','appliance'],limited:['carpentry','painting','gardening']},
  {name:'Shivajinagar',city:'Pune',supported:['plumbing','electrical','cleaning','carpentry','painting','other'],limited:['gardening','appliance']},
  {name:'Hadapsar',city:'Pune',supported:['plumbing','electrical','cleaning','painting','appliance','other'],limited:['carpentry','gardening']},
  {name:'Katraj',city:'Pune',supported:['plumbing','electrical','cleaning','carpentry','other'],limited:['painting','gardening','appliance']},
];

export const serviceDetails: Record<ServiceKey,{items:string[]; starting?:number; process:string; response:string}> = {
  plumbing:{items:['Tap Repair','Pipe Leakage','Bathroom Fitting','Water Tank Repair'],starting:299,process:'Requirement → worker matching → inspection → estimate → service',response:'Typically within an approximate local service window'},
  electrical:{items:['Fan Installation','Switch / Socket Repair','Wiring Issue','Light Installation'],starting:249,process:'Requirement → worker matching → inspection → estimate → service',response:'Regional demo availability shown before booking'},
  cleaning:{items:['Bathroom Cleaning','Kitchen Cleaning','Deep Home Cleaning','Community Area Cleaning'],starting:399,process:'Choose service → confirm area → receive service estimate',response:'Approximate scheduling shown during booking'},
  painting:{items:['Single Room Painting','Wall Touch-up','Full Home Painting','Exterior Painting'],starting:699,process:'Requirement → inspection → final estimate → service',response:'Availability depends on selected area'},
  carpentry:{items:['Furniture Repair','Door / Window Repair','Shelf Installation','Custom Carpentry'],starting:349,process:'Requirement → inspection → estimate → service',response:'Availability depends on worker coverage'},
  gardening:{items:['Garden Maintenance','Plant Care','Lawn Work','Tree Trimming'],starting:299,process:'Choose service → regional matching → service',response:'Limited demo availability in some areas'},
  appliance:{items:['AC Repair','Washing Machine Repair','Refrigerator Repair','Small Appliance Repair'],starting:399,process:'Requirement → inspection → estimate → service',response:'Approximate response shown in booking flow'},
  other:{items:['Household Assistance','Community Maintenance','General Repair'],process:'Requirement → regional matching → estimate where needed → service',response:'Coverage varies by demo area'}
};

export function areaFor(value:string){
  const s=value.toLowerCase();
  return regionalAreas.find(a=>s.includes(a.name.toLowerCase())) || null;
}
export function serviceLabel(k:ServiceKey){return ({plumbing:'Plumbing',electrical:'Electrical',cleaning:'Cleaning',painting:'Painting',carpentry:'Carpentry',gardening:'Gardening',appliance:'Appliance Repair',other:'Other'} as Record<ServiceKey,string>)[k]}
