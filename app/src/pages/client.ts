import { AboutPage } from './AboutPage';
import { AILandingPage } from './AILandingPage';
import { FeaturesPage } from './FeaturesPage';
import { ProfilePage } from './ProfilePage';
import { VizPage } from './VizPage';
import { BetaConfirmPage } from './BetaConfirmPage';
import { SandboxPage } from './SandboxPage';
import { ExplorePage } from './ExplorePage';
import { ForksPage } from './ForksPage';
import { SearchPage } from './SearchPage';
import { PricingPage } from './PricingPage';
import { AccountPage } from './AccountPage';
import { ResourcesPage } from './ResourcesPage';
import { KitchenSinkPage } from './KitchenSinkPage';
import { CreateVizPage } from './CreateVizPage';
import { StargazersPage } from './StargazersPage';
import { DocumentationPage } from './DocumentationPage';
import { DocsPage } from './DocsPage';
import { CreateVizPageTest } from './CreateVizPageTest';
import { DashboardPage } from './DashboardPage';

// Note: order matters (profile page should come last)
// Need to update `server.js` as well
export const pages = [
  FeaturesPage,
  AILandingPage,
  AboutPage,
  StargazersPage,
  ForksPage,
  VizPage,
  BetaConfirmPage,
  SandboxPage,
  ExplorePage,
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
