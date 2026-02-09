import { AttendanceRecord, AttendanceStatus, User, UserRole } from '../types';

// Mock Data
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Alice Admin',
    email: 'admin@school.edu',
    role: UserRole.ADMIN,
    avatar: 'https://picsum.photos/id/64/200/200',
  },
  {
    id: '2',
    name: 'John Student',
    email: 'john@student.edu',
    role: UserRole.STUDENT,
    avatar: 'https://picsum.photos/id/65/200/200',
  },
  {
    id: '3',
    name: 'Sarah Teacher',
    email: 'sarah@school.edu',
    role: UserRole.TEACHER,
    avatar: 'https://picsum.photos/id/66/200/200',
  },
];

const generateMockAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const subjects = ['Math', 'Science', 'History', 'Physics'];
  const now = new Date();
  
  // Generate 30 days of history
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    MOCK_USERS.forEach(user => {
      if (user.role === UserRole.STUDENT) {
        // Random status
        const rand = Math.random();
        let status = AttendanceStatus.PRESENT;
        if (rand < 0.1) status = AttendanceStatus.ABSENT;
        else if (rand < 0.2) status = AttendanceStatus.LATE;
        
        records.push({
          id: `${user.id}-${dateStr}`,
          userId: user.id,
          userName: user.name,
          date: dateStr,
          status,
          checkInTime: status !== AttendanceStatus.ABSENT ? '08:00 AM' : undefined,
          subject: subjects[Math.floor(Math.random() * subjects.length)],
        });
      }
    });
  }
  return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

let MOCK_ATTENDANCE = generateMockAttendance();

export const mockLogin = async (email: string): Promise<{ user: User; token: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS.find((u) => u.email === email);
      if (user) {
        resolve({
          user,
          token: `mock-jwt-token-${user.id}-${Date.now()}`,
        });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 800);
  });
};

export const fetchAttendance = async (userId?: string): Promise<AttendanceRecord[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (userId) {
        resolve(MOCK_ATTENDANCE.filter(r => r.userId === userId));
      } else {
        resolve(MOCK_ATTENDANCE);
      }
    }, 500);
  });
};

export const markAttendance = async (record: Omit<AttendanceRecord, 'id' | 'userName'>): Promise<AttendanceRecord> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const user = MOCK_USERS.find(u => u.id === record.userId);
            const newRecord: AttendanceRecord = {
                ...record,
                id: `${record.userId}-${Date.now()}`,
                userName: user?.name || 'Unknown',
            };
            MOCK_ATTENDANCE = [newRecord, ...MOCK_ATTENDANCE];
            resolve(newRecord);
        }, 500);
    });
}