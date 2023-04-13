// UserId
//  * Unique identifier string for a user.
export type UserId = string;

// Id
// Generic random id.
export type Id = string;

// UserName
//  * String used as the username, e.g. `curran`
//  * From GitHub usernames
//  * Used in URLs like `https://vizhub.com/curran/1b84be14cefa42c08b131f494d48e4af`
export type UserName = string;

// EmailAddress
//  * String that is an email address
export type EmailAddress = string;

// Plan
//  * What level of paying customer this user is.
export type Plan = 'free' | 'pro';

// Not a paying customer.
export const FREE: Plan = 'free';

// A paying customer.
export const PRO: Plan = 'pro';

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

  // picture
  //  * A URL that resolves to a picture of this user.
  picture?: string;

  // plan
  //  * What level of paying customer this user is.
  plan: Plan;
}

// One of these is created
// when a user signs up for the beta program mailing list.
export interface BetaProgramSignup {
  id: Id;
  email: EmailAddress;
}
