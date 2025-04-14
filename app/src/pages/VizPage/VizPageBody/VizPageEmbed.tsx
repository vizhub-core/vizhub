import { FC } from 'react';
import { LogoSVG } from 'components/src/components/Icons/LogoSVG';
import { getVizPageHref } from '../../../accessors';

interface VizPageEmbedProps {
  renderVizRunner: () => JSX.Element | null;
  isEmbedBranded: boolean;
  ownerUser: any;
  info: any;
}

export const VizPageEmbed: FC<VizPageEmbedProps> = ({
  renderVizRunner,
  isEmbedBranded,
  ownerUser,
  info,
}) => (
  <>
    {renderVizRunner()}
    {isEmbedBranded && (
      <a
        href={getVizPageHref({
          ownerUser,
          info,
          absolute: true,
        })}
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
        }}
      >
        <LogoSVG />
      </a>
    )}
  </>
);
