import { User, UserId, UserV2 } from 'entities';
import { Gateways } from 'gateways';

// Migrates `referencedUsers` to V3 if they are not already migrated.
export const migrateUsers = async ({
  referencedUsers,
  v2UserCollection,
  gateways,
}: {
  referencedUsers: Array<UserId>;

  // A MongoDB collection for the V2 users.
  v2UserCollection: any;
  gateways: Gateways;
}) => {
  const { saveUser } = gateways;
  for (const userId of referencedUsers) {
    // Check if the user is already migrated.
    // If so, don't migrate again.
    const userV3Result = await gateways.getUser(userId);
    const userAlreadyMigrated =
      userV3Result.outcome === 'success';
    if (userAlreadyMigrated) {
      // console.log(`    User ${userId} already migrated, skipping migration`);
      process.stdout.write('-');
      continue;
    } else {
      // console.log(`    User ${userId} not yet migrated, migrating now`);
      process.stdout.write('+');
    }
    const userV2: UserV2 = await v2UserCollection.findOne({
      _id: userId,
    });
    if (userV2) {
      const userV3: User = {
        id: userV2.id,
        userName: userV2.userName,
        displayName: userV2.fullName,
        primaryEmail: userV2.email,
        secondaryEmails: [],
        picture: userV2.avatarUrl,

        // Everyone starts out as free.
        plan: 'free',

        company: userV2.company,
        website: userV2.website,
        location: userV2.location,
        bio: userV2.bio,
        migratedFromV2: true,
      };

      await saveUser(userV3);
    } else {
      throw new Error(
        `User ${userId} not found in v2UserCollection`,
      );
    }
  }
};
