import React from 'react';

export const PageContainer = ({
  children,
  maxWidth = '1400px',
  className = ''
}) => {
  return (
    <div
      className={`mx-page-container ${className}`}
      style={{ maxWidth }}
    >
      {children}
    </div>
  );
};
