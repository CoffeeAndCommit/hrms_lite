import { NavLink } from 'react-router-dom';
import { Users, CalendarCheck, LayoutDashboard } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <LayoutDashboard size={24} />
        <span>HRMS Lite</span>
      </div>
      <nav style={{ flex: 1, marginTop: '2rem' }}>
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        <NavLink 
          to="/employees" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <Users size={20} />
          Employees
        </NavLink>
        <NavLink 
          to="/attendance" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <CalendarCheck size={20} />
          Attendance
        </NavLink>
      </nav>
      <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
        &copy; {new Date().getFullYear()} HRMS Lite
      </div>
    </aside>
  );
};

export default Sidebar;
