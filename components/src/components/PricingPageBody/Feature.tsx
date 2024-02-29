import { useCallback, useState } from 'react';
import { GreenCheckSVG } from '../Icons/sam/GreenCheckSVG';
import { ChevronUpSVG } from '../Icons/sam/ChevronUpSVG';
import { ChevronDownSVG } from '../Icons/sam/ChevronDownSVG';

export const Feature = ({
  title,
  hasBottomBorder = false,
  heavyBottomBorder = false,
  startsExpanded = true,
  learnMoreHref = null,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(startsExpanded);

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
