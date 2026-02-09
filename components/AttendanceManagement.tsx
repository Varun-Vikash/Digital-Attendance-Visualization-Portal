import React, { useState, useEffect } from 'react';
import { User, AttendanceRecord, AttendanceStatus, UserRole } from '../types';
import { fetchUsers, markAttendance, fetchAttendance } from '../services/mockBackend';
import { Calendar, Check, X, Clock, AlertCircle, Loader2 } from 'lucide-react';

interface AttendanceManagementProps {
  onUpdate?: () => void;
}

const AttendanceManagement: React.FC<AttendanceManagementProps> = ({ onUpdate }) => {
  const [students, setStudents] = useState<User[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, attendanceData] = await Promise.all([
        fetchUsers(),
        fetchAttendance()
      ]);
      setStudents(usersData.filter(u => u.role === UserRole.STUDENT));
      setRecords(attendanceData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (userId: string, status: AttendanceStatus) => {
    setProcessingId(userId);
    try {
      await markAttendance({
        userId,
        date,
        status,
        checkInTime: status === AttendanceStatus.PRESENT ? '09:00 AM' : undefined,
        subject: 'Class Attendance' // Generic for teacher marking
      });
      // Refresh local records to reflect change immediately without full reload
      const updatedRecords = await fetchAttendance();
      setRecords(updatedRecords);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Failed to mark attendance", error);
    } finally {
      setProcessingId(null);
    }
  };

  const getStudentStatus = (userId: string) => {
    return records.find(r => r.userId === userId && r.date === date)?.status;
  };

  const StatusButton = ({ 
    status, 
    currentStatus, 
    onClick, 
    icon: Icon, 
    label,
    colorClass 
  }: any) => {
    const isActive = currentStatus === status;
    return (
      <button
        onClick={onClick}
        disabled={!!processingId}
        className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
          ${isActive 
            ? colorClass + ' ring-2 ring-offset-1 ring-slate-200 shadow-sm' 
            : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}
          ${!!processingId ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <Icon size={14} />
        <span className="hidden sm:inline">{label}</span>
      </button>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Class Attendance</h2>
          <p className="text-sm text-slate-500">Mark daily attendance for students</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
          <Calendar size={18} className="text-slate-400" />
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-slate-700 font-medium"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-xs uppercase text-slate-500 font-semibold">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center">
                  <Loader2 className="animate-spin mx-auto text-blue-600" />
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-slate-400">
                  No students found in the database.
                </td>
              </tr>
            ) : (
              students.map((student) => {
                const currentStatus = getStudentStatus(student.id);
                const isProcessing = processingId === student.id;

                return (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={student.avatar} 
                          alt="" 
                          className="w-8 h-8 rounded-full bg-slate-200" 
                        />
                        <div>
                          <p className="font-medium text-slate-900">{student.name}</p>
                          <p className="text-xs text-slate-500">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {currentStatus ? (
                        <span className={`
                          px-2.5 py-1 rounded-full text-xs font-semibold
                          ${currentStatus === AttendanceStatus.PRESENT ? 'bg-green-100 text-green-700' :
                            currentStatus === AttendanceStatus.ABSENT ? 'bg-red-100 text-red-700' :
                            currentStatus === AttendanceStatus.LATE ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-100 text-blue-700'}
                        `}>
                          {currentStatus}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Not Marked</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                         {isProcessing ? (
                           <Loader2 className="animate-spin text-blue-600 mr-4" size={18} />
                         ) : (
                           <>
                            <StatusButton 
                              status={AttendanceStatus.PRESENT}
                              currentStatus={currentStatus}
                              onClick={() => handleStatusChange(student.id, AttendanceStatus.PRESENT)}
                              icon={Check}
                              label="Present"
                              colorClass="bg-green-600 text-white hover:bg-green-700"
                            />
                            <StatusButton 
                              status={AttendanceStatus.LATE}
                              currentStatus={currentStatus}
                              onClick={() => handleStatusChange(student.id, AttendanceStatus.LATE)}
                              icon={Clock}
                              label="Late"
                              colorClass="bg-amber-500 text-white hover:bg-amber-600"
                            />
                            <StatusButton 
                              status={AttendanceStatus.EXCUSED}
                              currentStatus={currentStatus}
                              onClick={() => handleStatusChange(student.id, AttendanceStatus.EXCUSED)}
                              icon={AlertCircle}
                              label="Leave"
                              colorClass="bg-blue-500 text-white hover:bg-blue-600"
                            />
                            <StatusButton 
                              status={AttendanceStatus.ABSENT}
                              currentStatus={currentStatus}
                              onClick={() => handleStatusChange(student.id, AttendanceStatus.ABSENT)}
                              icon={X}
                              label="Absent"
                              colorClass="bg-red-500 text-white hover:bg-red-600"
                            />
                           </>
                         )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceManagement;
