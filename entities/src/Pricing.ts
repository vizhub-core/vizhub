// Plan
//  * What level of paying customer this user is.
export type Plan = 'free' | 'premium' | 'professional';

// Not a paying customer.
export const FREE: Plan = 'free';

// A paying customer on the premium plan.
export const PREMIUM: Plan = 'premium';

// A paying customer on the professional plan.
export const PRO: Plan = 'professional';

// The number of AI credits a user starts with (in cents).
// Correspones with the `User.creditBalance` field.
export const STARTING_CREDITS: number = 0;

// The number of AI credits a user gets per month on the premium plan.
export const PRO_CREDITS_PER_MONTH: number = 3000;

// The number of AI credits a user gets per month on the free plan.
export const FREE_CREDITS_PER_MONTH: number = 100;

// The number of AI credits a user gets per month on the premium plan.
export const PREMIUM_CREDITS_PER_MONTH: number = 5000;

// The markup on AI transaction fees.
// e.g. if the AI provider's fee is $0.02 for a given transaction,
// then the user's AI credit will be charged $0.03
// if the CREDIT_MARKUP is 1.5.
export const CREDIT_MARKUP: number = 1.1;

// FeatureId is an enum of all the features that are
// highlighted in the pricing page.
export type FeatureId =
  | 'api-access-for-vizzes'
  | 'ai-assisted-coding'
  | 'larger-datasets'
  | 'real-time-collaborators'
  | 'white-label-embedding'
  | 'private-vizzes'
  | 'hot-reloading'
  | 'community-access'
  | 'limited-data-size'
  | 'search'
  | 'public-vizzes'
  | 'free-courses'
  // Org features
  | 'private-org'
  | 'per-editor-pricing'
  // Consultation features
  | 'satisfaction-guarantee'
  | 'visualize-your-data'
  | 'work-through-hard-problems'
  | 'design-interactive-visualizations'
  | 'optimize-performance'
  | 'create-custom-visualizations'
  | 'integrate-visualizations-with-your-platform'
  | 'learn-data-visualization-best-practices'
  | 'money-back-guarantee'
  | 'first-meeting-free'
  | 'augment-your-engineering-team'
  | 'ai-credits-included'
  | 'priority-support'
  | 'early-access'
  // Academic features
  | 'academic-plan'
  | 'academic-price'
  | 'discount-codes'
  | 'student-limit'
  | 'premium-duration'
  | 'limited-ai-edits';
