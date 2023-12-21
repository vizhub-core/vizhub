import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import {
  Info,
  Snapshot,
  SortId,
  User,
  UserId,
  VizId,
} from 'entities';
import { VizKit } from 'api/src/VizKit';
import { SortContext } from './SortContext';
import { SectionContext } from './SectionContext';

export const InfosAndOwnersContext = createContext<{
  allInfoSnapshots: Array<Snapshot<Info>>;
  fetchNextPage: () => void;
  ownerUserSnapshotsById: {
    [userId: UserId]: Snapshot<User>;
  };
  isLoadingNextPage: boolean;
  hasMore: boolean;
}>(null);

const vizKit = VizKit({ baseUrl: '/api' });

// State machine
// SETTLED --> NEXT_PAGE_REQUESTED --|
//    |------<-----------------------|
const SETTLED = 'SETTLED';
const NEXT_PAGE_REQUESTED = 'NEXT_PAGE_NEEDED';

// A key that represents a section and sort.
// This is used to index the pages object in the state.
// Of the form `${action.section}-${action.sortId}`;
type SectionAndSortKey = string;

const sectionAndSortKey = (
  sectionId: string,
  sortId: SortId,
): SectionAndSortKey => `${sectionId}-${sortId}`;

// The shape of the state for tracking pages of results
type PaginationState = {
  sectionsAndSorts: {
    [key: SectionAndSortKey]: {
      // If a request for the next page is in flight, this will be NEXT_PAGE_REQUESTED
      // Otherwise, it will be SETTLED
      nextPageStatus:
        | typeof SETTLED
        | typeof NEXT_PAGE_REQUESTED;

      // The results for each page, indexed by sortId and page number
      pages: Array<Array<Snapshot<Info>>>;

      // If there was an error fetching the next page, it will be reported here
      // TODO: Handle errors better - check types match
      error?: Error;

      // True if the "more" button should be shown for this section and sort
      hasMore: boolean;
    };
  };

  // The owner users for each info, indexed by userId
  ownerUserSnapshotsById: {
    [userId: string]: Snapshot<User>;
  };
};

type PaginationAction =
  | { type: 'RequestNextPage'; key: SectionAndSortKey }
  | {
      type: 'ResolveNextPage';
      key: SectionAndSortKey;
      infoSnapshots: Array<Snapshot<Info>>;
      ownerUserSnapshots: Array<Snapshot<User>>;
      hasMore: boolean;
    }
  | {
      type: 'ReportError';
      error: Error;
      key: SectionAndSortKey;
    };

// Inspired by https://github.com/vizhub-core/vizhub/blob/f0d1fbc6cd0f8d124d6424ec8bd948785209d6c4/vizhub-v3/vizhub-app/src/presenters/HomePagePresenter/useVizInfos.js#L19
const reducer = (
  state: PaginationState,
  action: PaginationAction,
) => {
  switch (action.type) {
    // When the request goes out
    case 'RequestNextPage':
      return {
        ...state,
        sectionsAndSorts: {
          ...state.sectionsAndSorts,
          [action.key]: {
            ...state.sectionsAndSorts[action.key],
            nextPageStatus: NEXT_PAGE_REQUESTED,
          },
        },
      };

    // When the request comes back with data
    case 'ResolveNextPage':
      return {
        ...state,
        // nextPageStatus: SETTLED,
        // pages: {
        //   ...state.pages,
        //   [action.sortId]: [
        //     ...state.pages[action.sortId],
        //     action.infoSnapshots,
        //   ],
        // },
        sectionsAndSorts: {
          ...state.sectionsAndSorts,
          [action.key]: {
            ...state.sectionsAndSorts[action.key],
            pages: [
              ...(state.sectionsAndSorts[action.key]
                ?.pages || []),
              action.infoSnapshots,
            ],
            nextPageStatus: SETTLED,
            hasMore: action.hasMore,
          },
        },
        ownerUserSnapshotsById: {
          ...state.ownerUserSnapshotsById,
          ...action.ownerUserSnapshots.reduce(
            (accumulator, snapshot) => ({
              ...accumulator,
              [snapshot.data.id]: snapshot,
            }),
            {},
          ),
        },
        hasMore: action.hasMore,
      };

    // When the request comes back with an error
    case 'ReportError':
      // return { ...state, error: action.error };
      return {
        ...state,
        sectionsAndSorts: {
          ...state.sectionsAndSorts,
          [action.key]: {
            ...state.sectionsAndSorts[action.key],
            error: action.error,
            nextPageStatus: SETTLED,
          },
        },
      };

    default:
      throw new Error('This should never happen.');
  }
};

// Pages that use this context should have this shape of pageData.
export type InfosAndOwnersPageData = {
  // First page of info snapshots
  infoSnapshots: Array<Snapshot<Info>>;

  // Owner users for each info in first page
  ownerUserSnapshots: Array<Snapshot<User>>;

  // Optional, query filter for forks page
  // Passed as forkedFrom option into gateways.getInfos
  forkedFrom?: VizId;
};

