import { Result } from 'gateways';
import { Profiles, User, Snapshot } from 'entities';
import { generateId } from './generateId';

// findOrCreateUser
//
// * This is for when a user logs in using a
//   third party authentication provider
//   like GitHub or Google
//
// * The task at hand: given only user profile data
//   from the third party provider, find the VizHub
//   User that corresponds to that profile data,
//   or create a new user if no matching user exists
//
// * When finding an existing user, their profile data
//   is updated based on the latest login, so "finding"
//   also involves updating actually
//
// * See also
//   https://github.com/vizhub-core/vizhub/blob/main/vizhub-v3/vizhub-interactors/src/FindOrCreateUser.ts
export const FindOrCreateUser =
  (gateways) =>
  async (profiles: Profiles): Promise<Result<Snapshot<User>>> => {
    const { getUserByEmails, saveUser, getUser } = gateways;

    // Extract the emails from the profile data.
    const emails = getEmailsFromProfiles(profiles);

    // Attempt to find an existing user with those emails.
    const result = await getUserByEmails(emails);

    // This user will be either an existing user or a newly created user.
    let user: User;

    // If we found one, great, use that one.
    if (result.outcome === 'success') {
      user = result.value.data;

      // Update the latest upstream profile data for the existing user
      user.profiles = { ...user.profiles, ...profiles };
    } else {
      // If we didn't find an existing user,
      // it's time to create a brand new one!
      user = {
        id: generateId(),
        primaryEmail: getPrimaryEmailFromProfiles(profiles),
        secondaryEmails: getSecondaryEmailsFromProfiles(profiles),
        userName: getUserNameFromProfiles(profiles),
        displayName: getDisplayNameFromProfiles(profiles),
        profiles,
      };
    }

    // Save the updated or newly created
    await saveUser(user);

    // Get the user anew so that the Snapshot version is correct
    // and accounts for the latest `saveUser` invocation.
    return await getUser(user.id);
  };

// Gets all emails from profiles
const getEmailsFromProfiles = (profiles: Profiles) =>
  profiles.googleProfileData?.emails?.map(({ value }) => value);

// Gets the primary email from profiles
const getPrimaryEmailFromProfiles = (profiles: Profiles) =>
  profiles.googleProfileData?.emails?.[0]?.value;

// Gets the secondary emails from profiles
const getSecondaryEmailsFromProfiles = (profiles: Profiles) => {
  const emailCount = profiles.googleProfileData?.emails?.length;
  return emailCount > 1
    ? profiles.googleProfileData.emails.slice(1)
    : undefined;
};

// Gets the display name emails from profiles
// TODO make this work for GitHub profile data
const getDisplayNameFromProfiles = (profiles: Profiles) =>
  profiles.googleProfileData?.displayName;

// Finds the userName from profiles.
//  * TODO If githubProfile exists, userName is taken from there.
//  * TODO If twitterProfile exists, userName is taken from there.
//  * If googleProfile exists, userName is generated as a random string.
//    * In this case, the user can choose a username later on.
//      * TODO develop UI/UX the user change their username later on.
const getUserNameFromProfiles = (profiles) => {
  if (profiles.googleProfileData) {
    return generateId();
  } else {
    return 'TODO get userName from GitHub profile data';
  }
};
