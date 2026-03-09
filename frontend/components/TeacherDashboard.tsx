import React, { useMemo, useState } from 'react';
import { AttendanceRecord, AttendanceStatus, User, UserRole } from '../types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { Users, UserCheck, UserX, AlertTriangle, TrendingUp } from 'lucide-react';
import AttendanceManagement from './AttendanceManagement';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface TeacherDashboardProps {
  user: User;
  records: AttendanceRecord[];
  users: User[];
  onDataChange: () => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6']; // Green, Red, Amber, Blue

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ 
  user, 
  records, 
  users, 
  onDataChange,
  selectedDate,
  onDateChange
}) => {
  const students = useMemo(() => users.filter(u => u.role === UserRole.STUDENT), [users]);
  
  // Calculate stats for today
  const todayStats = useMemo(() => {
    const todayRecords = records.filter(r => r.date === selectedDate);
    const present = todayRecords.filter(r => r.status === AttendanceStatus.PRESENT).length;
    const absent = todayRecords.filter(r => r.status === AttendanceStatus.ABSENT).length;
    const late = todayRecords.filter(r => r.status === AttendanceStatus.LATE).length;
    const excused = todayRecords.filter(r => r.status === AttendanceStatus.EXCUSED).length;
    const totalMarked = todayRecords.length;
    const totalStudents = students.length;
    
    return { present, absent, late, excused, totalMarked, totalStudents };
  }, [records, selectedDate, students]);

  // Overall class attendance rate
  const classAttendanceRate = useMemo(() => {
    const total = records.length;
    if (total === 0) return 0;
    const present = records.filter(r => r.status === AttendanceStatus.PRESENT).length;
    return ((present / total) * 100).toFixed(1);
  }, [records]);

  // Daily Trend Data (Last 7 days)
  const trendData = useMemo(() => {
    const last7Days = [...new Set(records.map(r => r.date))].sort().slice(-7);
    return last7Days.map(date => {
        const dayRecords = records.filter(r => r.date === date);
        const presentCount = dayRecords.filter(r => r.status === AttendanceStatus.PRESENT).length;
        const totalCount = dayRecords.length;
        return {
            date: date.slice(5), // MM-DD
            rate: totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0
        };
    });
  }, [records]);

  const barChartData = {
    labels: trendData.map(d => d.date),
    datasets: [
      {
        label: 'Class Rate (%)',
        data: trendData.map(d => d.rate),
        backgroundColor: '#3b82f6',
        borderRadius: 4,
      },
    ],
  };

  const pieData = [
    { name: 'Present', value: todayStats.present },
    { name: 'Absent', value: todayStats.absent },
    { name: 'Late', value: todayStats.late },
    { name: 'Excused', value: todayStats.excused },
  ].filter(d => d.value > 0);

  const pieChartData = {
    labels: pieData.map(d => d.name),
    datasets: [
      {
        data: pieData.map(d => d.value),
        backgroundColor: pieData.map((_, index) => COLORS[index % COLORS.length]),
        borderWidth: 0,
      },
    ],
  };

  const StatCard = ({ title, value, icon: Icon, color, bg }: any) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
      <div>
        <p className="text-slate-500 text-xs font-medium mb-1 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`w-10 h-10 ${bg} ${color} rounded-xl flex items-center justify-center`}>
        <Icon size={20} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Teacher Dashboard</h1>
          <p className="text-slate-500">Welcome back, {user.name}. Overview for {selectedDate === new Date().toISOString().split('T')[0] ? 'Today' : selectedDate}.</p>
        </div>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2">
            <TrendingUp size={18} />
            <span className="font-bold">{classAttendanceRate}%</span>
            <span className="text-blue-100 text-sm font-medium">Class Rate</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
            title="Total Students" 
            value={todayStats.totalStudents} 
            icon={Users} 
            color="text-blue-600" 
            bg="bg-blue-50" 
        />
        <StatCard 
            title="Present" 
            value={todayStats.present} 
            icon={UserCheck} 
            color="text-green-600" 
            bg="bg-green-50" 
        />
        <StatCard 
            title="Absent" 
            value={todayStats.absent} 
            icon={UserX} 
            color="text-red-600" 
            bg="bg-red-50" 
        />
        <StatCard 
            title="Pending" 
            value={todayStats.totalStudents - todayStats.totalMarked} 
            icon={AlertTriangle} 
            color="text-amber-600" 
            bg="bg-amber-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-500" />
            Class Attendance Trend (%)
          </h2>
          <div className="h-64">
             <Bar 
               data={barChartData}
               options={{
                 maintainAspectRatio: false,
                 plugins: { legend: { display: false } },
                 scales: {
                   y: { beginAtZero: true, border: { display: false } },
                   x: { grid: { display: false }, border: { display: false } }
                 }
               }}
             />
          </div>
        </div>

        {/* Distribution for selected date */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Status Split</h2>
          <div className="h-64">
            {pieData.length > 0 ? (
                <Pie 
                  data={pieChartData} 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'bottom' }
                    }
                  }} 
                />
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                        <AlertTriangle size={24} />
                    </div>
                    <p className="text-sm">No attendance marked yet</p>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Attendance Management */}
      <div className="pt-4">
        <AttendanceManagement 
            students={students} 
            records={records} 
            onUpdate={onDataChange}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
        />
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 flex items-start gap-3">
        <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" />
        <p>
          <strong>Reminder:</strong> Weekly reports are generated every Friday at 4:00 PM. Please ensure all attendance records for the week are finalized by then.
        </p>
      </div>
    </div>
  );
};

export default TeacherDashboard;