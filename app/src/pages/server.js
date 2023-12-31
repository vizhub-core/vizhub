import { AboutPage } from './AboutPage';
import { HomePage } from './HomePage/server';
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

// Note: order matters (profile page should come last)
// Need to update `client.js` as well
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
  CreateVizPage,
  ProfilePage,
];
