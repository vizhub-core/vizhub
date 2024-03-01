// Various sections of the profile page.

export type SectionId =
  | 'public'
  | 'private'
  | 'orgs'
  | 'starred'
  | 'shared'
  | 'apiKeys'
  | 'notifications';

export const defaultSectionId: SectionId = 'public';

const sectionIdsSet = new Set<SectionId>([
  'public',
  'private',
  'orgs',
  'starred',
  'shared',
]);

// Convenience function for validating section id.
export const asSectionId = (
  sectionId: string,
): SectionId | null =>
  sectionIdsSet.has(sectionId as SectionId)
    ? (sectionId as SectionId)
    : null;
