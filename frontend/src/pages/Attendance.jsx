import { useState, useEffect } from 'react';
import { Calendar, UserCheck, Search, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import api from '../services/api';

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [filterDate, setFilterDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedEmployee, setSelectedEmployee] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [markData, setMarkData] = useState({
    employee_id: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    status: 'Present' // Default to Present
  });
  const [markError, setMarkError] = useState('');

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees/');
      setEmployees(res.data);
    } catch (err) {
      console.error('Failed to fetch employees');
    }
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      let query = `?date=${filterDate}`;
      if (selectedEmployee) {
        query += `&employee_id=${selectedEmployee}`;
      }
      
      const res = await api.get(`/attendances/${query}`);
      setAttendanceRecords(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch attendance records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDate, selectedEmployee]);

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    setMarkError('');
    try {
      await api.post('/attendances/', markData);
      setIsModalOpen(false);
      setMarkData({ employee_id: '', date: format(new Date(), 'yyyy-MM-dd'), status: 'Present' });
      fetchAttendance();
    } catch (err) {
      if (err.response && err.response.data) {
        setMarkError(err.response.data.detail || JSON.stringify(err.response.data));
      } else {
        setMarkError('An error occurred while marking attendance.');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Attendance details</h1>
          <p style={{ color: 'var(--text-muted)' }}>Track daily presence and analyze records.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <UserCheck size={18} /> Mark Attendance
        </button>
      </div>

      <div className="card glass-panel" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Search size={20} color="var(--primary)" /> 
          Filter Records
        </h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label className="form-label">Date</label>
            <input 
              type="date" 
              className="form-control" 
              value={filterDate} 
              onChange={(e) => setFilterDate(e.target.value)} 
            />
          </div>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label className="form-label">Employee</label>
            <select 
              className="form-control" 
              value={selectedEmployee} 
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="">All Employees</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.full_name} ({emp.employee_id})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0', color: 'var(--primary)' }}>
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : error ? (
          <div style={{ background: '#FEF2F2', color: '#991B1B', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            {error}
          </div>
        ) : attendanceRecords.length === 0 ? (
          <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Calendar size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
            <p>No attendance records found for this date/employee.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map(record => (
                  <tr key={record.id} className="animate-fade-in">
                    <td>{record.date}</td>
                    <td style={{ fontWeight: 500 }}>{record.employee_details?.employee_id}</td>
                    <td>{record.employee_details?.full_name}</td>
                    <td>
                      <span className={`badge ${record.status === 'Present' ? 'badge-success' : 'badge-danger'}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Mark Attendance</h2>
            
            {markError && (
              <div style={{ background: '#FEF2F2', color: '#991B1B', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {markError}
              </div>
            )}

            <form onSubmit={handleMarkAttendance}>
              <div className="form-group">
                <label className="form-label">Employee</label>
                <select 
                  required
                  className="form-control"
                  value={markData.employee_id}
                  onChange={(e) => setMarkData({...markData, employee_id: e.target.value})}
                >
                  <option value="" disabled>Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.full_name} ({emp.employee_id})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input 
                  required 
                  type="date" 
                  className="form-control" 
                  value={markData.date} 
                  onChange={(e) => setMarkData({...markData, date: e.target.value})} 
                  max={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="status" 
                      value="Present" 
                      checked={markData.status === 'Present'}
                      onChange={(e) => setMarkData({...markData, status: e.target.value})}
                    />
                    <span className="badge badge-success">Present</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="status" 
                      value="Absent" 
                      checked={markData.status === 'Absent'}
                      onChange={(e) => setMarkData({...markData, status: e.target.value})}
                    />
                    <span className="badge badge-danger">Absent</span>
                  </label>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Attendance</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
