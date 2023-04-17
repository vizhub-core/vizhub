import { Gateways, Result, ok, err } from 'gateways';
import {
  Info,
  Folder,
  UserId,
  ResourceId,
  PUBLIC,
  EDITOR,
  ADMIN,
  Action,
  READ,
  WRITE,
  DELETE,
} from 'entities';

// VerifyAccess
// * Determines whether or not a given user is allowed to perform
//   a given action on a given resource.
// * Used
export const VerifyAccess = async (options: {
  userId: UserId;
  resource: Info | Folder;
  parentFolder?: Folder;
  action: Action;
}): Promise<Result<boolean>> => {
  const { userId, resource, action, parentFolder } = options;
};
