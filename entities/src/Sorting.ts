// The options for sorting views of many Infos.

// The options for sorting views of many visualizations.
export const sortOptions: Array<SortOption> = [
  // TODO bring this back after we compute popularity scores again
  // {
  //   id: 'popular',
  //   label: 'Most popular',
  //   sortField: 'popularity',
  // },
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
  // TODO bring this back after we:
  //  * Migrate upvotes from V2
  //  * Implement the starring feature
  // {
  //   id: 'mostUpvoted',
  //   label: 'Most upvoted',
  //   sortField: 'upvotesCount',
  // },
];

const sortOptionsMap = new Map<SortId, SortOption>(
  sortOptions.map((option) => [option.id, option]),
);

// The default for sorting views of many visualizations.
export const defaultSortOption: SortOption =
  sortOptionsMap.get('mostRecent');

// Convenience function for getting the sort field from the sort ID.
export const getSortField = (
  sortId: SortId | undefined,
): SortField =>
  (sortId && sortOptionsMap.get(sortId)?.sortField) ||
  defaultSortField;

// Convenience function for validating sort id.
export const asSortId = (sortId: string): SortId | null =>
  sortOptionsMap.has(sortId as SortId)
    ? (sortId as SortId)
    : null;

// Convenience unpacking of the default sort option.
export const defaultSortField: SortField =
  defaultSortOption.sortField;

export type SortField =
  | 'updated'
  | 'forksCount'
  | 'upvotesCount'
  | 'popularity';

export type SortOrder = 'ascending' | 'descending';

export const defaultSortOrder: SortOrder = 'descending';

// Used in URL param do define which sort option is selected.
// Has backwards compatibility with old URLs from V2.
export type SortId =
  | 'popular'
  | 'mostRecent'
  | 'mostForked'
  | 'mostUpvoted';

export type SortOption = {
  id: SortId;
  // Used in UI
  label: string;
  // Used in DB query
  sortField: SortField;
};
