import { GoogleGenAI } from "@google/genai";
import { AttendanceRecord, AttendanceStats } from "../types";

// Helper to calculate stats for the prompt
const calculateStats = (records: AttendanceRecord[]): AttendanceStats => {
  const totalDays = records.length;
  const present = records.filter((r) => r.status === 'PRESENT').length;
  const absent = records.filter((r) => r.status === 'ABSENT').length;
  const late = records.filter((r) => r.status === 'LATE').length;
  const excused = records.filter((r) => r.status === 'EXCUSED').length;

  return {
    totalDays,
    present,
    absent,
    late,
    excused,
    attendanceRate: totalDays > 0 ? (present / totalDays) * 100 : 0,
  };
};

export const getAttendanceInsights = async (records: AttendanceRecord[]) => {
  if (!process.env.API_KEY) {
    console.warn("No API Key found for Gemini");
    return "AI insights unavailable: API Key not configured.";
  }

  const stats = calculateStats(records);
  const recentRecords = records.slice(0, 5); // Just send a few recent ones to avoid token limits in this demo

  const prompt = `
    Analyze the following attendance data for a student/employee.
    
    Overall Stats:
    - Total Recorded Days: ${stats.totalDays}
    - Present: ${stats.present}
    - Absent: ${stats.absent}
    - Late: ${stats.late}
    - Attendance Rate: ${stats.attendanceRate.toFixed(2)}%

    Recent Activity (Last 5 records):
    ${JSON.stringify(recentRecords, null, 2)}

    Please provide:
    1. A brief summary of their attendance performance.
    2. One specific constructive piece of advice or observation (e.g., "Frequent lateness on Mondays").
    3. A short, encouraging message.
    
    Format the output as a clean HTML string (using simple tags like <p>, <strong>, <ul>, <li>) suitable for a card display. Do not use markdown.
  `;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "<p>Unable to generate insights at this time.</p>";
  }
};