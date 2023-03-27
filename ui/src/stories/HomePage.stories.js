import { HomePageBody } from '../components/HomePageBody';
import { renderVizPreviews } from './renderVizPreviews';

export default {
  title: 'VizHub/HomePageBody',
  component: HomePageBody,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: { onEmailSubmit: { action: 'emailSubmit' } },
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
