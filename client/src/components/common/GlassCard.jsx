import React from 'react';

export const GlassCard = ({
  children,
  className = '',
  hoverEffect = false,
  glow = null, // 'blue' | 'purple' | 'green' | 'amber' | 'red' | null
  interactive = false,
  onClick,
  ...props
}) => {
  const glowClass = glow ? `mx-glass-card--glow-${glow}` : '';
  const hoverClass = hoverEffect || interactive ? 'mx-glass-card--hover' : '';
  const interactiveClass = interactive ? 'mx-glass-card--interactive' : '';

  return (
    <div
      onClick={onClick}
      className={`mx-glass-card ${hoverClass} ${glowClass} ${interactiveClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
