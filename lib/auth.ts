export type DemoRole = 'customer' | 'worker' | 'trainee' | 'federation';

export type DemoUser = {
  name: string;
  phone: string;
  role: DemoRole;
  location: string;
  workerId?: string;
  traineeId?: string;
  federationId?: string;
  userId?: string;
};

export type AuthState = {
  isAuthenticated: boolean;
  role?: DemoRole;
  user?: DemoUser;
};

export const AUTH_KEY = 'sahyogsetu_auth';
export const USER_KEY = 'sahyogsetu_user';
export const CUSTOMER_KEY = 'sahyogsetu_customer';
export const WORKER_KEY = 'sahyogsetu_worker';
export const TRAINEE_KEY = 'sahyogsetu_trainee';
export const FEDERATION_KEY = 'sahyogsetu_federation';
export const LOCATION_KEY = 'sahyogsetu-location';
export const LANGUAGE_KEY = 'sahyogsetu-language';
export const INTENT_KEY = 'sahyogsetu_pending_intent';

export function readAuth(): AuthState {
  if (typeof window === 'undefined') return { isAuthenticated: false };
  try {
    const auth = localStorage.getItem(AUTH_KEY);
    const user = localStorage.getItem(USER_KEY);
    if (auth === 'true' && user) {
      const parsed = JSON.parse(user) as DemoUser;
      return { isAuthenticated: true, role: parsed.role, user: parsed };
    }
  } catch {}
  return { isAuthenticated: false };
}

function persistSession(user: DemoUser, profileKey: string) {
  localStorage.setItem(AUTH_KEY, 'true');
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(profileKey, JSON.stringify(user));
}

export function loginDemo(phone: string, location: string): DemoUser {
  return loginDemoCustomerIdentity(phone, location);
}

export function loginDemoCustomerIdentity(phone: string, location: string, userId='CU-001', name='Demo Customer'): DemoUser {
  const user: DemoUser = { name, phone, role: 'customer', location, userId };
  persistSession(user, CUSTOMER_KEY);
  return user;
}

export function loginWorkerDemo(phone: string, workerId: string, workerName: string, location: string): DemoUser {
  const user: DemoUser = { name: workerName, phone, role: 'worker', workerId, userId: workerId.toUpperCase(), location };
  persistSession(user, WORKER_KEY);
  return user;
}

export function loginTraineeDemo(phone: string, traineeId: string, traineeName: string, location: string): DemoUser {
  const user: DemoUser = { name: traineeName, phone, role: 'trainee', traineeId, userId: traineeId.toUpperCase(), location };
  persistSession(user, TRAINEE_KEY);
  return user;
}


export function loginFederationDemo(federationId: string, name: string, location: string): DemoUser {
  const user: DemoUser = { name, phone: '', role: 'federation', federationId, userId: federationId.toUpperCase(), location };
  persistSession(user, FEDERATION_KEY);
  return user;
}

export function logoutDemo() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(USER_KEY);
}

export function roleHome(role?: DemoRole) {
  if (role === 'worker') return '/worker';
  if (role === 'trainee') return '/trainee';
  if (role === 'federation') return '/federation';
  return '/customer';
}

export function roleLogin(role: DemoRole) {
  if (role === 'worker') return '/worker/login';
  if (role === 'trainee') return '/trainee/login';
  if (role === 'federation') return '/federation/login';
  return '/login';
}
