import React, { useState, useCallback } from 'react';
import { Form, InputGroup } from '../bootstrap';

export const CollaboratorsSection = ({}) => {
  // State to manage checkbox value
  const [canEdit, setCanEdit] = useState(false);

  // Handler to change the state when checkbox is clicked, memoized with useCallback
  const handleCheckboxChange = useCallback(() => {
    setCanEdit(!canEdit);
  }, [canEdit, setCanEdit]);

  return (
    <Form.Group
      className="mb-3 mt-3"
      controlId="formShareLink"
    >
      <InputGroup>
        <Form.Check
          type="checkbox"
          label="Anyone can edit"
          checked={canEdit}
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
