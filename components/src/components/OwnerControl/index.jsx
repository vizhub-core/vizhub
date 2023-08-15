import { useMemo } from 'react';
import { Form, Dropdown } from '../bootstrap';

export const OwnerControl = ({
  owner,
  setOwner,
  possibleOwners,
}) => {
  // Possible owners that are not the current owner.
  const otherPossibleOwners = useMemo(
    () =>
      possibleOwners.filter(({ id }) => id !== owner.id),
    [possibleOwners, owner],
  );

  // Used for looking up a possible owner by id.
  const ownersById = useMemo(
    () =>
      new Map(
        possibleOwners.map((possibleOwner) => [
          possibleOwner.id,
          possibleOwner,
        ]),
      ),
    [possibleOwners],
  );

  return (
    <Form.Group controlId="owner">
      <Form.Label>Owner</Form.Label>
      <Dropdown onSelect={setOwner} className="mb-1">
        <Dropdown.Toggle id="dropdown-owner">
          {ownersById.get(owner)?.label}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {otherPossibleOwners.map((possibleOwner) => (
            <Dropdown.Item
              key={possibleOwner.id}
              eventKey={possibleOwner.id}
            >
              {possibleOwner.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <Form.Text className="text-muted">
        Select which account will own the new viz.
      </Form.Text>
    </Form.Group>
  );
};
