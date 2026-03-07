import React from 'react';
import AttendanceManagement from './AttendanceManagement';
import { User } from '../types';

interface TeacherDashboardProps {
  user: User;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900">Teacher Dashboard</h1>
        <p className="text-slate-500">Welcome back, {user.name}. Manage your class attendance below.</p>
      </div>
      
      <AttendanceManagement />
      
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
        <strong>Tip:</strong> Ensure attendance is marked by 10:00 AM daily. Changes are saved automatically to the database.
      </div>
    </div>
  );
};

export default TeacherDashboard;
