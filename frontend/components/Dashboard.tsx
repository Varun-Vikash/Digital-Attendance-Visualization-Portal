import React, { useMemo } from 'react';
import { AttendanceRecord, AttendanceStatus } from '../types';
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
import { UserCheck, XCircle, Clock, AlertCircle } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

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

  // Weekly Trend Data (Last 7 days recorded)
  const trendData = useMemo(() => {
    return [...records].reverse().slice(-7).map(r => ({
        date: r.date.slice(5), // MM-DD
        statusValue: r.status === 'PRESENT' ? 100 : r.status === 'LATE' ? 50 : 0, // Numeric score for chart
        status: r.status
    }));
  }, [records]);

  const barChartData = {
    labels: trendData.map(d => d.date),
    datasets: [
      {
        label: 'Score',
        data: trendData.map(d => d.statusValue),
        backgroundColor: trendData.map(entry => 
          entry.status === 'PRESENT' ? '#22c55e' : 
          entry.status === 'LATE' ? '#f59e0b' : 
          '#ef4444'
        ),
        borderRadius: 4,
      },
    ],
  };

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
            <Bar 
              data={barChartData}
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { display: false, beginAtZero: true },
                  x: { grid: { display: false }, border: { display: false } }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Distribution</h2>
          <div className="h-64 flex justify-center">
            <Pie 
              data={pieChartData} 
              options={{ 
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' }
                }
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;