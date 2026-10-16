import React from 'react';

/**
 * MavexLogo - الشعار الرسمي المعتمد لشركة MAVEX Metals
 * يستخدم الصور المعتمدة (favicon1.svg / logo1.svg)
 */
export const MavexLogo = ({
  size = 38,
  className = '',
  style = {}
}) => {
  const imageSrc = '/logo.svg?v=20261016';

  return (
    <div
      className={`mx-logo-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
    >
      <img
        src={imageSrc}
        alt="MAVEX Metals"
        className="mx-logo-image"
        style={{
          height: typeof size === 'number' ? `${size}px` : size,
          width: 'auto',
          maxWidth: '100%',
          objectFit: 'contain',
          display: 'block'
        }}
        loading="eager"
      />
    </div>
  );
};
