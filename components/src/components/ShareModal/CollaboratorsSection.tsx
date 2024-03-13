import { useCallback, useState } from 'react';
import { Form } from '../bootstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { Plan, User, UserId } from 'entities';
import { CollaboratorEntry } from './CollaboratorEntry';
import { UpgradeCallout } from '../UpgradeCallout';
import { image } from '../image';

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
  handleCollaboratorRemove,
  showAnyoneCanEdit,
  initialCollaborators,
  // currentPlan,
  // enableFreeTrial,
}: {
  anyoneCanEdit: boolean;
  setAnyoneCanEdit: (anyoneCanEdit: boolean) => void;
  handleCollaboratorSearch: (
    query: string,
  ) => Promise<Array<User>>;
  handleCollaboratorAdd: (user: User) => Promise<'success'>;
  handleCollaboratorRemove: (
    userId: UserId,
  ) => Promise<'success'>;
  showAnyoneCanEdit: boolean;
  initialCollaborators: Array<User>;
  // currentPlan: Plan;
  // enableFreeTrial: boolean;
}) => {
  // True when the async handleCollaboratorSearch is in progress
  const [isLoading, setIsLoading] = useState(false);

  // The list of users to show in the typeahead
  const [options, setOptions] = useState<Array<User>>([]);

  // The collaborators on this viz
  // TODO consider using a ShareDB query instead,
  // so that we get real-time updates
  const [collaborators, setCollaborators] = useState<
    Array<User>
  >(initialCollaborators);

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

  const removeCollaborator = useCallback(
    async (userId: UserId) => {
      // Remove the collaborator from the client-side list
      setCollaborators((collaborators) =>
        collaborators.filter(
          (collaborator) => collaborator.id !== userId,
        ),
      );

      // Remove the permission in the database
      // Add the permission in the database
      await handleCollaboratorRemove(userId);
    },
    [setCollaborators, handleCollaboratorRemove],
  );

  return (
    <>
      {/* {currentPlan === 'free' && (
        <UpgradeCallout
          enableFreeTrial={enableFreeTrial}
          featureId="real-time-collaborators"
          imageSrc={image('real-time-collaboration')}
          isVertical={true}
          topMargin={true}
        >
          Break down barriers to collaboration. Share your
          projects with an unlimited number of real-time
          collaborators for a truly integrated team
          experience. Edit code together in an integrated
          multiplayer experience. This feature is only
          available with VizHub Premium.
          <p>
            <a
              href="https://vizhub.com/forum/t/real-time-collaborators/976"
              target="_blank"
              rel="noreferrer"
            >
              Learn more about real-time collaboration
            </a>
          </p>
        </UpgradeCallout>

        // <div className="mt-3 d-flex flex-column align-items-end">
        //   Add collaborators to invite others to edit your
        //   viz with you in real-time. This feature is only
        //   available on VizHub Premium.
        //   <Button
        //     href="/pricing"
        //     className="mt-3"
        //     target="_blank"
        //     rel="noopener noreferrer"
        //   >
        //     Upgrade
        //   </Button>
        // </div>
      )} */}
      <Form.Group
      // className={
      //   currentPlan === 'free'
      //     ? 'disabled-form-group'
      //     : ''
      // }
      >
        <Form.Group
          className="mb-3 mt-3"
          controlId="collaboratorsControl"
        >
          <Form.Label>Manage Collaborators</Form.Label>
          {collaborators?.length > 0 && (
            <Form.Group className="mb-3">
              {collaborators.map((collaborator) => (
                <CollaboratorEntry
                  key={collaborator.id}
                  collaborator={collaborator}
                  removeCollaborator={removeCollaborator}
                />
              ))}
            </Form.Group>
          )}
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
            selected={[]}
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
              If you check this box, anyone with the link
              can edit this viz.
            </Form.Text>
          </Form.Group>
        )}
      </Form.Group>
    </>
  );
};
