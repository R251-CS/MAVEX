import React from 'react';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  iconPosition = 'start',
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`mx-btn mx-btn--${variant} mx-btn--${size} ${isLoading ? 'mx-btn--loading' : ''} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="mx-spinner" aria-hidden="true" />
      ) : (
        <>
          {Icon && iconPosition === 'start' && <Icon size={size === 'sm' ? 16 : 18} className="mx-btn-icon" />}
          <span>{children}</span>
          {Icon && iconPosition === 'end' && <Icon size={size === 'sm' ? 16 : 18} className="mx-btn-icon" />}
        </>
      )}
    </button>
  );
};
