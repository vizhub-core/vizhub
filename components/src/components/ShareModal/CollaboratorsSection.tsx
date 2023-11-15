import React, { useCallback } from 'react';
import { Form, InputGroup } from '../bootstrap';

export const CollaboratorsSection = ({
  anyoneCanEdit,
  setAnyoneCanEdit,
}: {
  anyoneCanEdit: boolean;
  setAnyoneCanEdit: (anyoneCanEdit: boolean) => void;
}) => {
  // Handler to change the state when checkbox is clicked, memoized with useCallback
  const handleCheckboxChange = useCallback(() => {
    setAnyoneCanEdit(!anyoneCanEdit);
  }, [anyoneCanEdit, setAnyoneCanEdit]);

  return (
    <Form.Group
      className="mb-3 mt-3"
      controlId="formShareLink"
    >
      <InputGroup>
        <Form.Check
          type="checkbox"
          label="Anyone can edit"
          checked={anyoneCanEdit}
          onChange={handleCheckboxChange}
        />
      </InputGroup>
      <Form.Text className="text-muted">
        If you check this box, anyone with the link can edit
        this viz.
      </Form.Text>
    </Form.Group>
  );
};
