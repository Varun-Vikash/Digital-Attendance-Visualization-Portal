import React, { useMemo } from 'react';
import { AttendanceRecord, AttendanceStatus } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { UserCheck, XCircle, Clock, AlertCircle } from 'lucide-react';

interface DashboardProps {
  records: AttendanceRecord[];
}

const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6']; // Green, Red, Amber, Blue

const Dashboard: React.FC<DashboardProps> = ({ records }) => {
  const stats = useMemo(() => {
    const total = records.length;
    const present = records.filter(r => r.status === AttendanceStatus.PRESENT).length;
    const absent = records.filter(r => r.status === AttendanceStatus.ABSENT).length;
    const late = records.filter(r => r.status === AttendanceStatus.LATE).length;
    const excused = records.filter(r => r.status === AttendanceStatus.EXCUSED).length;
    
    return { total, present, absent, late, excused };
  }, [records]);

  const pieData = [
    { name: 'Present', value: stats.present },
    { name: 'Absent', value: stats.absent },
    { name: 'Late', value: stats.late },
    { name: 'Excused', value: stats.excused },
  ].filter(d => d.value > 0);

  // Weekly Trend Data (Last 7 days recorded)
  const trendData = useMemo(() => {
    return [...records].reverse().slice(-7).map(r => ({
        date: r.date.slice(5), // MM-DD
        statusValue: r.status === 'PRESENT' ? 100 : r.status === 'LATE' ? 50 : 0, // Numeric score for chart
        status: r.status
    }));
  }, [records]);

  const StatCard = ({ title, value, icon: Icon, color, bg }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`w-12 h-12 ${bg} ${color} rounded-full flex items-center justify-center`}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Attendance Dashboard</h1>
          <p className="text-slate-500">Overview of your performance</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium text-sm">
          Attendance Rate: {stats.total ? ((stats.present / stats.total) * 100).toFixed(1) : 0}%
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Present" 
          value={stats.present} 
          icon={UserCheck} 
          color="text-green-600" 
          bg="bg-green-50" 
        />
        <StatCard 
          title="Total Absent" 
          value={stats.absent} 
          icon={XCircle} 
          color="text-red-600" 
          bg="bg-red-50" 
        />
        <StatCard 
          title="Late Arrivals" 
          value={stats.late} 
          icon={Clock} 
          color="text-amber-600" 
          bg="bg-amber-50" 
        />
        <StatCard 
          title="Excused" 
          value={stats.excused} 
          icon={AlertCircle} 
          color="text-blue-600" 
          bg="bg-blue-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Attendance Trend (Last 7 Days)</h2>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={trendData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                 <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                 <YAxis hide />
                 <Tooltip 
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                   cursor={{ fill: '#f1f5f9' }}
                 />
                 <Bar dataKey="statusValue" name="Score" radius={[4, 4, 0, 0]}>
                   {trendData.map((entry, index) => (
                     <Cell 
                        key={`cell-${index}`} 
                        fill={
                            entry.status === 'PRESENT' ? '#22c55e' : 
                            entry.status === 'LATE' ? '#f59e0b' : 
                            '#ef4444'
                        } 
                     />
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
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
      </div>
    </div>
  );
};

export default Dashboard;