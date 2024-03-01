import { SectionId } from 'entities';
import { useCallback } from 'react';

// One section of the sidebar
export const SidebarSection = ({
  sectionId,
  SVGComponent,
  label,
  isActive,
  setSectionId,
}: {
  sectionId: SectionId;
  SVGComponent: React.FunctionComponent;
  label: string;
  isActive: boolean;
  setSectionId: (sectionId: SectionId) => void;
}) => {
  const handleClick = useCallback(() => {
    setSectionId(sectionId);
  }, [setSectionId, sectionId]);

  return (
    <div
      className={`profile-sidebar-section vh-base-01 ${
        isActive ? 'active' : ''
      }`}
      onClick={handleClick}
    >
      <SVGComponent /> {label}
    </div>
  );
};
