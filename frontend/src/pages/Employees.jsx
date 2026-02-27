import { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Loader2, Users } from 'lucide-react';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { LoadingState, ErrorState, EmptyState } from '../components/UIStates';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addingError, setAddingError] = useState('');
  
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: ''
  });

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get('/employees/');
      setEmployees(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch employees. Please check the backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setAddingError('');
    try {
      await api.post('/employees/', formData);
      setIsModalOpen(false);
      setFormData({ employee_id: '', full_name: '', email: '', department: '' });
      fetchEmployees();
    } catch (err) {
      if (err.response && err.response.data) {
        setAddingError(err.response.data.detail || JSON.stringify(err.response.data));
      } else {
        setAddingError('An error occurred while adding the employee.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}/`);
        fetchEmployees();
      } catch (err) {
        alert('Failed to delete employee.');
      }
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Employees"
        description="Manage your workforce and add new members."
        actionButton={
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Add Employee
          </button>
        }
      />

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', background: '#F9FAFB', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.5rem 1rem' }}>
          <Search size={20} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
          <input 
            type="text" 
            placeholder="Search employees by name, ID or department..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontSize: '0.875rem' }}
          />
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : filteredEmployees.length === 0 ? (
          <EmptyState icon={Users} message="No employees found." />
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(emp => (
                  <tr key={emp.id} className="animate-fade-in">
                    <td style={{ fontWeight: 500 }}>{emp.employee_id}</td>
                    <td>{emp.full_name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{emp.email}</td>
                    <td>
                      <span className="badge" style={{ backgroundColor: '#EEF2FF', color: 'var(--primary)' }}>
                        {emp.department}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="btn btn-danger" 
                        style={{ padding: '0.35rem 0.5rem' }}
                        onClick={() => handleDelete(emp.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Employee">
        {addingError && <ErrorState message={addingError} />}

        <form onSubmit={handleAddEmployee}>
          <div className="form-group">
            <label className="form-label">Employee ID</label>
            <input required type="text" name="employee_id" className="form-control" value={formData.employee_id} onChange={handleInputChange} placeholder="E.g., HR-001" />
          </div>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input required type="text" name="full_name" className="form-control" value={formData.full_name} onChange={handleInputChange} placeholder="John Doe" />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input required type="email" name="email" className="form-control" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Department</label>
            <input required type="text" name="department" className="form-control" value={formData.department} onChange={handleInputChange} placeholder="E.g., Engineering, HR..." />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Employee</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Employees;
