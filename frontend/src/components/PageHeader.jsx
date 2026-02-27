import React from 'react';

const PageHeader = ({ title, description, actionButton }) => {
  return (
    <div className="page-header">
      <div>
        <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>{title}</h1>
        {description && <p style={{ color: 'var(--text-muted)' }}>{description}</p>}
      </div>
      {actionButton && <div>{actionButton}</div>}
    </div>
  );
};

export default PageHeader;
