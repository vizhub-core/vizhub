import { VizId } from './Viz';
import { CommitId } from './RevisionHistory';

// DeploymentId
//  * Unique identifier string for a deployment.
export type DeploymentId = string;

// Stability
//  * Controls stability level of a Deployment
//
//  * live
//    * Gets changes in real time as they happen
//    * Least stable but most fresh
//    * Suitable for sites with live updating data
//    * Wraps the page in an iframe
//    * Uses WebSockets for updates
//    * No page refresh needed to get the latest
//    * No caching
//
//  * latest
//    * Uses the latest commit on the viz
//    * Serves the page directly, no iframe
//    * Requires a manual refresh to get the latest
//    * No caching
//    * Suitable for staging sites
//
//  * pinned
//    * Uses a specific commit on the viz
//    * Most stable, never changes
//    * Aggressive caching
//    * Suitable for production sites
//
export type Stability = 'live' | 'latest' | 'pinned';

// Deployment
//  * Enables a viz to be deployed as a standalone microsite
//  * Configurable level of stability:
//  * Can be attached to a custom domain
export interface Deployment {
  id: DeploymentId;

  // The viz that is deployed from
  viz: VizId;

  // stability
  // The stability level of this deployment
  stability: Stability;

  // pinnedCommit
  // * The specific commit for the pinned version
  // * Only populated when `stability === "pinned"`
  pinnedCommit?: CommitId;

  // customDomain
  // * The domain that this deployment is linked to
  // * Only populated if the user has set up a custom domain
  // * Similar to custom domains with GitHub Pages
  customDomain?: string;
}
