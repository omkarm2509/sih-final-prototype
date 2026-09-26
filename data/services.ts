export type ServiceKey = 'plumbing'|'electrical'|'cleaning'|'painting'|'carpentry'|'gardening'|'appliance'|'other';
export const serviceKeys: ServiceKey[] = ['plumbing','electrical','cleaning','painting','carpentry','gardening','appliance','other'];
export const serviceIcons: Record<ServiceKey,string> = {plumbing:'🔧',electrical:'⚡',cleaning:'🧹',painting:'🎨',carpentry:'🪚',gardening:'🌿',appliance:'🔌',other:'🤝'};
export const requirements: Record<ServiceKey,string[]> = {
 plumbing:['Leaking tap','Blocked drain','Pipe leakage','Water tank issue','Other'],
 electrical:['Fan not working','Switch/socket issue','Wiring issue','Light installation','Other'],
 cleaning:['Deep home cleaning','Kitchen cleaning','Bathroom cleaning','Community area cleaning','Other'],
 painting:['Single room painting','Full home painting','Wall touch-up','Exterior painting','Other'],
 carpentry:['Furniture repair','Door/window repair','Shelf installation','Custom carpentry','Other'],
 gardening:['Garden maintenance','Plant care','Lawn work','Tree trimming','Other'],
 appliance:['AC repair','Washing machine repair','Refrigerator repair','Small appliance repair','Other'],
 other:['Household assistance','Community maintenance','General repair','Other']
};
