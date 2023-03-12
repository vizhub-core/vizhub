import { HomePage } from '../components/HomePage';
import { renderVizPreviews } from './renderVizPreviews';

export default {
  title: 'VizHub/HomePage',
  component: HomePage,
  parameters: {
    layout: 'fullscreen',
  },
};

export const LoggedIn = {
  args: {
    user: {
      name: 'Jane Doe',
    },
    renderVizPreviews,
  },
};

export const LoggedOut = {
  args: {
    renderVizPreviews,
  },
};
