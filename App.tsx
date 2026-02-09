import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AttendanceList from './components/AttendanceList';
import MarkAttendance from './components/MarkAttendance';
import AIInsights from './components/AIInsights';
import { fetchAttendance } from './services/mockBackend';
import { AttendanceRecord, UserRole } from './types';
import { Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Load data when authenticated
  const loadData = async () => {
    if (user) {
      setDataLoading(true);
      try {
        // If admin, show all (conceptually), but for this demo, just show user's or mock specific set
        const data = await fetchAttendance(user.role === UserRole.STUDENT ? user.id : undefined);
        setRecords(data);
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

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {dataLoading ? (
        <div className="h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : (
        <>
            {activeTab === 'dashboard' && <Dashboard records={records} />}
            {activeTab === 'history' && <AttendanceList records={records} />}
            {activeTab === 'mark' && user?.role === UserRole.STUDENT && (
                <MarkAttendance user={user} onUpdate={loadData} />
            )}
            {activeTab === 'insights' && <AIInsights records={records} />}
        </>
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