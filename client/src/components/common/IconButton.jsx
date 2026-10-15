import React from 'react';

export const IconButton = ({
  icon: Icon,
  label,
  variant = 'ghost', // 'ghost' | 'primary' | 'secondary' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  className = '',
  onClick,
  ...props
}) => {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`mx-icon-btn mx-icon-btn--${variant} mx-icon-btn--${size} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />}
    </button>
  );
};
