import { writeFileSync, readFileSync } from 'fs';
import { User, UserId } from 'entities';
import { Gateways, Result, Success, ok } from 'gateways';
import { Collection, Document } from 'mongodb-legacy';
import { assert } from 'vitest';

export const migrateUserIfNeeded = async ({
  userId,
  gateways,
  v2UserCollection,
  generateFixtures,
  useFixtures,
}: {
  userId: UserId;
  gateways: Gateways;
  v2UserCollection: Collection<Document>;
  generateFixtures: boolean;
  useFixtures: boolean;
}): Promise<Result<Success>> => {
  // Check if user was already migrated.
  // If so, don't migrate again.
  const userV3Result = await gateways.getUser(userId);
  const userAlreadyMigrated =
    userV3Result.outcome === 'success';
  if (userAlreadyMigrated) {
    // console.log(`    User ${userId} already migrated, skipping migration`);
    process.stdout.write('-');
    return ok('success');
  } else {
    // console.log(`    User ${userId} not yet migrated, migrating now`);
    process.stdout.write('+');
  }

  interface UserV2 {
    _id: string;
    id: string;
    userName: string;
    fullName: string;
    email: string;
    avatarUrl: string;
    company: string;
    website: string;
    location: string;
    bio: string;
    plan: string;
    _type: string;
    _v: number;
    _m: {
      ctime: number;
      mtime: number;
    };
    _o: string;
  }

  const userV2: UserV2 = useFixtures
    ? (JSON.parse(
        readFileSync(
          `./v2Fixtures/userV2-${userId}.json`,
          'utf8',
        ),
      ) as UserV2)
    : ((await v2UserCollection.findOne({
        id: userId,
      })) as unknown as UserV2);

  if (generateFixtures) {
    const fileName = `./v2Fixtures/userV2-${userV2.id}.json`;
    writeFileSync(
      fileName,
      JSON.stringify(userV2, null, 2),
    );
  }

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
    console.log(
      `User ${userId} not found, skipping migration`,
    );
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

  // console.log(
  //   `    Migrating user ${userV3.userName} (${userV3.displayName} from ${userV3.location} - ${userV3.bio})`
  // );

  //}) to v3`);
  // console.log(JSON.stringify(userV3, null, 2));

  return await gateways.saveUser(userV3);
};
