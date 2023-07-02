import { Info, Snapshot, SortId, User, UserId, sortOptions } from 'entities';
import { ExplorePageBody } from 'components';
import { VizKit } from 'api/src/VizKit';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { SortContext } from '../../contexts/SortContext';
import { VizPreviewPresenter } from '../VizPreviewPresenter';
import { useCallback, useContext, useMemo, useReducer } from 'react';

const vizKit = VizKit({ baseUrl: './api' });

// State machine
// SETTLED --> NEXT_PAGE_REQUESTED --|
//    |------<-----------------------|
const SETTLED = 'SETTLED';
const NEXT_PAGE_REQUESTED = 'NEXT_PAGE_NEEDED';

// The shape of the state for tracking pages of results
type PaginationState = {
  // If a request for the next page is in flight, this will be NEXT_PAGE_REQUESTED
  // Otherwise, it will be SETTLED
  nextPageStatus: typeof SETTLED | typeof NEXT_PAGE_REQUESTED;

  // The results for each page, indexed by sortId and page number
  pages: { [sortId: string]: Array<Array<Snapshot<Info>>> };

  // The owner users for each info, indexed by userId
  ownerUsers: { [userId: string]: Snapshot<User> };

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

const reducer = (state: PaginationState, action: PaginationAction) => {
  switch (action.type) {
    // When the request goes out
    case 'RequestNextPage':
      return { ...state, nextPageStatus: NEXT_PAGE_REQUESTED };

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
        ownerUsers: {
          ...state.ownerUsers,
          ...action.ownerUserSnapshots.reduce(
            (accumulator, snapshot) => ({
              ...accumulator,
              [snapshot.data.id]: snapshot,
            }),
            {}
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

export const Body = ({ pageData }) => {
  // const { infoSnapshots, ownerUserSnapshots } = pageData;

  const { sortId, setSortId } = useContext(SortContext);

  // The initial pagination state, from server-rendered first page.
  const initialPaginationState: PaginationState = useMemo(
    () => ({
      nextPageStatus: SETTLED,
      pages: { [sortId]: [pageData.infoSnapshots] },
      ownerUsers: pageData.ownerUserSnapshots.reduce(
        (accumulator, snapshot) => ({
          ...accumulator,
          [snapshot.data.id]: snapshot,
        }),
        {}
      ),
    }),
    [sortId, pageData]
  );

  const [paginationState, paginationDispatch] = useReducer(
    reducer,
    initialPaginationState
  );

  const fetchNextPage = useCallback(() => {
    paginationDispatch({ type: 'RequestNextPage' });

    async function fetchNextPage() {
      const result = await vizKit.rest.getInfosAndOwners({
        noNeedToFetchUsers: Object.keys(paginationState.ownerUsers),
        sortId,
        pageNumber: paginationState.pages[sortId].length,
      });
      if (result.outcome === 'success') {
        const { infoSnapshots, ownerUserSnapshots } = result.value;
        paginationDispatch({
          type: 'ResolveNextPage',
          sortId,
          infoSnapshots,
          ownerUserSnapshots,
        });
      } else {
        paginationDispatch({ type: 'ReportError', error: result.error });
      }
    }
    fetchNextPage();
  }, [paginationState, sortId, pageData.infoSnapshots]);

  const allInfoSnapshots = useMemo(
    () => paginationState.pages[sortId].flat(),
    [paginationState, sortId]
  );

  return (
    <div className="vh-page overflow-auto">
      <SmartHeader />
      <ExplorePageBody
        renderVizPreviews={() =>
          allInfoSnapshots.map((infoSnapshot: Snapshot<Info>) => (
            <VizPreviewPresenter
              key={infoSnapshot.data.id}
              infoSnapshot={infoSnapshot}
              ownerUser={
                paginationState.ownerUsers[infoSnapshot.data.owner].data
              }
            />
          ))
        }
        sortId={sortId}
        setSortId={setSortId}
        sortOptions={sortOptions}
        onMoreClick={fetchNextPage}
        isLoadingNextPage={
          paginationState.nextPageStatus === NEXT_PAGE_REQUESTED
        }
      />
    </div>
  );
};
