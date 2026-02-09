import React, { useMemo, useState } from 'react';
import { AttendanceRecord, AttendanceStatus, User, UserRole } from '../types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Users, Filter, Calendar, TrendingUp, AlertCircle, Lock, Copy } from 'lucide-react';

interface AdminDashboardProps {
  records: AttendanceRecord[];
  users: User[];
}

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981']; // Blue, Red, Amber, Green

const AdminDashboard: React.FC<AdminDashboardProps> = ({ records, users }) => {
  const [subjectFilter, setSubjectFilter] = useState<string>('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Get unique subjects for filter
  const subjects = useMemo(() => {
    const subs = new Set(records.map(r => r.subject).filter(Boolean));
    return ['All', ...Array.from(subs)];
  }, [records]);

  // Filter records based on selection
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const matchSubject = subjectFilter === 'All' || record.subject === subjectFilter;
      const recordDate = new Date(record.date);
      const matchStart = !dateRange.start || recordDate >= new Date(dateRange.start);
      const matchEnd = !dateRange.end || recordDate <= new Date(dateRange.end);
      return matchSubject && matchStart && matchEnd;
    });
  }, [records, subjectFilter, dateRange]);

  // Stats Calculation
  const stats = useMemo(() => {
    const total = filteredRecords.length;
    const present = filteredRecords.filter(r => r.status === AttendanceStatus.PRESENT).length;
    const absent = filteredRecords.filter(r => r.status === AttendanceStatus.ABSENT).length;
    const late = filteredRecords.filter(r => r.status === AttendanceStatus.LATE).length;
    const excused = filteredRecords.filter(r => r.status === AttendanceStatus.EXCUSED).length;
    const attendanceRate = total > 0 ? ((present / total) * 100).toFixed(1) : '0';

    return { total, present, absent, late, excused, attendanceRate };
  }, [filteredRecords]);

  // Charts Data
  const pieData = [
    { name: 'Present', value: stats.present },
    { name: 'Absent', value: stats.absent },
    { name: 'Late', value: stats.late },
    { name: 'Excused', value: stats.excused },
  ].filter(d => d.value > 0);

  const dayOfWeekData = useMemo(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const counts = [0, 0, 0, 0, 0, 0, 0];
    
    filteredRecords.forEach(r => {
      if (r.status === AttendanceStatus.ABSENT || r.status === AttendanceStatus.LATE) {
        const day = new Date(r.date).getDay();
        counts[day]++;
      }
    });

    return days.slice(1, 6).map((day, index) => ({ // Mon-Fri
      day,
      count: counts[index + 1]
    }));
  }, [filteredRecords]);

  return (
    <div className="space-y-8">
      {/* Header & Filters */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>
          <p className="text-slate-500">School-wide attendance analytics</p>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-400" />
            <select 
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              {subjects.map(s => <option key={s} value={s}>{s} Class</option>)}
            </select>
          </div>
          <div className="h-6 w-px bg-slate-200 hidden md:block" />
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-slate-400" />
            <input 
              type="date" 
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            />
            <span className="text-slate-400">-</span>
            <input 
              type="date" 
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <p className="text-blue-100 font-medium">Attendance Rate</p>
            <TrendingUp size={24} className="text-blue-200" />
          </div>
          <h3 className="text-4xl font-bold">{stats.attendanceRate}%</h3>
          <p className="text-sm text-blue-200 mt-2">Based on filtered range</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-500 font-medium">Total Absences</p>
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                <AlertCircle size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{stats.absent}</h3>
          <p className="text-sm text-slate-400 mt-2">Recorded incidents</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-500 font-medium">Active Students</p>
             <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Users size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">
            {users.filter(u => u.role === UserRole.STUDENT).length}
          </h3>
          <p className="text-sm text-slate-400 mt-2">Total enrolled</p>
        </div>
      </div>

      {/* Visualizations */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Attendance Distribution</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Absence & Late Patterns (Mon-Fri)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayOfWeekData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} allowDecimals={false} />
                <Tooltip 
                   cursor={{fill: '#f8fafc'}}
                   contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" name="Incidents" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User Credentials Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Lock size={20} className="text-slate-400" />
            System Credentials
          </h2>
          <span className="text-xs font-mono bg-slate-200 px-2 py-1 rounded text-slate-600">Admin Only</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate-900">User</th>
                <th className="px-6 py-3 font-semibold text-slate-900">Role</th>
                <th className="px-6 py-3 font-semibold text-slate-900">Login ID (Email)</th>
                <th className="px-6 py-3 font-semibold text-slate-900">Password</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img src={user.avatar} alt="" className="w-8 h-8 rounded-full bg-slate-200" />
                    <span className="font-medium text-slate-900">{user.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold
                      ${user.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' : 
                        user.role === UserRole.TEACHER ? 'bg-orange-100 text-orange-700' : 
                        'bg-blue-100 text-blue-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-600">{user.email}</td>
                  <td className="px-6 py-4 font-mono text-slate-400 flex items-center gap-2">
                    ••••••••
                    <span className="text-xs text-slate-300 ml-2">(Default: password)</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
