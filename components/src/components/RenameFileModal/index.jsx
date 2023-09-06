import {
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { Modal, Form, Button } from '../bootstrap';

export const RenameFileModal = ({
  show,
  onClose,
  onRename,
  initialFileName,
}) => {
  const [newName, setNewName] = useState(initialFileName);
  const inputRef = useRef(null);

  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus();
    }
  }, [show]);

  const handleNameChange = useCallback((event) => {
    setNewName(event.target.value);
  }, []);

  const handleRenameClick = useCallback(() => {
    onRename(newName);
  }, [newName, onRename]);

  const handleKeyDown = useCallback(
    (e) => {
      if (
        e.key === 'Enter' &&
        (e.ctrlKey ||
          e.shiftKey ||
          (!e.altKey && !e.metaKey))
      ) {
        handleRenameClick();
      }
    },
    [handleRenameClick],
  );

  return show ? (
    <Modal
      show={show}
      onHide={onClose}
      animation={false}
      onKeyDown={handleKeyDown}
    >
      <Modal.Header closeButton>
        <Modal.Title>Rename File</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3" controlId="fileName">
          <Form.Label>File Name</Form.Label>
          <Form.Control
            type="text"
            value={newName}
            onChange={handleNameChange}
            ref={inputRef}
            spellCheck="false"
          />
          <Form.Text className="text-muted">
            Enter the new name for your file
          </Form.Text>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={handleRenameClick}
        >
          Rename
        </Button>
      </Modal.Footer>
    </Modal>
  ) : null;
};

// import {
//   useState,
//   useCallback,
//   useRef,
//   useEffect,
// } from 'react';
// import { Modal, Form, Button } from '../bootstrap';

// export const RenameFileModal = ({
//   show,
//   onClose,
//   onRename,
//   initialFileName,
// }) => {
//   const [newName, setNewName] = useState(initialFileName);

//   const inputRef = useRef(null); // Create a reference for the input field

//   useEffect(() => {
//     if (show && inputRef.current) {
//       inputRef.current.focus(); // Focus on the input field when modal is shown
//     }
//   }, [show]);

//   const handleNameChange = useCallback((event) => {
//     setNewName(event.target.value);
//   }, []);

//   const handleRenameClick = useCallback(() => {
//     onRename(newName);
//   }, [newName, onRename]);

//   return show ? (
//     <Modal show={show} onHide={onClose} animation={false}>
//       <Modal.Header closeButton>
//         <Modal.Title>Rename File</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form.Group className="mb-3" controlId="fileName">
//           <Form.Label>File Name</Form.Label>
//           <Form.Control
//             type="text"
//             value={newName}
//             onChange={handleNameChange}
//             ref={inputRef} // Assign the created ref to the input field
//           />
//           <Form.Text className="text-muted">
//             Enter the new name for your file
//           </Form.Text>
//         </Form.Group>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button
//           variant="primary"
//           onClick={handleRenameClick}
//         >
//           Rename
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   ) : null;
// };

// import { useState, useCallback } from 'react';
// import { Modal, Form, Button } from '../bootstrap';

// export const RenameFileModal = ({
//   show,
//   onClose,
//   onRename,
//   initialFileName,
// }) => {
//   const [newName, setNewName] = useState(initialFileName);

//   const handleNameChange = useCallback((event) => {
//     setNewName(event.target.value);
//   }, []);

//   const handleRenameClick = useCallback(() => {
//     onRename(newName);
//   }, [newName, onRename]);

//   return show ? (
//     <Modal show={show} onHide={onClose} animation={false}>
//       <Modal.Header closeButton>
//         <Modal.Title>Rename File</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form.Group className="mb-3" controlId="fileName">
//           <Form.Label>File Name</Form.Label>
//           <Form.Control
//             type="text"
//             value={newName}
//             onChange={handleNameChange}
//           />
//           <Form.Text className="text-muted">
//             Enter the new name for your file
//           </Form.Text>
//         </Form.Group>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button
//           variant="primary"
//           onClick={handleRenameClick}
//         >
//           Rename
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   ) : null;
// };

// import { useState, useCallback } from 'react';
// import { Modal, Form, Button } from '../bootstrap';
// import { VisibilityControl } from '../VisibilityControl';
// import { OwnerControl } from '../OwnerControl';

// export const ForkModal = ({
//   show,
//   onClose,
//   onFork,
//   initialTitle,
//   initialVisibility,
//   initialOwner,
//   possibleOwners,
//   currentPlan,
//   pricingHref,
// }) => {
//   const [title, setTitle] = useState(initialTitle);
//   const [visibility, setVisibility] = useState(
//     initialVisibility,
//   );
//   const [owner, setOwner] = useState(initialOwner);

//   const handleTitleChange = useCallback((event) => {
//     setTitle(event.target.value);
//   }, []);

//   const handleForkClick = useCallback(() => {
//     onFork({ title, visibility, owner });
//   }, [title, visibility, owner, onFork]);

//   return show ? (
//     <Modal show={show} onHide={onClose} animation={false}>
//       <Modal.Header closeButton>
//         <Modal.Title>Fork</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form.Group className="mb-3" controlId="title">
//           <Form.Label>Title</Form.Label>
//           <Form.Control
//             type="text"
//             value={title}
//             onChange={handleTitleChange}
//           />
//           <Form.Text className="text-muted">
//             Choose a title for your viz
//           </Form.Text>
//         </Form.Group>
//         <VisibilityControl
//           visibility={visibility}
//           setVisibility={setVisibility}
//           currentPlan={currentPlan}
//           pricingHref={pricingHref}
//         />
//         <OwnerControl
//           owner={owner}
//           setOwner={setOwner}
//           possibleOwners={possibleOwners}
//         />
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="primary" onClick={handleForkClick}>
//           Fork
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   ) : null;
// };
