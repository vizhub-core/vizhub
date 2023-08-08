import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

export const VizToast = ({ title, children }) => {
  return (
    <ToastContainer className="p-3" position="top-center" style={{ zIndex: 1 }}>
      <Toast className="bg-warning">
        <Toast.Header closeButton={false}>
          <strong className="me-auto">{title}</strong>
          {/* <small>11 mins ago</small> */}
        </Toast.Header>

        <Toast.Body>{children}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};
