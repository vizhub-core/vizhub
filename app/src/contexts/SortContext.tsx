// import { createContext, useCallback, useMemo } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import {
//   SortId,
//   asSortId,
//   defaultSortOption,
// } from 'entities';

// // This context provides the current sortId and a function to change it.
// // This is what changes when the user selects a sort option.
// export const SortContext = createContext<{
//   sortId: SortId;
//   setSortId: (newSortId: SortId) => void;
// }>(null);

// export const SortProvider = ({ children }) => {
//   const [searchParams, setSearchParams] = useSearchParams();

//   // Validated sortId from URL param, or default sortId.
//   const sortId: SortId | null =
//     asSortId(searchParams.get('sort')) ||
//     defaultSortOption.id;

//   // // Update URL param when sortId changes.
//   // const setSortId = useCallback(
//   //   (newSortId: SortId) => {
//   //     // TODO client side update
//   //     setSearchParams(
//   //       (urlSearchParams: URLSearchParams) => {
//   //         urlSearchParams.set('sort', newSortId);
//   //         console.log(urlSearchParams.toString());

//   //         // Do a hard navigation to the new URL.
//   //         // Temporary until client side update is implemented.
//   //         window.location.search = `?sort=${newSortId}`;
//   //         return urlSearchParams;
//   //       },
//   //     );
//   //   },
//   //   [setSearchParams],
//   // );
//   // Update URL param when sortId changes, without hard navigation.
//   const setSortId = useCallback(
//     (newSortId: SortId) => {
//       const newSearchParams = new URLSearchParams(
//         searchParams,
//       );
//       newSearchParams.set('sort', newSortId);
//       setSearchParams(newSearchParams);
//     },
//     [searchParams, setSearchParams],
//   );

//   const value = useMemo(
//     () => ({ sortId, setSortId }),
//     [sortId, setSortId],
//   );

//   return (
//     <SortContext.Provider value={value}>
//       {children}
//     </SortContext.Provider>
//   );
// };
