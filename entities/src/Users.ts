// UserId
//  * Unique identifier string for a user.
export type UserId = string;

// UserName
//  * String used as the username, e.g. `curran`
//  * From GitHub usernames
//  * Used in URLs like `https://vizhub.com/curran/1b84be14cefa42c08b131f494d48e4af`
export type UserName = string;

// EmailAddress
//  * String that is an email address
export type EmailAddress = string;

// Raw unmodified profile data from third party authentication.
export interface Profiles {
  // Raw unmodified profile data from GitHub authentication.
  githubProfileData?: any;

  // Raw unmodified profile data from Google authentication.
  googleProfileData?: any;
}

// User
//  * A representation of a user on the platform
export interface User {
  // The unique ID of this user
  id: UserId;

  // This user's unique user name.
  // Derived from GitHub user name if authenticated via GitHub
  userName: UserName;

  // This user's display name (typically first name, last name)
  displayName: string;

  // This user's primary email address
  primaryEmail: EmailAddress;

  // secondaryEmails
  //  * The secondary email addresses of this user
  //  * These are only emails in addition to primaryEmail
  //  * primaryEmail is not included in this list
  secondaryEmails?: Array<EmailAddress>;

  // Raw unmodified profile data from authentication providers
  profiles?: Profiles;
}
