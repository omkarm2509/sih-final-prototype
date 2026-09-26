export type Federation = {
  federationId:string;
  name:string;
  region:string;
  serviceAreas:string[];
  coordinatorName:string;
};
export const federation: Federation = {
  federationId:'FED-001',
  name:'Pune Labour Cooperative Federation',
  region:'Pune',
  serviceAreas:['Kothrud','Shivajinagar','Baner','Hadapsar'],
  coordinatorName:'Demo Coordinator'
};
