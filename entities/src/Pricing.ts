// Plan
//  * What level of paying customer this user is.
export type Plan = 'free' | 'premium' | 'professional';

// Not a paying customer.
export const FREE: Plan = 'free';

// A paying customer on the premium plan.
export const PREMIUM: Plan = 'premium';

// A paying customer on the professional plan.
export const PRO: Plan = 'professional';

// The limit of non-public vizzes allowed on the free plan.
export const FREE_NON_PUBLIC_VIZ_LIMIT = 5;

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
  | 'limited-ai-edits'
  | 'limited-non-public-vizzes'
  | 'unlimited-non-public-vizzes'
  | 'limited-ai-chat';
