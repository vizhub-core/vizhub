// The options for sorting views of many Infos.

// The options for sorting views of many visualizations.
export const sortOptions: Array<SortOption> = [
  {
    id: 'popular',
    label: 'Most popular',
    sortField: 'scoreHackerHotLastUpdated',
  },
  {
    id: 'mostRecent',
    label: 'Most recent',
    sortField: 'updated',
  },
  {
    id: 'mostForked',
    label: 'Most forked',
    sortField: 'forksCount',
  },
  {
    id: 'mostUpvoted',
    label: 'Most upvoted',
    sortField: 'upvotesCount',
  },
];

// The default for sorting views of many visualizations (popular).
export const defaultSortOption: SortOption = sortOptions[0];

export type SortField =
  | 'updated'
  | 'forksCount'
  | 'upvotesCount'
  | 'scoreHackerHotLastUpdated';

export type SortOrder = 'ascending' | 'descending';

export const defaultSortOrder: SortOrder = 'ascending';

export type SortOption = {
  // Used in URL param - backwards compatibility with old URLs
  id: string;
  // Used in UI
  label: string;
  // Used in DB query
  sortField: SortField;
};
