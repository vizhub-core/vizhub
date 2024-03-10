// Plan
//  * What level of paying customer this user is.
export type Plan = 'free' | 'premium' | 'professional';

// Not a paying customer.
export const FREE: Plan = 'free';

// A paying customer on the premium plan.
export const PREMIUM: Plan = 'premium';

// A paying customer on the professional plan.
export const PRO: Plan = 'professional';

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
  // Consultation features
  | 'visualize-your-data'
  | 'work-through-hard-problems'
  | 'design-interactive-visualizations'
  | 'optimize-performance'
  | 'create-custom-visualizations'
  | 'integrate-visualizations-with-your-platform'
  | 'learn-data-visualization-best-practices'
  | 'money-back-guarantee';
