import { AboutPage } from './AboutPage';
import { HomePage } from './HomePage/server';
import { ProfilePage } from './ProfilePage/server';
import { VizPage } from './VizPage/server';
import { BetaConfirmPage } from './BetaConfirmPage';
import { SandboxPage } from './SandboxPage/server';

// Note: order matters (profile page should come last)
export const pages = [
  HomePage,
  AboutPage,
  VizPage,
  BetaConfirmPage,
  SandboxPage,
  ProfilePage,
];
