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
};

type PaginationAction =
  | { type: 'RequestNextPage' }
  | {
      type: 'ResolveNextPage';
      sortId: SortId;
      infoSnapshots: Array<Snapshot<Info>>;
    }
  | { type: 'failure' };

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
      };

    default:
      throw new Error('This should never happen.');
  }
};

export const Body = ({ pageData }) => {
  const { infoSnapshots, ownerUserSnapshots } = pageData;

  // Memoize a map of infoId -> ownerUser
  // TODO solve this for pagination case
  // TODO solve for changing sort order
  const ownerUserMap: Map<UserId, User> = useMemo(
    () =>
      new Map(
        ownerUserSnapshots.map((snapshot: Snapshot<User>) => [
          snapshot.data.id,
          snapshot.data,
        ])
      ),
    [ownerUserSnapshots]
  );

  const { sortId, setSortId } = useContext(SortContext);

  // The initial pagination state, from server-rendered first page.
  const initialPaginationState: PaginationState = useMemo(
    () => ({
      nextPageStatus: SETTLED,
      pages: { [sortId]: [infoSnapshots] },
    }),
    [sortId, infoSnapshots]
  );

  const [paginationState, paginationDispatch] = useReducer(
    reducer,
    initialPaginationState
  );

  const fetchNextPage = useCallback(() => {
    paginationDispatch({ type: 'RequestNextPage' });

    // TODO: Remove this timeout, and replace with API call
    setTimeout(() => {
      paginationDispatch({
        type: 'ResolveNextPage',
        sortId,
        infoSnapshots: infoSnapshots,
      });
    }, 1000);
    // // TODO Invoke API to fetch next page
    // console.log('TODO: fetch next page');

    // const noNeedToFetchUsers = Array.from(ownerUserMap.keys());
    // console.log('noNeedToFetchUsers', noNeedToFetchUsers);
    // console.log();

    // // vizKit.rest.getInfosAndOwners({
    // //   noNeedToFetchUsers,
    // // });
  }, []);

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
              ownerUser={ownerUserMap.get(infoSnapshot.data.owner)}
            />
          ))
        }
        sortId={sortId}
        setSortId={setSortId}
        sortOptions={sortOptions}
        onMoreClick={fetchNextPage}
      />
    </div>
  );
};
