import React from 'react';

export const Skeleton = ({
  width = '100%',
  height = '1rem',
  borderRadius = 'var(--radius-sm)',
  className = '',
  circle = false,
  style = {}
}) => {
  return (
    <div
      className={`mx-skeleton ${circle ? 'mx-skeleton--circle' : ''} ${className}`}
      style={{
        width: circle ? height : width,
        height,
        borderRadius: circle ? '50%' : borderRadius,
        ...style
      }}
      aria-hidden="true"
    />
  );
};
