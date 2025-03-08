import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';
import { BrowserRouter } from 'react-router';
import '../../app.css';

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const LoggedOut: Story = {
  args: {
    isAuthenticated: false,
  },
};

export const LoggedIn: Story = {
  args: {
    isAuthenticated: true,
    onLogout: () => alert('Logout clicked'),
  },
};

export const ScrolledHeader: Story = {
  args: {
    isAuthenticated: false,
  },
  parameters: {
    chromatic: { scrollY: 100 },
  },
};

export const MobileView: Story = {
  args: {
    isAuthenticated: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const MobileViewLoggedIn: Story = {
  args: {
    isAuthenticated: true,
    onLogout: () => alert('Logout clicked'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
