import React, { useState } from 'react';
import { Lock, Unlock, Eye, EyeOff } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';
  const effectiveType = isPasswordField ? (showPassword ? 'text' : 'password') : type;
  const inputId = id || `field-${Math.random().toString(36).substring(2, 9)}`;

  // إذا كان الحقل كلمة مرور، يتم التبديل بين القفل المغلق والمفتوح
  const DisplayIcon = isPasswordField
    ? (showPassword ? Unlock : (Icon || Lock))
    : Icon;

  const handleTogglePassword = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={`mx-form-group ${error ? 'mx-form-group--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="mx-label">
          {label} {required && <span className="mx-required">*</span>}
        </label>
      )}
      <div className="mx-input-wrapper">
        {DisplayIcon && (
          isPasswordField ? (
            <button
              type="button"
              onClick={handleTogglePassword}
              className="mx-input-icon mx-input-icon--clickable"
              title={showPassword ? 'إخفاء كلمة المرور (القفل مفتوح)' : 'إظهار كلمة المرور (اضغط على القفل لعرضها)'}
              aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              tabIndex={0}
            >
              <DisplayIcon size={18} />
            </button>
          ) : (
            <DisplayIcon size={18} className="mx-input-icon" />
          )
        )}
        <input
          id={inputId}
          type={effectiveType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`mx-input ${DisplayIcon ? 'mx-input--has-icon' : ''} ${isPasswordField ? 'mx-input--has-toggle' : ''}`}
          {...props}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="mx-input-toggle-password"
            title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
            aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error ? (
        <span className="mx-field-error">{error}</span>
      ) : helperText ? (
        <span className="mx-field-helper">{helperText}</span>
      ) : null}
    </div>
  );
};
