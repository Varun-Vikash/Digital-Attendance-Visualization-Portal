import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import AttendanceList from './components/AttendanceList';
import MarkAttendance from './components/MarkAttendance';
import { fetchAttendance, fetchUsers } from './services/api';
import { AttendanceRecord, UserRole, User } from './types';
import { Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Load data when authenticated
  const loadData = async () => {
    if (user) {
      setDataLoading(true);
      try {
        const [attendanceData, usersData] = await Promise.all([
            fetchAttendance(user.role === UserRole.STUDENT ? user.id : undefined),
            (user.role === UserRole.ADMIN || user.role === UserRole.TEACHER) ? fetchUsers() : Promise.resolve([])
        ]);
        
        setRecords(attendanceData);
        setUsers(usersData);
      } catch (e) {
        console.error("Failed to load records", e);
      } finally {
        setDataLoading(false);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  // Determine dashboard based on role
  const renderDashboard = () => {
    switch (user.role) {
      case UserRole.ADMIN:
        return <AdminDashboard records={records} users={users} onDataChange={loadData} selectedDate={selectedDate} onDateChange={setSelectedDate} />;
      case UserRole.TEACHER:
        return <TeacherDashboard user={user} records={records} users={users} onDataChange={loadData} selectedDate={selectedDate} onDateChange={setSelectedDate} />;
      default:
        return <Dashboard records={records} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {dataLoading && records.length === 0 ? (
        <div className="h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : (
        <div className="relative">
            {dataLoading && (
              <div className="absolute -top-6 right-0 flex items-center gap-2 text-xs text-slate-400 font-medium">
                <Loader2 className="animate-spin" size={12} />
                Updating...
              </div>
            )}
            {activeTab === 'dashboard' && renderDashboard()}
            
            {activeTab === 'history' && (
              <AttendanceList 
                records={records} 
                showStudentName={user?.role !== UserRole.STUDENT} 
              />
            )}
            
            {activeTab === 'mark' && user?.role === UserRole.STUDENT && (
                <MarkAttendance user={user} onUpdate={loadData} />
            )}
        </div>
      )}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
