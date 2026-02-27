import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, UserCheck, UserX } from 'lucide-react';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import { LoadingState, ErrorState, EmptyState } from '../components/UIStates';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard/');
        setData(res.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Daily HR snapshot and employee attendance aggregated stats."
      />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ background: '#EEF2FF', padding: '1rem', borderRadius: '50%', color: 'var(--primary)' }}>
                <Users size={24} />
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Total Employees</p>
                <h3 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>{data.total_employees}</h3>
              </div>
            </div>

            <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ background: '#D1FAE5', padding: '1rem', borderRadius: '50%', color: '#065F46' }}>
                <UserCheck size={24} />
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Present Today</p>
                <h3 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>{data.present_today}</h3>
              </div>
            </div>

            <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ background: '#FEE2E2', padding: '1rem', borderRadius: '50%', color: '#991B1B' }}>
                <UserX size={24} />
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Absent Today</p>
                <h3 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>{data.absent_today}</h3>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LayoutDashboard size={20} color="var(--primary)" /> 
              Total Present Days Per Employee
            </h3>
            
            {data.employee_stats.length === 0 ? (
              <EmptyState icon={Users} message="No employees found." />
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Employee ID</th>
                      <th>Full Name</th>
                      <th>Department</th>
                      <th style={{ textAlign: 'center' }}>Total Days Present</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.employee_stats.map((stat, i) => (
                      <tr key={stat.employee_id} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                        <td style={{ fontWeight: 500 }}>{stat.employee_id}</td>
                        <td>{stat.full_name}</td>
                        <td>{stat.department}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span className="badge badge-success" style={{ padding: '0.35rem 1rem', fontSize: '0.875rem' }}>
                            {stat.total_present}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
