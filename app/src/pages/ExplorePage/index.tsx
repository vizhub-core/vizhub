// TODO
// import { ProfilePageBody } from 'components';
// import { SmartHeader } from '../../smartComponents/SmartHeader';
// import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
// import { useShareDBDocData } from '../../useShareDBDocData';
// import { VizPreviewPresenter } from './VizPreviewPresenter';

// export const ExplorePage = ({ pageData }) => {
//   const { infoSnapshots, ownerUserSnapshots, authenticatedUserSnapshot } =
//     pageData;

//   return (
//     <AuthenticatedUserProvider
//       authenticatedUserSnapshot={authenticatedUserSnapshot}
//     >
//       <div className="vh-page overflow-auto">
//         <SmartHeader />
//         <ExplorePageBody
//           renderVizPreviews={() =>
//             infoSnapshots.map((infoSnapshot) => (
//               <VizPreviewPresenter
//                 key={infoSnapshot.data.id}
//                 infoSnapshot={infoSnapshot}
//                 ownerUser={profileUser}
//               />
//             ))
//           }
//         />
//       </div>
//     </AuthenticatedUserProvider>
//   );
// };

// ExplorePage.path = '/explore';
