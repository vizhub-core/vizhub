import { User, UserId } from 'entities';
import { Gateways } from 'gateways';
import { Collection, Document } from 'mongodb-legacy';

export const migrateUserIfNeeded = async ({
  userId,
  gateways,
  userCollection,
}: {
  userId: UserId;
  gateways: Gateways;
  userCollection: Collection<Document>;
}) => {
  // Check if user was already migrated.
  // If so, don't migrate again.
  const userV3Result = await gateways.getUser(userId);
  const userAlreadyMigrated = userV3Result.outcome === 'success';
  if (userAlreadyMigrated) {
    console.log(`    User ${userId} already migrated, skipping migration`);
    return;
  } else {
    console.log(`    User ${userId} not yet migrated, migrating now`);
  }

  const userV2 = await userCollection.findOne({ id: userId });

  // console.log(userV2);
  // Example userV2:
  // {
  //   _id: '68416',
  //   id: '68416',
  //   userName: 'curran',
  //   fullName: 'Curran Kelleher',
  //   email: 'curran.kelleher@gmail.com',
  //   avatarUrl: 'https://avatars.githubusercontent.com/u/68416?v=4',
  //   company: null,
  //   website: 'https://vizhub.com/curran',
  //   location: 'Remote',
  //   bio: 'Fascinated by visual presentation of data as a means to understand the world better and communicate that understanding to others.',
  //   plan: 'pro',
  //   _type: 'http://sharejs.org/types/JSONv0',
  //   _v: 175,
  //   _m: { ctime: 1534246600234, mtime: 1687030882380 },
  //   _o: new ObjectId("648e0c62f00f70673b601164")
  // }
  if (!userV2) {
    console.log(`User ${userId} not found, skipping migration`);
    process.exit(0);
  }

  // Sample v3 user:
  // {
  //   id: '68416',
  //   userName: 'curran',
  //   displayName: 'Curran Kelleher',
  //   primaryEmail: 'curran.kelleher@gmail.com',
  //   secondaryEmails: [],
  //   picture: 'https://avatars.githubusercontent.com/u/68416?v=4',
  //   plan: 'pro',
  //   company: null,
  //   website: 'https://vizhub.com/curran',
  //   location: 'Remote',
  //   bio: 'Fascinated by visual presentation of data as a means to understand the world better and communicate that understanding to others.',
  //   migratedFromV2: true
  // }

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

  console.log(`    Migrating user ${userId} to v3`);
  console.log(JSON.stringify(userV3, null, 2));

  await gateways.saveUser(userV3);
};
