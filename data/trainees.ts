export type Trainee = {
  traineeId: string;
  name: string;
  phone: string;
  email: string;
  profileImage?: string;
  location: string;
  cooperative: string;
  trainingProgram: string;
  skillCategory: string;
  trainingLevel: string;
  enrollmentDate: string;
  trainingStatus: 'ENROLLED' | 'IN TRAINING' | 'ASSESSMENT' | 'CERTIFIED' | 'COMPLETED';
  certifications: { name: string; completed: boolean }[];
  progress: number;
  skillProgress: { name: string; progress: number }[];
  assignedTrainer: string;
};

export const trainees: Trainee[] = [
  {traineeId:'TRN-DEMO-001',name:'Demo Trainee',phone:'9000000002',email:'demo.trainee@sahyogsetu.local',location:'Pune',cooperative:'Pune Labour Cooperative Federation',trainingProgram:'Electrical Skills',skillCategory:'Electrical',trainingLevel:'Beginner',enrollmentDate:'2026-08-01',trainingStatus:'IN TRAINING',progress:65,skillProgress:[{name:'Electrical Safety',progress:80},{name:'Basic Wiring',progress:60}],certifications:[{name:'Workplace Safety',completed:true},{name:'Advanced Electrical Skills',completed:false}],assignedTrainer:'Demo Trainer'},
  {
    traineeId: 'TR-001',
    name: 'Amit Sharma',
    phone: 'XXXXXXXXXX',
    email: 'demo@sahyogsetu.local',
    location: 'Pune',
    cooperative: 'Pune Labour Cooperative',
    trainingProgram: 'Electrical Skills',
    skillCategory: 'Electrical',
    trainingLevel: 'Beginner',
    enrollmentDate: '2026-08-01',
    trainingStatus: 'IN TRAINING',
    progress: 65,
    skillProgress: [
      { name: 'Electrical Safety', progress: 80 },
      { name: 'Basic Wiring', progress: 60 },
      { name: 'Tools & Equipment', progress: 70 },
    ],
    certifications: [
      { name: 'Workplace Safety', completed: true },
      { name: 'Basic Electrical Safety', completed: true },
      { name: 'Advanced Electrical Skills', completed: false },
    ],
    assignedTrainer: 'Demo Trainer',
  },
];
