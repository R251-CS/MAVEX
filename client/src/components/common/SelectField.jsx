import React from 'react';
import { ChevronDown } from 'lucide-react';

export const SelectField = ({
  label,
  id,
  value,
  onChange,
  options = [],
  placeholder = 'اختر...',
  error = '',
  helperText = '',
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`mx-form-group ${error ? 'mx-form-group--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={selectId} className="mx-label">
          {label} {required && <span className="mx-required">*</span>}
        </label>
      )}
      <div className="mx-select-wrapper">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className="mx-select"
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={18} className="mx-select-arrow" />
      </div>
      {error ? (
        <span className="mx-field-error">{error}</span>
      ) : helperText ? (
        <span className="mx-field-helper">{helperText}</span>
      ) : null}
    </div>
  );
};
