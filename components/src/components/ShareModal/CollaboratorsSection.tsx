import { useCallback, useState } from 'react';
import { Form } from '../bootstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { User } from 'entities';
import { Button } from 'react-bootstrap';

// Inspired by
// https://ericgio.github.io/react-bootstrap-typeahead/#asynchronous-searching

// Bypass client-side filtering by returning `true`. Results are already
// filtered by the search endpoint, so no need to do it again.
const filterBy = () => true;

export const CollaboratorsSection = ({
  anyoneCanEdit,
  setAnyoneCanEdit,
  handleCollaboratorSearch,
  handleCollaboratorAdd,
  showAnyoneCanEdit,
}: {
  anyoneCanEdit: boolean;
  setAnyoneCanEdit: (anyoneCanEdit: boolean) => void;
  handleCollaboratorSearch: (
    query: string,
  ) => Promise<Array<User>>;
  handleCollaboratorAdd: (user: User) => Promise<void>;
  showAnyoneCanEdit: boolean;
}) => {
  // True when the async handleCollaboratorSearch is in progress
  const [isLoading, setIsLoading] = useState(false);

  // The list of users to show in the typeahead
  const [options, setOptions] = useState<Array<User>>([]);

  // The collaborators on this viz
  // TODO:
  //  * Populate this from the server on page load
  //  * Synchronize this to the server when the user adds or removes a collaborator
  const [collaborators, setCollaborators] = useState<
    Array<User>
  >([]);

  const addCollaborator = useCallback(
    (user: User) => {
      setCollaborators((collaborators) => [
        ...collaborators,
        user,
      ]);
    },
    [setCollaborators],
  );

  // When the user checks the "Anyone can edit" checkbox
  const handleCheckboxChange = useCallback(() => {
    setAnyoneCanEdit(!anyoneCanEdit);
  }, [anyoneCanEdit, setAnyoneCanEdit]);

  // When the user types in the search box
  const handleSearch = useCallback(
    async (query: string) => {
      setIsLoading(true);
      setOptions(await handleCollaboratorSearch(query));
      setIsLoading(false);
    },
    [],
  );

  // When the user selects a collaborator
  const handleChange = useCallback(
    async (selectedUsers: Array<User>) => {
      if (selectedUsers.length !== 1) {
        console.error(
          'Expected exactly one user to be selected.',
        );
        return;
      }

      const newCollaborator = selectedUsers[0];

      // Check if new collaborator is already in the list
      const alreadyAdded = collaborators.some(
        (collaborator) =>
          collaborator.userName ===
          newCollaborator.userName,
      );
      if (!alreadyAdded) {
        // Add the user in the client-side list
        addCollaborator(newCollaborator);

        // Add the permission in the database
        await handleCollaboratorAdd(newCollaborator);
      }
    },
    [addCollaborator, collaborators, handleCollaboratorAdd],
  );

  return (
    <>
      <Form.Group
        className="mb-3 mt-3"
        controlId="collaboratorsControl"
      >
        <Form.Label>Manage Collaborators</Form.Label>
        <Form.Group>
          {collaborators.map((collaborator) => (
            <div className="collaborator-entry mb-3">
              <Form.Control
                as="div"
                key={collaborator.userName}
              >
                <img
                  alt={collaborator.userName}
                  src={collaborator.picture}
                  style={{
                    height: '24px',
                    marginRight: '10px',
                    marginTop: '-4px',
                    width: '24px',
                    borderRadius: '50%',
                  }}
                />
                {collaborator.displayName ||
                  collaborator.userName}
              </Form.Control>
              <Button variant="secondary">Remove</Button>
            </div>
          ))}
        </Form.Group>
        <AsyncTypeahead
          filterBy={filterBy}
          className="mb-1"
          id="async-collaborator-search"
          isLoading={isLoading}
          labelKey="userName"
          minLength={2}
          onSearch={handleSearch}
          onChange={handleChange}
          options={options}
          placeholder="Search for a user..."
          renderMenuItemChildren={(user: User) => (
            <>
              <img
                alt={user.userName}
                src={user.picture}
                style={{
                  height: '24px',
                  marginRight: '10px',
                  width: '24px',
                  borderRadius: '50%',
                }}
              />
              <span>
                {user.displayName || user.userName}
              </span>
            </>
          )}
        />
        <Form.Text className="text-muted">
          Start typing to search for collaborators to add.
        </Form.Text>
      </Form.Group>
      {showAnyoneCanEdit && (
        <Form.Group
          className="mb-3 mt-4"
          controlId="anyoneCanEditControl"
        >
          <Form.Label>Allow Anyone to Edit</Form.Label>
          <Form.Check
            className="mb-1"
            type="checkbox"
            label="Anyone can edit"
            checked={anyoneCanEdit}
            onChange={handleCheckboxChange}
          />
          <Form.Text className="text-muted">
            If you check this box, anyone with the link can
            edit this viz.
          </Form.Text>
        </Form.Group>
      )}
    </>
  );
};
