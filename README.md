# HRMS Lite - Full-Stack Application

A lightweight, production-ready Human Resource Management System (HRMS) built to manage employee records and track daily attendance.

### 🚀 Live Links & Repository
- **Live Frontend Application:** `[Insert Your Vercel URL Here]`
- **Live Backend API:** [https://hrms-lite-1066.onrender.com/api/](https://hrms-lite-1066.onrender.com/api/)
- **GitHub Repository:** [https://github.com/CoffeeAndCommit/hrms_lite](https://github.com/CoffeeAndCommit/hrms_lite)

---

## 📖 Project Overview
This HRMS Lite application acts as an internal portal for a single admin to orchestrate core HR operations. The application fulfills all required criteria and bonus objectives while enforcing a clean, modern, "glassmorphic" UI built on vanilla CSS. 

**Core Features Implemented:**
- **Employee Management:** Add, search, view, and delete employees with strict backend validations for unique IDs and emails.
- **Attendance Tracking:** Mark employees as Present/Absent per day. Duplicate logs for the same employee/date are blocked natively.
- **Bonus Feature (Dashboard):** A dedicated `/dashboard` route visualizes the total number of employees, today's presence counts, and an aggregated table displaying the total present days per employee mapped securely via Django ORM.
- **Bonus Feature (Filtering):** The Attendance screen allows dynamic query-filtering by Date and Employee.

## 💻 Tech Stack
- **Frontend**
  - Framework: React (via Vite)
  - Routing: React Router DOM
  - Styling: Vanilla CSS (Custom Design System, variables, and responsive flex-grids)
  - Icons: `lucide-react`
  - HTTP Client: `axios`
- **Backend**
  - Framework: Python / Django
  - REST API: Django REST Framework (DRF)
  - Database (Local): SQLite3
  - Database (Production): PostgreSQL (via Render) 
  - Utilities: `dj-database-url`, `django-environ`, `django-cors-headers`, `gunicorn`

---

## 🛠️ Steps to Run the Project Locally

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 1. Backend Setup
Navigate into the backend directory:
```bash
cd backend
```
Create a virtual environment and activate it:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```
Install dependencies:
```bash
pip install -r requirements.txt
```
Run database migrations to initialize the local SQLite database:
```bash
python manage.py migrate
```
Start the Django API server:
```bash
python manage.py runserver
```
*The backend API will run at `http://localhost:8000/api/`*

### 2. Frontend Setup
Open a new terminal and navigate into the frontend directory:
```bash
cd frontend
```
Install the Node dependencies:
```bash
npm install
```
*(Development Note: Ensure the `baseURL` in `frontend/src/services/api.js` is set to `http://localhost:8000/api/` rather than the production Render link if developing locally).*

Start the Vite development server:
```bash
npm run dev
```
*The React app will launch at `http://localhost:5173/`*

---

## 📌 Assumptions & Limitations
- **Single Admin Context:** As per requirements, there is no User Registration, Token Authentication (JWT), or Role-Based Access Control (RBAC). The app operates strictly in a trusted admin context.
- **Data Deletion:** Deleting an Employee (`CASCADE`) natively destroys all their associated attendance history logs in PostgreSQL to maintain absolute referential integrity.
- **Timezone Normalization:** Dates passed to the backend are treated as standard `YYYY-MM-DD` strings.
- **Pagination:** Not implemented as this is an HRMS *Lite* intended for smaller subsets of data, allowing standard list rendering to perform well.
