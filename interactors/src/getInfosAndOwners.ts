import {
  Gateways,
  Result,
  err,
  ok,
  pageSize as defaultPageSize,
} from 'gateways';
import {
  Info,
  UserId,
  SortId,
  User,
  getSortField,
  SortField,
  Snapshot,
  Visibility,
  SectionId,
  Upvote,
  CommitId,
} from 'entities';
import { accessDeniedError } from 'gateways/src/errors';
import { GetThumbnailURLs } from './getThumbnailURLs';
import { VizId } from '@vizhub/viz-types';

const debug = false;

export type InfosAndOwners = {
  infoSnapshots: Array<Snapshot<Info>>;
  ownerUserSnapshots: Array<Snapshot<User>>;
  hasMore: boolean;
  thumbnailURLs: Record<CommitId, string>;
};

// Maps section IDs to visibilities.
const visibilitiesBySection: {
  [key: string]: Array<Visibility> | null;
} = {
  public: ['public'],
  private: ['private'],
  unlisted: ['unlisted'],

  // We want to query against all visibilities
  // for the "Shared with me" section.
  shared: null,
};

export const GetInfosAndOwners = (gateways: Gateways) => {
  const { getInfos } = gateways;
  const getThumbnailURLs = GetThumbnailURLs(gateways);

  return async ({
    noNeedToFetchUsers,
    sectionId,
    sortId,
    defaultSortId = 'mostRecent',
    pageNumber,
    owner,
    forkedFrom,
    vizIds,
    authenticatedUserId,
    disablePagination,
    query,
    pageSize = defaultPageSize,
  }: {
    noNeedToFetchUsers: Array<UserId>;
    sectionId?: SectionId;
    sortId?: SortId;
    defaultSortId?: SortId;

    // Must be defined if disablePagination is false.
    pageNumber?: number;

    owner?: UserId;
    forkedFrom?: VizId;
    vizIds?: Array<VizId>;
    authenticatedUserId?: UserId;
    disablePagination?: boolean;

    // This is the search query entered by the user
    // in the search box.
    query?: string;
    pageSize?: number;
  }): Promise<Result<InfosAndOwners>> => {
    // Get the sort field from the sort query parameter.
    const sortField: SortField = getSortField(
      sortId,
      defaultSortId,
    );

    // Verify that the authenticaed user is the profile owner when
    // attempting to access private, unlisted, and shared-with-me infos.
    if (
      (sectionId === 'private' ||
        sectionId === 'shared' ||
        sectionId === 'unlisted') &&
      authenticatedUserId !== owner
    ) {
      return err(
        accessDeniedError(
          `Can't access someone else's ${sectionId} vizzes.`,
        ),
      );
    }

    const visibilities: Array<Visibility> | null =
      visibilitiesBySection[sectionId] ||
      visibilitiesBySection.public;

    const getInfosOptions = {
      owner,
      forkedFrom,
      sortField,
      pageNumber,
      vizIds,
      visibilities,
      disablePagination,
      query,
      pageSize,
    };

    // Handle the "Shared with me" section.
    if (sectionId === 'shared') {
      if (debug) {
        console.log(
          '[GetInfosAndOwners] handling shared with me',
        );
      }
      // The "owner" that we pass to getInfos() is the
      // authenticated user, because we want to get the
      // infos that have been shared with them.
      // They are not actually the owner of the vizzes,
      // so we delete the owner property from the options.
      delete getInfosOptions.owner;

      // Figure out which vizzes have been shared with the
      // authenticated user.
      const permissionsResult =
        await gateways.getPermissions(
          authenticatedUserId,
          null,
        );
      if (permissionsResult.outcome === 'failure') {
        return permissionsResult;
      }
      const permissions = permissionsResult.value.map(
        (snapshot) => snapshot.data,
      );

      if (debug) {
        console.log(
          '[GetInfosAndOwners] permissions',
          permissions,
        );
      }

      // Deduplicate sharedVizIds, just in case
      const sharedVizIds = new Set(
        permissions.map(
          (permission) => permission.resource,
        ),
      );
      getInfosOptions.vizIds = Array.from(sharedVizIds);
      if (debug) {
        console.log(
          '[GetInfosAndOwners] getInfosOptions',
          getInfosOptions,
        );
      }
    }

    // Handle the "Starred vizzes" section.
    if (sectionId === 'starred') {
      if (debug) {
        console.log('[GetInfosAndOwners] handling starred');
      }

      // Figure out which vizzes have been starred by the
      // profile owner user.
      const upvoteResult = await gateways.getUpvotes(
        getInfosOptions.owner,
        null,
      );
      if (upvoteResult.outcome === 'failure') {
        return upvoteResult;
      }
      const upvotes = upvoteResult.value.map(
        (snapshot) => snapshot.data,
      );

      if (debug) {
        console.log('[GetInfosAndOwners] upvotes', upvotes);
      }

      // Deduplicate starredVizIds, just in case
      const starredVizIds = new Set<VizId>(
        upvotes.map((upvote: Upvote) => upvote.viz),
      );
      getInfosOptions.vizIds = Array.from(starredVizIds);

      // The "owner" that we pass to getInfos() is the
      // authenticated user, because we want to get the
      // infos that have been shared with them.
      // They are not actually the owner of the vizzes,
      // so we delete the owner property from the options.
      delete getInfosOptions.owner;
    }

    const infoSnapshotsResult =
      await getInfos(getInfosOptions);
    if (infoSnapshotsResult.outcome === 'failure')
      return infoSnapshotsResult;
    let infoSnapshots = infoSnapshotsResult.value;

    if (debug) {
      console.log(
        '[GetInfosAndOwners] infoSnapshots',
        JSON.stringify(infoSnapshots, null, 2).slice(
          0,
          1000,
        ),
      );
    }

    // Figure out the set of unique users that are owners of these infos.
    const ownerUsers: Array<UserId> = Array.from(
      new Set(
        infoSnapshots.map(
          (snapshot) => snapshot.data.owner,
        ),
      ),
    );

    // Remove any users that we don't need to fetch.
    const noNeedToFetchUsersSet =
      // For the "Shared with me" section, we always need
      // to fetch the users, because we need to know if
      // they are on the premium plan.
      sectionId === 'shared'
        ? new Set()
        : new Set(noNeedToFetchUsers);
    const ownerUsersToFetch = ownerUsers.filter(
      (ownerUser) => !noNeedToFetchUsersSet.has(ownerUser),
    );

    if (debug) {
      console.log(
        '[GetInfosAndOwners] ownerUsers',
        ownerUsersToFetch,
      );
      console.log(
        '[GetInfosAndOwners] ownerUsersToFetch',
        ownerUsersToFetch,
      );
    }

    // Fetch the user snapshots for these owners.
    const ownerUserSnapshotsResult =
      await gateways.getUsersByIds(ownerUsersToFetch);
    if (ownerUserSnapshotsResult.outcome === 'failure')
      return ownerUserSnapshotsResult;
    const ownerUserSnapshots =
      ownerUserSnapshotsResult.value;

    //  Don't show shared private vizzes with collaborators
    // if their owner is not on the premium plan.
    if (sectionId === 'shared') {
      const ownerMap = ownerUserSnapshots.reduce(
        (acc, snapshot) => {
          acc[snapshot.data.id] = snapshot.data;
          return acc;
        },
        {},
      );
      infoSnapshots = infoSnapshots.filter(
        (infoSnapshot) => {
          const info: Info = infoSnapshot.data;
          const ownerUser = ownerMap[info.owner];
          // Should never happen
          if (!ownerUser) {
            throw new Error(
              'Owner user snapshot not found',
            );
          }
          if (
            info.visibility === 'private' &&
            ownerUser.plan === 'free'
          ) {
            return false;
          }
          return true;
        },
      );
    }

    const { thumbnailURLs, generateAndSaveNewImageKeys } =
      await getThumbnailURLs(
        infoSnapshots.map((snapshot) => snapshot.data.end),
      );

    // Kick off this process in the background.
    // We don't await it because it's not critical to the page load.
    // The new thumbnails will populated on next refresh.
    generateAndSaveNewImageKeys();

    return ok({
      infoSnapshots,
      ownerUserSnapshots,
      hasMore: infoSnapshots.length === pageSize,
      thumbnailURLs,
    });
  };
};
