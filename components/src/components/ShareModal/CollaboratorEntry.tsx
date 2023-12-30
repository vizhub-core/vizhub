import { useCallback } from 'react';
import { Button, Form } from '../bootstrap';
import { User, UserId } from 'entities';

export const CollaboratorEntry = ({
  collaborator,
  removeCollaborator,
}: {
  collaborator: User;
  removeCollaborator: (userId: UserId) => Promise<void>;
}) => {
  const handleRemoveClick = useCallback(() => {
    removeCollaborator(collaborator.id);
  }, [collaborator.id]);

  return (
    <div className="collaborator-entry mb-2">
      <Form.Control as="div">
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
        {collaborator.displayName || collaborator.userName}
      </Form.Control>
      <Button
        variant="secondary"
        onClick={handleRemoveClick}
      >
        Remove
      </Button>
    </div>
  );
};
