import { useState, useEffect } from 'react';
import { Toast, ToastContainer } from '../bootstrap';

export const VizToast = ({
  title,
  delay,
  autohide,
  onClose,
  closeButton = false,
  isWarning = false,
  children,
}) => {
  const [count, setCount] = useState(delay ? delay / 1000 : null);

  // Tell the user how long until the toast hides
  useEffect(() => {
    if (!delay) return;
    const timer = setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [delay]);

  return (
    <ToastContainer className="p-3" position="top-center" style={{ zIndex: 1 }}>
      <Toast
        className={isWarning ? 'bg-warning' : ''}
        delay={delay}
        autohide={autohide}
        onClose={onClose}
      >
        <Toast.Header closeButton={closeButton}>
          <strong className="me-auto">{title}</strong>
          {delay ? <small>hiding in {count}</small> : null}
        </Toast.Header>
        <Toast.Body>{children}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};
