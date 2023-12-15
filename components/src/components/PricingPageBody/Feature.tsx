import { useCallback, useState } from 'react';
import { GreenCheckSVG } from '../Icons/sam/GreenCheckSVG';
import { ChevronUpSVG } from '../Icons/sam/ChevronUpSVG';
import { ChevronDownSVG } from '../Icons/sam/ChevronDownSVG';

export const Feature = ({
  title,
  description,
  hasBottomBorder,
  startsExpanded = false,
}) => {
  const [isOpen, setIsOpen] = useState(startsExpanded);

  const toggleIsOpen = useCallback(() => {
    setIsOpen((isOpen) => !isOpen);
  }, []);
  return (
    <div
      className={`feature${
        hasBottomBorder ? ' has-bottom-border' : ''
      }`}
      onClick={toggleIsOpen}
    >
      <div className="feature-header">
        <div className="feature-title">
          <GreenCheckSVG />
          {title}
        </div>
        <div className="feature-toggle">
          {isOpen ? <ChevronUpSVG /> : <ChevronDownSVG />}
        </div>
      </div>
      {isOpen && (
        <div className="feature-description">
          {description}
        </div>
      )}
    </div>
  );
};
