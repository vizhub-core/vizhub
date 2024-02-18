// Plan
//  * What level of paying customer this user is.
export type Plan = 'free' | 'premium' | 'professional';

// Not a paying customer.
export const FREE: Plan = 'free';

// A paying customer on the premium plan.
export const PREMIUM: Plan = 'premium';

// A paying customer on the professional plan.
export const PRO: Plan = 'professional';
