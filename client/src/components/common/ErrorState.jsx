import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export const ErrorState = ({
  title = 'حدث خطأ أثناء تحميل البيانات',
  message = 'تعذر الاتصال بالخادم أو جلب المعلومات المطلوبة. يرجى المحاولة مرة أخرى.',
  onRetry = null,
  className = ''
}) => {
  return (
    <div className={`mx-error-state ${className}`}>
      <div className="mx-error-state__icon-wrapper">
        <AlertCircle size={36} className="mx-error-state__icon" />
      </div>
      <h4 className="mx-error-state__title">{title}</h4>
      <p className="mx-error-state__message">{message}</p>
      {onRetry && (
        <Button variant="secondary" icon={RotateCcw} onClick={onRetry} className="mx-error-state__btn">
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
};
