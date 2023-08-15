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

export const InfosAndOwnersContext = createContext<{
  allInfoSnapshots: Array<Snapshot<Info>>;
  fetchNextPage: () => void;
  ownerUserSnapshotsById: {
    [userId: UserId]: Snapshot<User>;
  };
  isLoadingNextPage: boolean;
}>(null);

const vizKit = VizKit({ baseUrl: '/api' });

// State machine
// SETTLED --> NEXT_PAGE_REQUESTED --|
//    |------<-----------------------|
const SETTLED = 'SETTLED';
const NEXT_PAGE_REQUESTED = 'NEXT_PAGE_NEEDED';

// The shape of the state for tracking pages of results
type PaginationState = {
  // If a request for the next page is in flight, this will be NEXT_PAGE_REQUESTED
  // Otherwise, it will be SETTLED
  nextPageStatus:
    | typeof SETTLED
    | typeof NEXT_PAGE_REQUESTED;

  // The results for each page, indexed by sortId and page number
  pages: { [sortId: string]: Array<Array<Snapshot<Info>>> };

  // The owner users for each info, indexed by userId
  ownerUserSnapshotsById: {
    [userId: string]: Snapshot<User>;
  };

  // If there was an error fetching the next page, it will be reported here
  // TODO: Handle errors better - check types match
  error?: Error;
};

type PaginationAction =
  | { type: 'RequestNextPage' }
  | {
      type: 'ResolveNextPage';
      sortId: SortId;
      infoSnapshots: Array<Snapshot<Info>>;
      ownerUserSnapshots: Array<Snapshot<User>>;
    }
  | { type: 'ReportError'; error: Error };

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
        nextPageStatus: NEXT_PAGE_REQUESTED,
      };

    // When the request comes back with data
    case 'ResolveNextPage':
      return {
        ...state,
        nextPageStatus: SETTLED,
        pages: {
          ...state.pages,
          [action.sortId]: [
            ...state.pages[action.sortId],
            action.infoSnapshots,
          ],
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
      };

    // When the request comes back with an error
    case 'ReportError':
      return { ...state, error: action.error };

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

export const InfosAndOwnersProvider = ({
  infoSnapshots,
  ownerUserSnapshots,
  forkedFrom,
  owner,
  children,
}: {
  infoSnapshots: Array<Snapshot<Info>>;
  ownerUserSnapshots: Array<Snapshot<User>>;
  forkedFrom?: VizId;
  owner?: UserId;
  children: React.ReactNode;
}) => {
  const { sortId } = useContext(SortContext);

  // The initial pagination state, from server-rendered first page.
  const initialPaginationState: PaginationState = useMemo(
    () => ({
      nextPageStatus: SETTLED,
      pages: { [sortId]: [infoSnapshots] },
      ownerUserSnapshotsById: ownerUserSnapshots.reduce(
        (accumulator, snapshot) => ({
          ...accumulator,
          [snapshot.data.id]: snapshot,
        }),
        {},
      ),
    }),
    [sortId, infoSnapshots, ownerUserSnapshots],
  );

  const [paginationState, paginationDispatch] = useReducer(
    reducer,
    initialPaginationState,
  );

  const fetchNextPage = useCallback(() => {
    paginationDispatch({ type: 'RequestNextPage' });

    async function fetchNextPage() {
      const result = await vizKit.rest.getInfosAndOwners({
        forkedFrom,
        owner,
        noNeedToFetchUsers: Object.keys(
          paginationState.ownerUserSnapshotsById,
        ),
        sortId,
        pageNumber: paginationState.pages[sortId].length,
      });
      if (result.outcome === 'success') {
        const { infoSnapshots, ownerUserSnapshots } =
          result.value;
        paginationDispatch({
          type: 'ResolveNextPage',
          sortId,
          infoSnapshots,
          ownerUserSnapshots,
        });
      } else {
        paginationDispatch({
          type: 'ReportError',
          error: result.error,
        });
      }
    }
    fetchNextPage();
  }, [paginationState, sortId]);

  const allInfoSnapshots = useMemo(
    () => paginationState.pages[sortId].flat(),
    [paginationState.pages, sortId],
  );

  const value = useMemo(
    () => ({
      allInfoSnapshots,
      fetchNextPage,
      ownerUserSnapshotsById:
        paginationState.ownerUserSnapshotsById,
      isLoadingNextPage:
        paginationState.nextPageStatus ===
        NEXT_PAGE_REQUESTED,
    }),
    [allInfoSnapshots, fetchNextPage, paginationState],
  );

  return (
    <InfosAndOwnersContext.Provider value={value}>
      {children}
    </InfosAndOwnersContext.Provider>
  );
};
