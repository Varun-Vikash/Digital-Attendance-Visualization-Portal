import { AttendanceRecord, AttendanceStatus, User, UserRole } from '../types';

// Mock Users
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
  {
    id: '4',
    name: 'Jane Doe',
    email: 'jane@student.edu',
    role: UserRole.STUDENT,
    avatar: 'https://picsum.photos/id/68/200/200',
  },
  {
    id: '5',
    name: 'Mike Smith',
    email: 'mike@student.edu',
    role: UserRole.STUDENT,
    avatar: 'https://picsum.photos/id/70/200/200',
  }
];

const STORAGE_KEY = 'attendviz_db_v1';

// Load from "Database" (LocalStorage)
const loadAttendance = (): AttendanceRecord[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load from DB", e);
    return [];
  }
};

// In-memory store initialized from DB
let MOCK_ATTENDANCE: AttendanceRecord[] = loadAttendance();

const saveToDb = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_ATTENDANCE));
  } catch (e) {
    console.error("Failed to save to DB", e);
  }
};

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
      // Refresh from DB to ensure sync
      MOCK_ATTENDANCE = loadAttendance();
      if (userId) {
        resolve(MOCK_ATTENDANCE.filter(r => r.userId === userId));
      } else {
        resolve(MOCK_ATTENDANCE);
      }
    }, 400);
  });
};

export const fetchUsers = async (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_USERS);
    }, 400);
  });
};

export const markAttendance = async (record: Omit<AttendanceRecord, 'id' | 'userName'>): Promise<AttendanceRecord> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const user = MOCK_USERS.find(u => u.id === record.userId);
            
            // Check if record exists for this day and user, if so, update it
            const existingIndex = MOCK_ATTENDANCE.findIndex(
              r => r.userId === record.userId && r.date === record.date
            );

            let newRecord: AttendanceRecord;

            if (existingIndex >= 0) {
              // Update existing
              newRecord = {
                ...MOCK_ATTENDANCE[existingIndex],
                ...record,
                userName: user?.name || 'Unknown',
              };
              MOCK_ATTENDANCE[existingIndex] = newRecord;
            } else {
              // Create new
              newRecord = {
                ...record,
                id: `${record.userId}-${record.date}-${Date.now()}`,
                userName: user?.name || 'Unknown',
              };
              MOCK_ATTENDANCE = [newRecord, ...MOCK_ATTENDANCE];
            }
            
            saveToDb();
            resolve(newRecord);
        }, 300);
    });
};

export const resetAllAttendance = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      MOCK_ATTENDANCE = [];
      saveToDb();
      resolve();
    }, 500);
  });
};
