import { useCallback, useState } from 'react';
import { Button, Form, InputGroup } from '../bootstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { User } from 'entities';

// Inspired by
// https://ericgio.github.io/react-bootstrap-typeahead/#asynchronous-searching

// Bypass client-side filtering by returning `true`. Results are already
// filtered by the search endpoint, so no need to do it again.
const filterBy = () => true;

export const CollaboratorsSection = ({
  anyoneCanEdit,
  setAnyoneCanEdit,
  handleCollaboratorSearch,
  showAnyoneCanEdit,
}: {
  anyoneCanEdit: boolean;
  setAnyoneCanEdit: (anyoneCanEdit: boolean) => void;
  handleCollaboratorSearch: (
    query: string,
  ) => Promise<User[]>;
  showAnyoneCanEdit: boolean;
}) => {
  // True when the async handleCollaboratorSearch is in progress
  const [isLoading, setIsLoading] = useState(false);

  // The list of users to show in the typeahead
  const [options, setOptions] = useState<User[]>([]);

  // The selected user
  const [selection, setSelection] = useState<User[]>([]);

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
    (selected: User[]) => {
      setSelection(selected);
    },
    [setSelection],
  );

  // When the user clicks the "Add" button
  const handleAddCollaborator = useCallback(() => {
    console.log('handleAddCollaborator');
    console.log('selection', selection);
  }, [selection]);

  return (
    <>
      <Form.Group
        className="mb-3 mt-3"
        controlId="collaboratorsControl"
      >
        <Form.Label>Manage Collaborators</Form.Label>
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
