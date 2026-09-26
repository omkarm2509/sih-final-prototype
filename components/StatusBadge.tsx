'use client';

const labels: Record<string,string> = {
  REQUESTED:'Requested', ASSIGNED:'Assigned', ACCEPTED:'Accepted', ON_THE_WAY:'On the way',
  ARRIVED:'Arrived', INSPECTION:'Inspection', ESTIMATE:'Estimate', SERVICE:'Service',
  COMPLETED:'Completed', CANCELLED:'Cancelled'
};
const classes: Record<string,string> = {
  REQUESTED:'status-requested', ASSIGNED:'status-assigned', ACCEPTED:'status-accepted',
  ON_THE_WAY:'status-on-the-way', ARRIVED:'status-arrived', INSPECTION:'status-inspection',
  ESTIMATE:'status-estimate', SERVICE:'status-service', COMPLETED:'status-completed', CANCELLED:'status-cancelled'
};
export default function StatusBadge({status,label}:{status:string;label?:string}){
  return <span className={`status-badge ${classes[status]||'status-assigned'}`} aria-label={label||labels[status]||status}>{label||labels[status]||status}</span>;
}
