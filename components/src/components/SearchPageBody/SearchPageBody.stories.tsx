import { Meta, StoryObj } from '@storybook/react';
import { SearchPageBody } from './index';

const meta: Meta<typeof SearchPageBody> = {
  title: 'Components/SearchPageBody',
  component: SearchPageBody,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof SearchPageBody>;

// Mock data for visualization previews
const mockVizPreviews = Array(12)
  .fill(null)
  .map((_, i) => (
    <div
      key={i}
      style={{
        width: '100%',
        height: '200px',
        background: `hsl(${i * 30}, 70%, 80%)`,
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
      }}
    >
      Visualization {i + 1}
    </div>
  ));

export const Default: Story = {
  args: {
    renderVizPreviews: () => mockVizPreviews,
    onMoreClick: () => console.log('Load more clicked'),
    isLoadingNextPage: false,
    sortId: 'recent',
    setSortId: (id) => console.log('Sort changed to:', id),
    sortOptions: [
      { id: 'recent', label: 'Most Recent' },
      { id: 'popular', label: 'Most Popular' },
      { id: 'trending', label: 'Trending' },
    ],
    hasMore: true,
    searchQuery: '',
  },
};

export const WithSearchQuery: Story = {
  args: {
    ...Default.args,
    searchQuery: 'data visualization',
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoadingNextPage: true,
  },
};

export const NoResults: Story = {
  args: {
    ...Default.args,
    renderVizPreviews: () => [],
    hasMore: false,
    searchQuery: 'no results for this query',
  },
};
