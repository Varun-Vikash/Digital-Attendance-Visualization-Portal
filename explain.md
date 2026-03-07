# 🎓 How AttendViz Works: A Beginner-Friendly Guide

Welcome! If you're new to coding, this guide will help you understand how this application is put together. It's like building a digital house where the **Frontend** is the interior design and the **Backend** is the hidden plumbing and foundation.

---

## 🎨 The Frontend (The Face)
Located in the `frontend/` folder, this is what the user sees and interacts with.

### 1. **React & Components**
- **What it is:** A library for building user interfaces.
- **How it works:** We break the UI into "Components." For example, the `Login` screen, the `Dashboard`, and the `AttendanceList` are all separate files in `frontend/components/`. This makes it easy to reuse and manage the code.

### 2. **Context (AuthContext)**
- **What it is:** A way to share information across many components.
- **How it works:** We use `AuthContext.tsx` to remember if a user is logged in. This way, every page "knows" who the user is without having to ask them to log in again.

### 3. **Services (The Messenger)**
- **What it is:** The code that talks to the backend.
- **How it works:** In `frontend/services/api.ts`, we write functions that "fetch" data from the backend. When you click "Mark Attendance," this service sends a message to the backend saying, "Hey, please record this!"

---

## ⚙️ The Backend (The Brain)
Located in the `backend/` folder, this part runs on a server and manages all the data.

### 1. **Node.js & Express**
- **What it is:** The engine and the framework.
- **How it works:** `index.js` is the entry point. It sets up "routes" (like `/api/login` or `/api/attendance`). When the frontend sends a request to one of these routes, Express decides what to do.

### 2. **SQLite (The Memory)**
- **What it is:** A lightweight database.
- **How it works:** All the users and attendance records are stored in `database.sqlite`. It’s like a digital spreadsheet that the backend can read from and write to very quickly.

### 3. **Authentication (Security)**
- **What it is:** Making sure only the right people can see the right data.
- **How it works:** We use **JWT (JSON Web Tokens)**. When you log in, the backend gives you a "digital badge" (the token). The frontend shows this badge every time it asks for data, proving that the user is who they say they are.

---

## 🔗 The API (The Bridge)
API stands for **Application Programming Interface**. Think of it as a waiter in a restaurant.

1. **The Order (Request):** The Frontend (customer) asks for attendance data.
2. **The Waiter (API):** The request goes to a specific URL (like `http://localhost:5000/api/attendance`).
3. **The Kitchen (Backend):** The Backend gets the data from the database and prepares it.
4. **The Delivery (Response):** The API brings the data back to the Frontend in a format called **JSON** (which looks like a list of items).

### Example JSON:
```json
{
  "id": "user1-2026-03-07",
  "userName": "John Doe",
  "status": "Present",
  "date": "2026-03-07"
}
```

---

## 🚀 Summary
- **Frontend:** Shows buttons and charts (React).
- **Backend:** Manages data and security (Node/Express).
- **Database:** Stores all the info permanently (SQLite).
- **API:** The bridge that connects them.

Happy Coding! 🚀
