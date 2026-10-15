import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '550px',
  footer = null
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="mx-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        ref={modalRef}
        className="mx-modal"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-modal__header">
          <h3 className="mx-modal__title">{title}</h3>
          <IconButton icon={X} label="إغلاق" onClick={onClose} size="sm" />
        </div>

        <div className="mx-modal__body">
          {children}
        </div>

        {footer && (
          <div className="mx-modal__footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
