import { AboutPage } from './AboutPage';
import { HomePage } from './HomePage';
import { ProfilePage } from './ProfilePage';
import { VizPage } from './VizPage';
import { BetaConfirmPage } from './BetaConfirmPage';
import { SandboxPage } from './SandboxPage';
import { ExplorePage } from './ExplorePage';

// Note: order matters (profile page should come last)
// Need to update `server.js` as well
export const pages = [
  HomePage,
  AboutPage,
  VizPage,
  BetaConfirmPage,
  SandboxPage,
  ExplorePage,
  ProfilePage,
];
