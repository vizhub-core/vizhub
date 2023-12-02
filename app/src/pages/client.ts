import { AboutPage } from './AboutPage';
import { HomePage } from './HomePage';
import { LandingPage } from './LandingPage';
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

// Note: order matters (profile page should come last)
// Need to update `server.js` as well
export const pages = [
  HomePage,
  LandingPage,
  AboutPage,
  VizPage,
  ForksPage,
  BetaConfirmPage,
  SandboxPage,
  ExplorePage,
  PricingPage,
  AccountPage,
  SearchPage,
  ResourcesPage,
  KitchenSinkPage,
  ProfilePage,
];
