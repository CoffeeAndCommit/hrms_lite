# HRMS Lite

A lightweight Human Resource Management System (HRMS) built with React and Django Rest Framework.

## Project Overview
This HRMS Lite application allows an admin to manage employee records and track daily attendance. It focuses on essential HR operations with a clean, professional interface. 

### Features
- **Employee Management:** Add new employees, view list of all employees, delete employees. Search functionality is included.
- **Attendance Management:** Mark attendance (Present/Absent) on a specific date. Filter attendance records by employee and date.

## Tech Stack
- **Frontend:** React, Vite, React Router, Axios, Lucide React (Icons), Vanilla CSS (glassmorphism UI)
- **Backend:** Python, Django, Django REST Framework, Django CORS Headers
- **Database:** SQLite (default for Django, can easily switch to PostgreSQL)

## Steps to Run Locally

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 1. Backend Setup
Navigate to the `backend` directory:
```bash
cd backend
```

Create a virtual environment and activate it:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

Install the required dependencies:
```bash
pip install -r requirements.txt
```

*(Note: Create requirements.txt if not present by running `pip freeze > requirements.txt`)*

Run database migrations:
```bash
python manage.py migrate
```

Start the Django development server:
```bash
python manage.py runserver
```
The backend will run at `http://localhost:8000/`.

### 2. Frontend Setup
Open a new terminal and navigate to the `frontend` directory:
```bash
cd frontend
```

Install the Node modules:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```
The frontend will run at `http://localhost:5173/` (or another port specified by Vite).

## Assumptions / Limitations
- **Single Admin User:** As per the requirements, there is no robust authentication or role-based access control (RBAC). The application assumes a single admin user workflow.
- **Database Choice:** SQLite is used for simplicity and rapid prototyping locally. In a real-world scenario, PostgreSQL is highly recommended to handle concurrent attendance requests securely.
- **Soft Deletes:** Employee deletion is a hard-delete (`CASCADE` effect on attendance). In real systems, "soft deletes" or marking as inactive is preferred to retain historical attendance data.
