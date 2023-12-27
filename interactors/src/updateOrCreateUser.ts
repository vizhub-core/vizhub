import { Result, Success, ok } from 'gateways';
import { User, UserId } from 'entities';
import { a } from 'vitest/dist/suite-dF4WyktM';

// findOrCreateUser
//
// * This is for when a user logs in.
//
// * The task at hand: given data from Auth0, find the
//   User that corresponds to that profile data,
//   or create a new user if no matching user exists.
//
// * When finding an existing user, their profile data
//   is updated based on the latest login data.
//
// * See also
//   https://github.com/vizhub-core/vizhub/blob/main/vizhub-v3/vizhub-interactors/src/FindOrCreateUser.ts
export const UpdateOrCreateUser =
  (gateways) =>
  async (options: {
    id: UserId;
    userName: string;
    displayName: string;
    email: string;
    picture: string;
  }): Promise<Result<Success>> => {
    const { id, userName, displayName, email, picture } =
      options;
    const { saveUser, getUser, lock } = gateways;

    return await lock([userLock(id)], async () => {
      // Attempt to find an existing user with those emails.
      const result = await getUser(id);

      // This user will be either an existing user or a newly created user.
      let user: User;

      // If we found one, great, use that one.
      if (result.outcome === 'success') {
        user = result.value.data;

        // Update the latest upstream profile data for the existing user
        user.displayName = displayName;
        user.primaryEmail = email;
        user.picture = picture;
      } else {
        // If we didn't find an existing user,
        // create a brand new one.
        user = {
          id,
          primaryEmail: email,
          secondaryEmails: [],
          userName,
          displayName,
          picture,
          plan: 'free',
        };
      }

      // Save the updated or newly created user.
      await saveUser(user);

      return ok('success');
    });
  };
