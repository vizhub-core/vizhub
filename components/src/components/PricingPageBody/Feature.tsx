import { useCallback, useContext, useState } from 'react';
import { GreenCheckSVG } from '../Icons/sam/GreenCheckSVG';
import { ChevronUpSVG } from '../Icons/sam/ChevronUpSVG';
import { ChevronDownSVG } from '../Icons/sam/ChevronDownSVG';
import { FeatureId } from 'entities';
import { HighlightedFeatureContext } from './HighlightedFeatureContext';

export const Feature = ({
  title,
  id,
  hasBottomBorder = false,
  heavyBottomBorder = false,
  learnMoreHref = null,
  children,
}: {
  title: string;
  id: FeatureId;
  hasBottomBorder?: boolean;
  heavyBottomBorder?: boolean;
  learnMoreHref?: string | null;
  children: React.ReactNode;
}) => {
  const { highlightedFeature } = useContext(
    HighlightedFeatureContext,
  );

  const [isOpen, setIsOpen] = useState(
    highlightedFeature === id,
  );

  const toggleIsOpen = useCallback(() => {
    setIsOpen((isOpen) => !isOpen);
  }, []);
  return (
    <div
      className={`feature${
        hasBottomBorder
          ? ` ${
              heavyBottomBorder ? 'heavy' : 'light'
            }-bottom-border`
          : ''
      }`}
      id={id}
    >
      <div
        className="feature-header"
        onClick={toggleIsOpen}
      >
        <div className="feature-title">
          <GreenCheckSVG />
          {title}
        </div>
        <div className="feature-toggle">
          {isOpen ? <ChevronUpSVG /> : <ChevronDownSVG />}
        </div>
      </div>
      {isOpen && (
        <>
          <div className="feature-description">
            {children}
          </div>
          {learnMoreHref && (
            <a
              className="feature-learn-more-link"
              href={learnMoreHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more
            </a>
          )}
        </>
      )}
    </div>
  );
};
