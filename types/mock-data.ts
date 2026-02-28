export interface DemoUser {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  role: 'org-owner' | 'org-admin';
  orgId?: string;
  createdAt: string;
}

export const demoUsers: DemoUser[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    username: 'admin',
    password: 'admin123',
    role: 'org-owner',
    orgId: 'org-1',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    username: 'jane',
    password: 'jane123',
    role: 'org-admin',
    orgId: 'org-1',
    createdAt: new Date().toISOString(),
  },
];
