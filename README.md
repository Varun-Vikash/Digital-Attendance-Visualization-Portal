# 📊 AttendViz - Digital Attendance Visualization Portal

A modern attendance management and visualization system built with React and TypeScript. This application provides comprehensive attendance tracking with role-based access control and interactive data visualizations.

![React](https://img.shields.io/badge/React-19.2.4-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6.svg)

## ✨ Features

### 🎯 Core Functionality
- **Role-Based Authentication**: Support for Admin, Teacher, and Student roles with tailored dashboards
- **Interactive Data Visualization**: Beautiful charts and graphs using Recharts library
- **Real-time Attendance Tracking**: Mark and monitor attendance with multiple status types
- **Comprehensive Statistics**: Detailed analytics on attendance patterns and trends

### 📈 Visualization Features
- **Pie Charts**: Visual breakdown of attendance status distribution
- **Bar Charts**: Comparative analysis of attendance records
- **Line Charts**: Trend analysis over time periods
- **Weekly Trends**: Track attendance patterns across weeks

### 👥 Role-Specific Features

#### 🔑 Admin Dashboard
- View and manage all users in the system
- Access comprehensive attendance records
- Monitor system-wide attendance statistics
- Manage attendance records for all students

#### 👨‍🏫 Teacher Dashboard
- Access to class attendance data
- Quick overview of student performance

#### 🎓 Student Dashboard
- Personal attendance history and statistics
- Self-service attendance marking
- Visual representation of attendance performance

## 🛠️ Technologies Used

### Frontend
- **React 19.2.4**: Modern UI library
- **TypeScript 5.8.2**: Type-safe development
- **Vite 6.2.0**: Fast build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Composable charting library
- **Lucide React**: Modern icon library

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Fast, unopinionated web framework
- **SQLite**: Lightweight, file-based database
- **JSON Web Token (JWT)**: Secure authentication

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install Frontend dependencies:
   ```bash
   npm install
   ```

2. Install Backend dependencies:
   ```bash
   cd server
   npm install
   cd ..
   ```

### Running the Application

1. Start the Backend server:
   ```bash
   cd server
   npm run dev
   ```

2. Start the Frontend development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## 🔐 Credentials (Demo)

| Role    | Email              | Password |
|---------|-------------------|----------|
| Admin   | admin@school.edu  | password |
| Teacher | sarah@school.edu  | password |
| Student | john@student.edu  | password |

## 📁 Project Structure

/home/varun/attend/
├───App.tsx
├───index.html
├───index.tsx
├───package.json
├───README.md
├───tsconfig.json
├───types.ts
├───vite.config.ts
├───components/
│   ├───AdminDashboard.tsx
│   ├───AttendanceList.tsx
│   ├───AttendanceManagement.tsx
│   ├───Dashboard.tsx
│   ├───Layout.tsx
│   ├───Login.tsx
│   ├───MarkAttendance.tsx
│   └───TeacherDashboard.tsx
├───context/
│   └───AuthContext.tsx
├───services/
│   └───api.ts              # API service for backend communication
└───server/
    ├───db.js               # Database configuration
    ├───index.js            # Express server entry point
    └───package.json        # Backend dependencies
