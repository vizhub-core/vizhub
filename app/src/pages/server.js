import { AboutPage } from './AboutPage';
import { HomePage } from './HomePage/server';
import { ProfilePage } from './ProfilePage/server';
import { VizPage } from './VizPage/server';
import { BetaConfirmPage } from './BetaConfirmPage';
import { SandboxPage } from './SandboxPage/server';
import { ExplorePage } from './ExplorePage/server';
import { ForksPage } from './ForksPage/server';

// Note: order matters (profile page should come last)
// Need to update `client.js` as well
export const pages = [
  HomePage,
  AboutPage,
  VizPage,
  ForksPage,
  BetaConfirmPage,
  SandboxPage,
  ExplorePage,
  ProfilePage,
];
