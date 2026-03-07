# 📊 AttendViz - Digital Attendance Visualization Portal

A modern, full-stack attendance management and visualization system. This application provides comprehensive attendance tracking with role-based access control and interactive data visualizations.

![React](https://img.shields.io/badge/React-19.2.4-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6.svg)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933.svg)
![Express](https://img.shields.io/badge/Express-4.x-000000.svg)
![SQLite](https://img.shields.io/badge/SQLite-3.x-003B57.svg)

---

## 📂 Project Structure

The project is divided into two main parts: `frontend` and `backend`.

```text
/
├── frontend/             # React application (UI/UX)
│   ├── components/       # UI components (Dashboards, Lists, etc.)
│   ├── context/          # Authentication context
│   ├── services/         # API service for backend communication
│   ├── App.tsx           # Main application routing
│   └── index.tsx         # Entry point
├── backend/              # Node.js Express server
│   ├── db.js             # Database configuration
│   ├── index.js          # Server routes and logic
│   └── database.sqlite   # SQLite database file
├── README.md             # Project overview (this file)
└── explain.md            # Beginner-friendly guide to how it works
```

---

## ✨ Features

### 🎯 Core Functionality
- **Role-Based Authentication**: Support for Admin, Teacher, and Student roles with tailored dashboards.
- **Interactive Data Visualization**: Beautiful charts and graphs using Recharts.
- **Real-time Attendance Tracking**: Mark and monitor attendance with multiple status types.
- **Comprehensive Statistics**: Detailed analytics on attendance patterns and trends.

### 👥 Role-Specific Dashboards
- **🔑 Admin**: Manage all users, monitor system-wide stats, and oversee attendance.
- **👨‍🏫 Teacher**: Access class attendance data and student performance overviews.
- **🎓 Student**: View personal attendance history, mark self-attendance, and track performance.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons |
| **Backend** | Node.js, Express |
| **Database** | SQLite (File-based) |
| **Auth** | JSON Web Token (JWT) |

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
The backend will run on `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:3000` (or the port shown in your terminal).

---

## 🔐 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@school.edu` | `password` |
| **Teacher** | `sarah@school.edu` | `password` |
| **Student** | `john@student.edu` | `password` |

---

## 📖 Learn More
Check out [explain.md](./explain.md) for a detailed, beginner-friendly explanation of how the frontend and backend work together!
