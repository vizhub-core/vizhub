import {
  CollaboratorV2,
  InfoV2,
  UpvoteV2,
  UserId,
} from 'entities';

// Gets all the users referenced by a VizV2,
// including the owner, upvoters, and collaborators.
export const getReferencedUsers = (
  infoV2: InfoV2,
): Array<UserId> => {
  const referencedUsers = new Set<UserId>();

  referencedUsers.add(infoV2.owner);

  if (infoV2.upvotes) {
    for (const upvote of infoV2.upvotes) {
      referencedUsers.add(upvote.userId);
    }
  }

  if (infoV2.collaborators) {
    for (const collaborator of infoV2.collaborators) {
      referencedUsers.add(collaborator.userId);
    }
  }

  return Array.from(referencedUsers);
};
