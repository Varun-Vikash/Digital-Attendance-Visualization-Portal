import React, { useState } from 'react';
import { AttendanceRecord } from '../types';
import { getAttendanceInsights } from '../services/geminiService';
import { Sparkles, Bot, RefreshCw } from 'lucide-react';

interface AIInsightsProps {
  records: AttendanceRecord[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ records }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await getAttendanceInsights(records);
      setInsight(result);
    } catch (e) {
      console.error(e);
      setInsight("Error generating insights.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-2xl font-bold text-slate-900">AI Attendance Counselor</h1>
        <p className="text-slate-500">Get personalized feedback powered by Gemini AI</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Control Card */}
        <div className="md:col-span-1 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Bot size={32} className="text-indigo-200" />
            <h2 className="text-xl font-bold">Ask Gemini</h2>
          </div>
          <p className="text-indigo-100 mb-8 leading-relaxed">
            Our AI analyzes your attendance patterns to find trends, potential issues, and offers constructive advice to improve your record.
          </p>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-white text-indigo-600 font-bold py-3 rounded-xl shadow-md hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
            {loading ? 'Analyzing...' : 'Generate Insights'}
          </button>
        </div>

        {/* Result Card */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[300px] flex flex-col">
          {insight ? (
            <div className="prose prose-slate max-w-none">
                <div className="flex items-center gap-2 mb-4 text-indigo-600">
                    <Sparkles size={20} />
                    <span className="font-semibold">AI Analysis Result</span>
                </div>
                {/* Render HTML safely since we control the source (mock) or sanitize it in real apps */}
                <div dangerouslySetInnerHTML={{ __html: insight }} />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                 <Bot size={32} />
              </div>
              <p>Click "Generate Insights" to analyze your data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIInsights;