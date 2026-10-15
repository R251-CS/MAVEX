import React from 'react';
import { Calendar } from 'lucide-react';

export const MonthPicker = ({
  value,
  onChange,
  className = '',
  disabled = false
}) => {
  return (
    <div className={`mx-month-picker ${className}`}>
      <Calendar size={18} className="mx-month-picker__icon" />
      <input
        type="month"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="mx-month-picker__input"
        aria-label="اختر الشهر والسنة"
      />
    </div>
  );
};
