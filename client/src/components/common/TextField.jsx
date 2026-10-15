import React from 'react';

export const TextField = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = '',
  helperText = '',
  required = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  const inputId = id || `field-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`mx-form-group ${error ? 'mx-form-group--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="mx-label">
          {label} {required && <span className="mx-required">*</span>}
        </label>
      )}
      <div className="mx-input-wrapper">
        {Icon && <Icon size={18} className="mx-input-icon" />}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`mx-input ${Icon ? 'mx-input--has-icon' : ''}`}
          {...props}
        />
      </div>
      {error ? (
        <span className="mx-field-error">{error}</span>
      ) : helperText ? (
        <span className="mx-field-helper">{helperText}</span>
      ) : null}
    </div>
  );
};
