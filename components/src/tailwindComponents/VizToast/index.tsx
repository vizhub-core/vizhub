import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export type ToastProps = {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
  isVisible?: boolean;
};

export const VizToast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  isVisible = true,
}) => {
  console.log('VizToast isVisible', isVisible);
  const [visible, setVisible] = useState(isVisible);

  useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      // setVisible(false);
      // if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [visible, duration, onClose]);

  if (!visible) return null;

  const typeStyles = {
    success: 'tw:bg-green-500',
    error: 'tw:bg-red-500',
    info: 'tw:bg-blue-500',
    warning: 'tw:bg-yellow-500',
  };

  return (
    <div className="tw:fixed tw:top-4 tw:right-4 tw:z-50 tw:animate-fade-in">
      <div
        className={`${typeStyles[type]} tw:text-white tw:px-4 tw:py-3 tw:rounded-md tw:shadow-lg tw:flex tw:items-center tw:justify-between tw:min-w-[300px]`}
      >
        <span>{message}</span>
        <button
          onClick={() => {
            // setVisible(false);
            if (onClose) onClose();
          }}
          className="tw:ml-4 tw:p-1 tw:rounded-full hover:tw:bg-white/20 tw:transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
