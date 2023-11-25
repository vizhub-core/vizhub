import { useMemo } from 'react';
import { UserId } from 'entities';
import { Form, Dropdown } from '../bootstrap';

// Allows the user to select an owner from a list of possible owners.
export const OwnerControl = ({
  owner,
  setOwner,
  possibleOwners,
}: {
  owner: UserId;
  setOwner: (owner: UserId) => void;
  possibleOwners: Array<{
    id: UserId;
    label: string;
  }>;
}) => {
  // Possible owners that are not the current owner.
  const otherPossibleOwners = useMemo(
    () => possibleOwners.filter(({ id }) => id !== owner),
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

  // Don't show the owner control if there are no other possible owners.
  return otherPossibleOwners.length === 0 ? null : (
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
        Select which account will own the viz.
      </Form.Text>
    </Form.Group>
  );
};
