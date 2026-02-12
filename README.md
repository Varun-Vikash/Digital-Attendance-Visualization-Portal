# 📊 AttendViz AI - Digital Attendance Visualization Portal

A modern, intelligent attendance management and visualization system built with React, TypeScript, and AI-powered insights. This application provides comprehensive attendance tracking with role-based access control and interactive data visualizations.

![React](https://img.shields.io/badge/React-19.2.4-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6.svg)

## ✨ Features

### 🎯 Core Functionality
- **Role-Based Authentication**: Support for Admin, Teacher, and Student roles with tailored dashboards
- **Interactive Data Visualization**: Beautiful charts and graphs using Recharts library
- **AI-Powered Insights**: Intelligent attendance analysis using Google Gemini AI
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
- AI-powered insights for teaching effectiveness
- Access to class attendance data
- Quick overview of student performance

#### 🎓 Student Dashboard
- Personal attendance history and statistics
- Self-service attendance marking
- Visual representation of attendance performance
- AI-generated personalized insights and recommendations

## 🛠️ Technologies Used

### Frontend Framework
- **React 19.2.4**: Modern UI library with latest features
- **TypeScript 5.8.2**: Type-safe development experience
- **Vite 6.2.0**: Fast build tool and development server

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework via CDN
- **Lucide React**: Beautiful icon library
- **Inter Font**: Clean, modern typography

### Data Visualization
- **Recharts 3.7.0**: Composable charting library built on React components

### AI Integration
- **Google Gemini AI**: Advanced AI for generating attendance insights and recommendations

### Development Tools
- **Vite Plugin React**: Fast refresh and optimized builds
- **TypeScript ESNext**: Latest JavaScript features with type safety

### Demo Credentials

The application comes with mock authentication. Use these credentials to test different roles:

**Admin Account:**
- Email: `admin@attendviz.com`
- Role: Full system access and management

**Teacher Account:**
- Email: `teacher@attendviz.com`
- Role: View class data and AI insights

**Student Account:**
- Email: `student@attendviz.com`
- Role: Personal attendance tracking and marking

## 📁 Project Structure

```
Digital-Attendance-Visualization-Portal/
├── components/              # React components
│   ├── AdminDashboard.tsx   # Admin role dashboard
│   ├── TeacherDashboard.tsx # Teacher role dashboard
│   ├── Dashboard.tsx        # Student dashboard with charts
│   ├── Login.tsx            # Authentication component
│   ├── Layout.tsx           # Main layout wrapper
│   ├── AttendanceList.tsx   # Attendance records list view
│   ├── MarkAttendance.tsx   # Self-service attendance marking
│   ├── AttendanceManagement.tsx # Admin attendance management
│   └── AIInsights.tsx       # AI-powered insights component
├── context/                 # React context providers
│   └── AuthContext.tsx      # Authentication state management
├── services/                # Service layer
│   ├── mockBackend.ts       # Mock data and API simulation
│   └── geminiService.ts     # Google Gemini AI integration
├── App.tsx                  # Main application component
├── types.ts                 # TypeScript type definitions
├── index.tsx                # Application entry point
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Project dependencies
└── README.md                # Project documentation
```

## 🔐 User Roles & Permissions

| Role    | View Own Data | View All Data | Mark Attendance | Manage Users | AI Insights |
|---------|--------------|---------------|-----------------|--------------|-------------|
| Student | ✅           | ❌            | ✅              | ❌           | ✅          |
| Teacher | ✅           | ✅            | ❌              | ❌           | ✅          |
| Admin   | ✅           | ✅            | ✅              | ✅           | ✅          |

## 🎨 Key Components

### Attendance Status Types
- **Present**: Regular attendance
- **Absent**: No attendance recorded
- **Late**: Arrived after scheduled time
- **Excused**: Approved absence

### Dashboard Features
- Real-time statistics cards
- Interactive pie charts for status distribution
- Bar charts for comparative analysis
- Line charts for trend visualization
- AI-generated personalized recommendations

## 👨‍💻 Author

**Varun Vikash**
- GitHub: [@Varun-Vikash](https://github.com/Varun-Vikash)
