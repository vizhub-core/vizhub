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

const sortOptionsMap = new Map<SortId, SortOption>(
  sortOptions.map((option) => [option.id, option])
);

// Convenience function for getting the sort field from the sort ID.
export const getSortField = (sortId: SortId | undefined): SortField =>
  (sortId && sortOptionsMap.get(sortId)?.sortField) || defaultSortField;

// The default for sorting views of many visualizations (popular).
export const defaultSortOption: SortOption = sortOptions[0];

// Convenience unpacking of the default sort option.
export const defaultSortField: SortField = defaultSortOption.sortField;

export type SortField =
  | 'updated'
  | 'forksCount'
  | 'upvotesCount'
  | 'scoreHackerHotLastUpdated';

export type SortOrder = 'ascending' | 'descending';

export const defaultSortOrder: SortOrder = 'ascending';

// Used in URL param do define which sort option is selected.
// Has backwards compatibility with old URLs from V2.
export type SortId = 'popular' | 'mostRecent' | 'mostForked' | 'mostUpvoted';

export type SortOption = {
  id: SortId;
  // Used in UI
  label: string;
  // Used in DB query
  sortField: SortField;
};
