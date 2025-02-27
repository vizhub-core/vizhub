import { AboutPage } from './AboutPage';
import { LandingPage } from './LandingPage/server';
import { ProfilePage } from './ProfilePage/server';
import { VizPage } from './VizPage/server';
import { BetaConfirmPage } from './BetaConfirmPage';
import { SandboxPage } from './SandboxPage/server';
import { ExplorePage } from './ExplorePage/server';
import { ForksPage } from './ForksPage/server';
import { SearchPage } from './SearchPage/server';
import { PricingPage } from './PricingPage/server';
import { AccountPage } from './AccountPage/server';
import { ResourcesPage } from './ResourcesPage/server';
import { KitchenSinkPage } from './KitchenSinkPage/server';
import { CreateVizPage } from './CreateVizPage/server';
import { StargazersPage } from './StargazersPage/server';
import { DocumentationPage } from './DocumentationPage/server';

// import { ExploreRedirect } from './ExploreRedirect';

// Note: order matters (profile page should come last)
// Need to update `client.js` as well
export const pages = [
  LandingPage,
  AboutPage,

  StargazersPage,
  // Forks pave MUST come before viz page
  // because otherwise the path conflicts
  // with the versioned variant of the viz page.
  ForksPage,

  VizPage,
  BetaConfirmPage,
  SandboxPage,
  ExplorePage,
  // ExploreRedirect,
  DocumentationPage,
  PricingPage,
  AccountPage,
  SearchPage,
  ResourcesPage,
  KitchenSinkPage,
  CreateVizPage,
  ProfilePage,
];
