import React from 'react';
import { AttendanceRecord, AttendanceStatus } from '../types';

interface AttendanceListProps {
  records: AttendanceRecord[];
  showStudentName?: boolean;
}

const AttendanceList: React.FC<AttendanceListProps> = ({ records, showStudentName = false }) => {
  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.PRESENT:
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Present</span>;
      case AttendanceStatus.ABSENT:
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Absent</span>;
      case AttendanceStatus.LATE:
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Late</span>;
      case AttendanceStatus.EXCUSED:
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Excused</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">Unknown</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Attendance History</h1>
        <p className="text-slate-500">Detailed logs of {showStudentName ? 'all students' : 'your daily'} attendance</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-900">Date</th>
                {showStudentName && <th className="px-6 py-4 font-semibold text-slate-900">Student</th>}
                <th className="px-6 py-4 font-semibold text-slate-900">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-900">Check In</th>
                <th className="px-6 py-4 font-semibold text-slate-900">Subject</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.length > 0 ? (
                records.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{record.date}</td>
                    {showStudentName && <td className="px-6 py-4 text-slate-800">{record.userName}</td>}
                    <td className="px-6 py-4">{getStatusBadge(record.status)}</td>
                    <td className="px-6 py-4">{record.checkInTime || '--:--'}</td>
                    <td className="px-6 py-4">{record.subject || 'General'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={showStudentName ? 5 : 4} className="px-6 py-8 text-center text-slate-400">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceList;
