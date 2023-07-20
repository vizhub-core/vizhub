// import { VizPageHead } from '../VizPageHead';
// import { VizPageViewer } from '../VizPageViewer';
// import { VizPageSidebar } from '../VizPageSidebar';

// import './styles.scss';

// export const VizPageBody = ({
//   // For VizPageHead
//   showEditor,
//   setShowEditor,
//   onExportClick,
//   onShareClick,
//   onForkClick,

//   // For VizPageViewer

//   vizTitle,
//   vizHeight,
//   renderVizRunner,
//   renderMarkdownHTML,
// }) => {
//   return (
//     <div className="vh-viz-page-body">
//       <VizPageHead
//         showEditor={showEditor}
//         setShowEditor={setShowEditor}
//         onExportClick={onExportClick}
//         onShareClick={onShareClick}
//         onForkClick={onForkClick}
//       />
//       <div className="split-pane">
//         {showEditor ? <VizPageSidebar /> : null}
//         <VizPageViewer
//           vizTitle={vizTitle}
//           vizHeight={vizHeight}
//           renderVizRunner={renderVizRunner}
//           renderMarkdownHTML={renderMarkdownHTML}
//         />
//       </div>
//     </div>
//   );
// };
