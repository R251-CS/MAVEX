import React from 'react';

export const StatusBadge = ({
  status, // 'success' | 'warning' | 'error' | 'info' | 'neutral'
  children,
  size = 'md', // 'sm' | 'md'
  dot = true,
  className = ''
}) => {
  return (
    <span className={`mx-badge mx-badge--${status} mx-badge--${size} ${className}`}>
      {dot && <span className="mx-badge__dot" />}
      <span className="mx-badge__text">{children}</span>
    </span>
  );
};
