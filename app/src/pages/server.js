import { AboutPage } from './AboutPage';
import { AILandingPage } from './AILandingPage/server';
import { FeaturesPage } from './FeaturesPage/server';
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
import { DocsPage } from './DocsPage/server';
import { CreateVizPageTest } from './CreateVizPageTest/server';
import { DashboardPage } from './DashboardPage/server';

// import { ExploreRedirect } from './ExploreRedirect';

// Note: order matters (profile page should come last)
// Need to update `client.js` as well
export const pages = [
  FeaturesPage,
  AILandingPage,
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
  DocsPage,
  PricingPage,
  AccountPage,
  SearchPage,
  ResourcesPage,
  DashboardPage,
  KitchenSinkPage,
  CreateVizPage,
  CreateVizPageTest,
  ProfilePage,
];
