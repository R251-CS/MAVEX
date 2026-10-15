import React from 'react';

export const KpiSlider = ({
  label,
  value = 0,
  onChange = null,
  min = 0,
  max = 100,
  step = 1,
  readOnly = false,
  unit = '%',
  color = null // 'blue' | 'green' | 'amber' | 'purple' | 'red'
}) => {
  const numericValue = Number(value) || 0;
  const percentage = Math.min(Math.max(((numericValue - min) / (max - min)) * 100, 0), 100);

  // Dynamic color based on percentage if not explicitly provided
  const activeColor = color
    ? `var(--accent-${color})`
    : percentage >= 80
    ? 'var(--accent-green)'
    : percentage >= 50
    ? 'var(--accent-blue)'
    : percentage >= 30
    ? 'var(--accent-amber)'
    : 'var(--accent-red)';

  return (
    <div className="mx-kpi-slider">
      <div className="mx-kpi-slider__header">
        <span className="mx-kpi-slider__label">{label}</span>
        <span className="mx-kpi-slider__val" style={{ color: activeColor }}>
          {numericValue}{unit}
        </span>
      </div>

      <div className="mx-kpi-slider__track-container">
        <div className="mx-kpi-slider__track">
          <div
            className="mx-kpi-slider__fill"
            style={{
              width: `${percentage}%`,
              backgroundColor: activeColor,
              boxShadow: `0 0 10px ${activeColor}66`
            }}
          />
        </div>

        {!readOnly && (
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={numericValue}
            onChange={(e) => onChange && onChange(Number(e.target.value))}
            className="mx-kpi-slider__input"
            aria-label={label}
          />
        )}
      </div>
    </div>
  );
};