// Define an initializer function for the reducer state.
const init = ({
  currentKey,
  infoSnapshots,
  ownerUserSnapshots,
  hasMoreInitially,
}: {
  currentKey: SectionAndSortKey;
  infoSnapshots: Array<Snapshot<Info>>;
  ownerUserSnapshots: Array<Snapshot<User>>;
  hasMoreInitially: boolean;
}) => {
  return {
    sectionsAndSorts: {
      [currentKey]: {
        nextPageStatus: SETTLED,
        pages: [infoSnapshots],
        hasMore: hasMoreInitially,
      },
    },
    ownerUserSnapshotsById: ownerUserSnapshots.reduce(
      (accumulator, snapshot) => ({
        ...accumulator,
        [snapshot.data.id]: snapshot,
      }),
      {},
    ),
  };
};

export const InfosAndOwnersProvider = ({
  infoSnapshots,
  ownerUserSnapshots,
  forkedFrom,
  owner,
  children,
  hasMoreInitially,
}: {
  infoSnapshots: Array<Snapshot<Info>>;
  ownerUserSnapshots: Array<Snapshot<User>>;
  forkedFrom?: VizId;
  owner?: UserId;
  children: React.ReactNode;
  hasMoreInitially: boolean;
}) => {
  const { sortId } = useContext(SortContext);
  const { sectionId } = useContext(SectionContext);

  const currentKey = useMemo(
    () => sectionAndSortKey(sectionId, sortId),
    [sectionId, sortId],
  );

  // The initial pagination state, from server-rendered first page.
  const initialPaginationState: PaginationState = useMemo(
    () => ({
      sectionsAndSorts: {
        [currentKey]: {
          nextPageStatus: SETTLED,
          pages: [infoSnapshots],
          hasMore: hasMoreInitially,
        },
      },
      // nextPageStatus: SETTLED,
      // pages: { [sortId]: [infoSnapshots] },
      ownerUserSnapshotsById: ownerUserSnapshots.reduce(
        (accumulator, snapshot) => ({
          ...accumulator,
          [snapshot.data.id]: snapshot,
        }),
        {},
      ),
    }),
    [
      sortId,
      infoSnapshots,
      ownerUserSnapshots,
      hasMoreInitially,
    ],
  );

  const [paginationState, paginationDispatch] = useReducer(
    reducer,
    {
      currentKey,
      infoSnapshots,
      ownerUserSnapshots,
      hasMoreInitially,
    },
    init,
  );

  const fetchNextPage = useCallback(() => {
    paginationDispatch({
      type: 'RequestNextPage',
      key: currentKey,
    });

    async function fetchNextPageAsync() {
      const result = await vizKit.rest.getInfosAndOwners({
        forkedFrom,
        owner,
        noNeedToFetchUsers: Object.keys(
          paginationState.ownerUserSnapshotsById,
        ),
        sortId,
        // pageNumber: paginationState.pages[sortId].length,
        pageNumber:
          paginationState.sectionsAndSorts[currentKey]
            ?.pages.length || 0,
      });
      if (result.outcome === 'success') {
        const {
          infoSnapshots,
          ownerUserSnapshots,
          hasMore,
        } = result.value;
        // paginationDispatch({
        //   type: 'ResolveNextPage',
        //   sortId,
        //   infoSnapshots,
        //   ownerUserSnapshots,
        //   hasMore,
        // });
        paginationDispatch({
          type: 'ResolveNextPage',
          key: currentKey,
          infoSnapshots,
          ownerUserSnapshots,
          hasMore,
        });
      } else {
        paginationDispatch({
          type: 'ReportError',
          error: result.error,
          key: currentKey,
        });
      }
    }
    fetchNextPageAsync();
  }, [paginationState, currentKey]);

  // const allInfoSnapshots = useMemo(
  //   () => paginationState.pages[sortId].flat(),
  //   [paginationState.pages, sortId],
  // );

  const allInfoSnapshots = useMemo(
    () =>
      paginationState.sectionsAndSorts[
        currentKey
      ]?.pages.flat() || [],
    [paginationState, currentKey],
  );

  // const value = useMemo(
  //   () => ({
  //     allInfoSnapshots,
  //     fetchNextPage,
  //     ownerUserSnapshotsById:
  //       paginationState.ownerUserSnapshotsById,
  //     isLoadingNextPage:
  //       paginationState.nextPageStatus ===
  //       NEXT_PAGE_REQUESTED,
  //     hasMore: paginationState.hasMore,
  //   }),
  //   [allInfoSnapshots, fetchNextPage, paginationState],
  // );

  const value = useMemo(
    () => ({
      allInfoSnapshots,
      fetchNextPage,
      ownerUserSnapshotsById:
        paginationState.ownerUserSnapshotsById,
      isLoadingNextPage:
        paginationState.sectionsAndSorts[currentKey]
          ?.nextPageStatus === NEXT_PAGE_REQUESTED,
      hasMore:
        paginationState.sectionsAndSorts[currentKey]
          ?.hasMore || false,
    }),
    [
      allInfoSnapshots,
      fetchNextPage,
      paginationState,
      currentKey,
    ],
  );

  return (
    <InfosAndOwnersContext.Provider value={value}>
      {children}
    </InfosAndOwnersContext.Provider>
  );
};
