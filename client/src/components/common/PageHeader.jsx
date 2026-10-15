import React from 'react';

export const PageHeader = ({
  title,
  description = '',
  actions = null,
  badge = null,
  className = ''
}) => {
  return (
    <div className={`mx-page-header ${className}`}>
      <div className="mx-page-header__content">
        <div className="mx-page-header__title-row">
          <h1 className="mx-page-header__title">{title}</h1>
          {badge && <div className="mx-page-header__badge">{badge}</div>}
        </div>
        {description && <p className="mx-page-header__description">{description}</p>}
      </div>
      {actions && <div className="mx-page-header__actions">{actions}</div>}
    </div>
  );
};
