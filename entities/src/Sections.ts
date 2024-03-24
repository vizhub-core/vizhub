// Various sections of the profile page.

export enum SectionId {
  Public = 'public',
  Private = 'private',
  Orgs = 'orgs',
  Starred = 'starred',
  Shared = 'shared',
  ApiKeys = 'api-keys',
  Notifications = 'notifications',
}

export const defaultSectionId: SectionId = SectionId.Public;

const sectionIdsSet = new Set<SectionId>(
  Object.values(SectionId),
);

// Convenience function for validating section id.
export const asSectionId = (
  sectionId: string,
): SectionId | null =>
  sectionIdsSet.has(sectionId as SectionId)
    ? (sectionId as SectionId)
    : null;
