import React, { useState } from 'react';
import { AttendanceStatus, User } from '../types';
import { markAttendance } from '../services/mockBackend';
import { MapPin, CheckCircle, Loader2 } from 'lucide-react';

interface MarkAttendanceProps {
  user: User;
  onUpdate: () => void;
}

const MarkAttendance: React.FC<MarkAttendanceProps> = ({ user, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [date] = useState(new Date().toISOString().split('T')[0]);

  const handleMark = async () => {
    setLoading(true);
    try {
      await markAttendance({
        userId: user.id,
        date: date,
        status: AttendanceStatus.PRESENT,
        checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        subject: 'Self Check-in',
      });
      setSuccess(true);
      onUpdate();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
          <CheckCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-green-800 mb-2">Checked In Successfully!</h2>
        <p className="text-green-600">You have been marked present for today.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-6 text-green-700 font-medium hover:underline"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
       <div>
        <h1 className="text-2xl font-bold text-slate-900">Mark Attendance</h1>
        <p className="text-slate-500">Self check-in for {date}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="mb-8">
           <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-50 rounded-full text-blue-600 mb-4 animate-pulse">
             <MapPin size={48} />
           </div>
           <h3 className="text-lg font-semibold text-slate-800">Your Location: Campus Zone A</h3>
           <p className="text-slate-400 text-sm">Geofencing Active</p>
        </div>

        <button
          onClick={handleMark}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              Processing...
            </>
          ) : (
            'Check In Now'
          )}
        </button>
        <p className="mt-4 text-xs text-slate-400">By clicking check-in, you certify that you are physically present.</p>
      </div>
    </div>
  );
};

export default MarkAttendance;