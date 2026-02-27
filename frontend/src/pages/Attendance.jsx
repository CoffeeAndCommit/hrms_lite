import { useState, useEffect } from 'react';
import { Calendar, UserCheck, Search, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { LoadingState, ErrorState, EmptyState } from '../components/UIStates';

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
        const data = err.response.data;
        const errMsg = data.detail || 
                       data.non_field_errors?.[0] || 
                       data.employee_id?.[0] || 
                       'Validation failed. Ensure employee is selected and no duplicate attendance exists for today.';
        setMarkError(errMsg);
      } else {
        setMarkError('An error occurred while marking attendance.');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Attendance details"
        description="Track daily presence and analyze records."
        actionButton={
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <UserCheck size={18} /> Mark Attendance
          </button>
        }
      />

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
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : attendanceRecords.length === 0 ? (
          <EmptyState icon={Calendar} message="No attendance records found for this date/employee." />
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Mark Attendance">
        {markError && <ErrorState message={markError} />}

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
      </Modal>
    </div>
  );
};

export default Attendance;
