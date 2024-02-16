import { ForkSVG } from '../Icons/sam/ForkSVG';
import { OverlayTrigger, Tooltip } from '../bootstrap';
import './styles.scss';

export const ForksWidget = ({
  forksCount,
  forksPageHref = '',
  onClick = null,
  notClickable = false,
  isUserAuthenticated = false,
}) => (
  <div
    className={`vh-forks-widget${notClickable ? ' not-clickable' : ''}`}
  >
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip id="full-screen-icon-tooltip">
          {isUserAuthenticated
            ? 'Fork this viz'
            : 'Log in to fork this viz'}
        </Tooltip>
      }
    >
      <i
        className="icon-button icon-button-light"
        onClick={isUserAuthenticated ? onClick : null}
        style={{
          cursor: isUserAuthenticated
            ? 'pointer'
            : 'not-allowed',
        }}
      >
        <ForkSVG />
      </i>
    </OverlayTrigger>
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip id="full-screen-icon-tooltip">
          View Forks
        </Tooltip>
      }
    >
      <a
        className="icon-button icon-button-light"
        href={forksPageHref}
        target="_blank"
        rel="noopener noreferrer"
      >
        <strong>{forksCount}</strong>
        <div className="widget-label">
          Fork{forksCount === 1 ? '' : 's'}
        </div>
      </a>
    </OverlayTrigger>
  </div>
);

// import { useMemo } from 'react';
// import { ForkSVG } from '../Icons/sam/ForkSVG';
// import { commaFormat } from '../commaFormat';
// import './styles.scss';

// const enableForksWidget = true;

// export const ForksWidget = ({
//   forksCount,
//   onClick = null,
// }) => {
//   const forksCountFormatted = useMemo(
//     () => commaFormat(forksCount),
//     [forksCount],
//   );

//   return enableForksWidget ? (
//     <div className="vh-forks-widget">
//       <ForkSVG onClick={onClick} />
//       <strong>{forksCountFormatted}</strong>
//       <div className="widget-label">
//         Fork{forksCount === 1 ? '' : 's'}
//       </div>
//     </div>
//   ) : null;
// };
