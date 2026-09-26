export type Worker = { id:string; name:string; service:string; rating:number; reviews:number; experience:number; distance:number; eta:string; cooperative:string; verified:boolean; avatar:string };
export const workers: Worker[] = [
 {id:'wrk-demo-001',name:'Demo Worker',service:'plumbing',rating:4.8,reviews:12,experience:8,distance:1.8,eta:'~20–30 min',cooperative:'Pune Labour Cooperative Federation',verified:true,avatar:'👨‍🔧'},
 {id:'w1',name:'Ramesh Patil',service:'plumbing',rating:4.8,reviews:124,experience:8,distance:2.4,eta:'~20–30 min',cooperative:'Kothrud Cooperative',verified:true,avatar:'👨‍🔧'},
 {id:'w2',name:'Sunita Jadhav',service:'plumbing',rating:4.7,reviews:98,experience:6,distance:3.1,eta:'~25–35 min',cooperative:'West Pune Cooperative',verified:true,avatar:'👩‍🔧'},
 {id:'w3',name:'Amit Shinde',service:'electrical',rating:4.9,reviews:141,experience:9,distance:2.8,eta:'~20–30 min',cooperative:'Pune Electrical Cooperative',verified:true,avatar:'👨‍🔧'},
 {id:'w4',name:'Meena Pawar',service:'cleaning',rating:4.8,reviews:116,experience:7,distance:1.9,eta:'~15–25 min',cooperative:'Kothrud Cooperative',verified:true,avatar:'👩‍🔧'},
 {id:'w5',name:'Vijay More',service:'painting',rating:4.6,reviews:87,experience:10,distance:4.2,eta:'~30–40 min',cooperative:'Pune Skilled Workers Co-op',verified:true,avatar:'👨‍🎨'},
 {id:'w6',name:'Nitin Kale',service:'carpentry',rating:4.7,reviews:73,experience:8,distance:3.7,eta:'~25–35 min',cooperative:'Central Pune Cooperative',verified:true,avatar:'👨‍🔧'},
 {id:'w7',name:'Pooja Gaikwad',service:'gardening',rating:4.8,reviews:65,experience:5,distance:2.9,eta:'~20–30 min',cooperative:'Pune Green Cooperative',verified:true,avatar:'👩‍🌾'},
 {id:'w8',name:'Rahul Deshmukh',service:'appliance',rating:4.7,reviews:109,experience:7,distance:4.1,eta:'~30–40 min',cooperative:'Pune Repair Cooperative',verified:true,avatar:'👨‍🔧'},
 {id:'w9',name:'Kiran Bhosale',service:'other',rating:4.6,reviews:54,experience:6,distance:3.5,eta:'~25–35 min',cooperative:'Regional Services Cooperative',verified:true,avatar:'👨‍🔧'}
];
