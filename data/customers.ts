export type DemoCustomer = {
  customerId: string;
  name: string;
  phone: string;
  location: string;
};

export const customers: DemoCustomer[] = [
  { customerId: 'CU-001', name: 'Demo Customer', phone: 'XXXXXXXXXX', location: 'Pune' },
];
