import { useState, useEffect } from 'react';
import { Toast, ToastContainer } from '../bootstrap';
import './styles.scss';

const enableCountdown = false;

export const VizToast = ({
  title,
  delay,
  autohide,
  onClose,
  closeButton = false,
  isWarning = false,
  children,
  headerOnly = false,
}: {
  title: string;
  delay?: number;
  autohide?: boolean;
  onClose?: () => void;
  closeButton?: boolean;
  isWarning?: boolean;
  children?: React.ReactNode;
  headerOnly?: boolean;
}) => {
  const [count, setCount] = useState(
    delay ? delay / 1000 : null,
  );

  // Tell the user how long until the toast hides
  useEffect(() => {
    if (!delay && !enableCountdown) return;
    const timer = setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [delay]);

  return (
    <ToastContainer
      className="p-3 viz-toast-container"
      position="top-center"
      style={{ zIndex: 1 }}
    >
      <Toast
        className={isWarning ? 'bg-warning' : ''}
        delay={delay}
        autohide={false}
        onClose={onClose}
      >
        <Toast.Header
          closeButton={closeButton}
          className={headerOnly ? 'header-only' : ''}
        >
          <strong className="me-auto">{title}</strong>

          {enableCountdown && delay ? (
            <small>hiding in {count}</small>
          ) : null}
        </Toast.Header>
        {headerOnly ? null : (
          <Toast.Body>{children}</Toast.Body>
        )}
      </Toast>
    </ToastContainer>
  );
};
