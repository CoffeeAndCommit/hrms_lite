import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0', color: 'var(--primary)' }}>
    <Loader2 className="animate-spin" size={32} />
  </div>
);

export const ErrorState = ({ message }) => (
  <div style={{ background: '#FEF2F2', color: '#991B1B', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
    {message || 'An error occurred.'}
  </div>
);

export const EmptyState = ({ icon: Icon, message }) => (
  <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
    {Icon && <Icon size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />}
    <p>{message || 'No records found.'}</p>
  </div>
);
