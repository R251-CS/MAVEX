import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'لا توجد بيانات متاحة',
  description = 'لم يتم تسجيل أي سجلات أو عمليات في هذه الفترة.',
  actionLabel = null,
  onAction = null,
  className = ''
}) => {
  return (
    <div className={`mx-empty-state ${className}`}>
      <div className="mx-empty-state__icon-wrapper">
        <Icon size={36} className="mx-empty-state__icon" />
      </div>
      <h4 className="mx-empty-state__title">{title}</h4>
      <p className="mx-empty-state__description">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction} className="mx-empty-state__btn">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
