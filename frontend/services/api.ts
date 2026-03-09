import { AttendanceRecord, User, UserRole } from '../types';

const API_BASE_URL = 'https://attendviz-backend.onrender.com/api';

export const mockLogin = async (email: string, password?: string): Promise<{ user: User; token: string }> => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: password || 'password' }),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  return response.json();
};

export const fetchAttendance = async (userId?: string): Promise<AttendanceRecord[]> => {
  const url = userId 
    ? `${API_BASE_URL}/attendance?userId=${userId}` 
    : `${API_BASE_URL}/attendance`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch attendance');
  return response.json();
};

export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_BASE_URL}/users`);
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};

export const markAttendance = async (record: Omit<AttendanceRecord, 'id' | 'userName'>): Promise<AttendanceRecord> => {
    const response = await fetch(`${API_BASE_URL}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });

    if (!response.ok) throw new Error('Failed to mark attendance');
    return response.json();
};

export const resetAllAttendance = async (): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/reset`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to reset attendance');
};
