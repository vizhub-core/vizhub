import {
  Info,
  Snapshot,
  READ,
  WRITE,
  DELETE,
  Permission,
  User,
  defaultVizWidth,
  UpvoteId,
  Comment,
  CommitId,
  CommitMetadata,
  Commit,
} from 'entities';
import {
  BuildViz,
  CommitViz,
  GetContentAtCommit,
  GetInfoByIdOrSlug,
  ScoreStaleVizzes,
  VerifyVizAccess,
  generateUpvoteId,
} from 'interactors';
import { getFileText } from 'entities/src/accessors/getFileText';
import { VizPage } from './index';
import { renderREADME } from './renderREADME';
import { getAuthenticatedUser } from '../getAuthenticatedUser';
import { getVizKeywords } from '../../seoUtils';
import { VizAccess } from 'interactors/src/verifyVizAccess';
import { Result } from 'gateways';
import { VizPageData } from './VizPageData';
import { GetThumbnailURLs } from 'interactors/src/getThumbnailURLs';
import { VizContent, VizId } from '@vizhub/viz-types';

const debug = false;

// TODO move the data fetching part of this to a separate file - interactors/getVizPageData.ts
// This file should mainly deal with computations like rendering the README and
// computing the srcdoc for the iframe.
VizPage.getPageData = async ({
  gateways,
  params,
  query,
  auth0User,
}): Promise<VizPageData> => {
  const {
    getUser,
    getUserByUserName,
    getInfo,
    getContent,
    getPermissions,
    getUsersByIds,
    getUpvote,
    deleteInfo,
    getCommit,
  } = gateways;
  const verifyVizAccess = VerifyVizAccess(gateways);
  const commitViz = CommitViz(gateways);
  const scoreStaleVizzes = ScoreStaleVizzes(gateways);
  const getInfoByIdOrSlug = GetInfoByIdOrSlug(gateways);
  const buildViz = BuildViz(gateways);
  const getContentAtCommit = GetContentAtCommit(gateways);
  const getThumbnailURLs = GetThumbnailURLs(gateways);

  // TODO move all this into an interactor called
  // getVizPageData or something like that.
  try {
    const idOrSlug: VizId | string = params.idOrSlug;
    const ownerUserName: string = params.userName;

    // If this commitId is present, then we are looking at a specific commit.
    // This is when the URL looks like /:userName/:idOrSlug/:commitId.
    // One way users can end up at this page is by
    // using the revision history navigator.
    // This is usually undefined.
    const commitId: CommitId | undefined = params.commitId;

    // If `commitId` is present, then we need to fetch the commit metadata.
    let commitMetadata: CommitMetadata | undefined;
    if (commitId) {
      // Quick smoke test to validate the commit id
      const isValidCommitId = commitId.length === 32;
      if (!isValidCommitId) {
        return null;
      }
      const getCommitResult = await getCommit(commitId);
      if (getCommitResult.outcome === 'failure') {
        // console.log('Error when fetching commit:');
        // console.log(getCommitResult.error);
        return null;
      }
      const commit: Commit = getCommitResult.value;
      commitMetadata = {
        id: commitId,
        parent: commit.parent,
        timestamp: commit.timestamp,
        authors: commit.authors,
      };
    }

    // Get the User entity for the owner of the viz.
    const ownerUserResult =
      await getUserByUserName(ownerUserName);
    if (ownerUserResult.outcome === 'failure') {
      // console.log('Error when fetching owner user:');
      // console.log(ownerUserResult.error);
      return null;
    }
    const ownerUserSnapshot = ownerUserResult.value;
    const userId = ownerUserSnapshot.data.id;

    // Get the Info entity of the Viz.
    const infoResult = await getInfoByIdOrSlug({
      userId,
      idOrSlug,
    });
    if (infoResult.outcome === 'failure') {
      // Indicates viz not found
      return null;
    }
    const infoSnapshot: Snapshot<Info> = infoResult.value;
    let info: Info = infoSnapshot.data;
    const id: VizId = info.id;

    const {
      authenticatedUserId,
      authenticatedUserSnapshot,
    } = await getAuthenticatedUser({
      gateways,
      auth0User,
    });

    // Access control: Verify that the user has read access to the viz.
    const verifyVizAccessResult: Result<VizAccess> =
      await verifyVizAccess({
        authenticatedUserId,
        info,
        actions: [READ, WRITE, DELETE],
      });
    if (verifyVizAccessResult.outcome === 'failure') {
      console.log('Error when verifying viz access:');
      console.log(verifyVizAccessResult.error);
      return null;
    }
    const vizAccess: VizAccess =
      verifyVizAccessResult.value;

    // Access control: Verify that the user has read access to the viz.
    // If not, block access to the viz.
    if (!vizAccess[READ]) {
      // console.log('User does not have read access to viz');
      return null;
    }

    // Access control: Verify that the user has write access to the viz.
    // This is used to determine whether to show the "Settings" button.
    const canUserEditViz: boolean = vizAccess[WRITE];

    // Access control: Verify that the user has delete access to the viz.
    // This is used to determine whether to show the "Delete" button.
    const canUserDeleteViz: boolean = vizAccess[DELETE];

    // If the viz is not committed (!info.committed),
    // and we are not looking at an older version (!commitId),
    // then commit it.
    if (!info.committed && !commitId) {
      if (debug) {
        console.log(
          'Viz is not committed, committing it now',
        );
      }
      const commitVizResult = await commitViz(id);
      if (commitVizResult.outcome === 'failure') {
        // TODO handle this error better
        // Needs a refactor of the returned type
        // return err(commitVizResult.error);
        console.log(
          'Error when committing viz in Viz Page',
        );
        // console.log(commitVizResult.error);
      } else {
        info = commitVizResult.value;
      }
    }
    const { title, owner, forkedFrom, end } = info;

    const isEmbedMode = query.mode === 'embed';

    // Disable Analytics in embed mode,
    // so that we can say for certain that
    // no cookies are being set.
    const disableAnalytics = isEmbedMode;

    // If the viz has a slug, and we are using its id in the URL,
    // AND we are not in embed mode,
    // then redirect to the URL that uses the slug.
    if (
      !isEmbedMode &&
      info.slug &&
      idOrSlug !== info.slug
    ) {
      let redirect = `/${params.userName}/${info.slug}`;

      // Include any existing parameters in the redirect URL.
      // e.g. `?mode=embed`
      if (query) {
        redirect += `?${new URLSearchParams(query).toString()}`;
      }

      // @ts-ignore
      return { redirect };
    }

    // If the username from the URL does not match the owner of the viz,
    // then redirect to the URL that uses the owner's username.
    //  * `userId` comes from the URL (could be wrong)
    //  * `owner` comes from the Info in the database
    if (userId !== owner) {
      // Figure out the owner username.
      const getUserResult = await getUser(owner);
      if (getUserResult.outcome === 'failure') {
        // This should never happena
        console.log(
          'Unexpected error: owner user not found!',
        );
        return null;
      }
      const { userName } = getUserResult.value.data;
      const redirect = `/${userName}/${
        info.slug || info.id
      }`;
      // @ts-ignore
      return { redirect };
    }

    // If we're here, then the user has read access to the viz,
    // so it's worth fetching the content.
    // Now it's a question of which version of the content we need!
    let content: VizContent;
    let contentSnapshot: Snapshot<VizContent> | undefined;

    // If we are viewing the viz at a certain version,
    // then we get the content at that commit.
    if (commitId) {
      const getContentAtCommitResult =
        await getContentAtCommit(commitId);
      if (getContentAtCommitResult.outcome === 'failure') {
        console.log(
          'Error when fetching viz content at commit:',
        );
        console.log(getContentAtCommitResult.error);
        return null;
      }
      content = getContentAtCommitResult.value;
    } else {
      // In this case, we are viewing the latest version of the viz,
      // and we want to serve a ShareDB snapshot so the client can
      // set up the ShareDB document with real-time updates.

      const contentResult = await getContent(id);

      if (contentResult.outcome === 'failure') {
        // This should never happen - if the info is there
        // then the content should be there too.
        // TODO Handle vizzes that are "frozen" (not implemented yet).

        console.log(
          "Error when fetching viz's content (info is defined but not content):",
        );
        // Update 2024_03_08 this DOES happen sometimes due to a bug in the
        // forking interactor when the viz was attempted to be forked, but could
        // not be forked due to a size limit error. This happens when a user on
        // the free plan attempts to fork a large viz.
        // If we're here, what we really want to do is delete the info,
        // because it leads to no content and should not be there in the first place.
        console.log(
          "Deleting info because it has no content (it's a bug that it's there in the first place)",
        );
        const deleteResult = await deleteInfo(id);
        if (deleteResult.outcome === 'failure') {
          console.log(
            'Error when deleting info: ',
            deleteResult.error,
          );
        } else {
          console.log('Deleted info: ', deleteResult.value);
        }

        console.log(contentResult.error);
        return null;
      }
      contentSnapshot = contentResult.value;
      content = contentSnapshot.data;
    }

    // Render Markdown server-side.
    // TODO cache it per commit.
    const initialReadmeHTML = renderREADME(
      getFileText(content, 'README.md'),
    );

    let forkedFromInfoSnapshot: Snapshot<Info> = null;
    let forkedFromOwnerUserSnapshot = null;
    if (forkedFrom) {
      let needToFetchForkedFrom = true;
      let nextForkedFrom = forkedFrom;

      while (needToFetchForkedFrom) {
        // Get the Info entity for the viz that this viz was forked from.
        const forkedFromInfoResult =
          await getInfo(nextForkedFrom);
        if (forkedFromInfoResult.outcome === 'failure') {
          console.log(
            'Error when fetching owner user for forked from:',
          );
          console.log(forkedFromInfoResult.error);
          return null;
        }
        forkedFromInfoSnapshot = forkedFromInfoResult.value;
        const isForkedFromTrashed =
          forkedFromInfoSnapshot.data.trashed !== undefined;

        // Recursively trace the forkedFrom chain while the viz is "trashed".
        // This is to support the case where a viz is forked from a trashed viz,
        // and that trashed viz has not yet been permanently deleted.
        needToFetchForkedFrom = isForkedFromTrashed;
        if (needToFetchForkedFrom) {
          nextForkedFrom =
            forkedFromInfoSnapshot.data.forkedFrom;
        }
      }

      // Get the User entity for the owner of the viz that this viz was forked from.

      const forkedFromOwnerUserResult = await getUser(
        forkedFromInfoSnapshot.data.owner,
      );
      if (forkedFromOwnerUserResult.outcome === 'failure') {
        console.log(
          'Error when fetching owner user for forked from:',
        );
        console.log(forkedFromOwnerUserResult.error);
        return null;
      }
      forkedFromOwnerUserSnapshot =
        forkedFromOwnerUserResult.value;
    }

    // Build the viz!
    const buildVizResult = await buildViz({
      id,
      authenticatedUserId,
      ...(commitId
        ? // If we have a `commitId`, we are building the viz
          // as it was at that commit.
          {
            type: 'versioned',
            contentStatic: content,
            infoStatic: info,
            commitMetadata,
          }
        : // If we don't have a `commitId`, we are building the latest
          // version of the viz.
          {
            type: 'live',
            infoSnapshot,
            contentSnapshot,
          }),
    });

    // Get the collaborators on the viz.
    // TODO use a ShareDB query instead of fetching
    let initialCollaborators: Array<User> = [];
    const getPermissionsResult = await getPermissions(
      null,
      [id],
    );
    if (getPermissionsResult.outcome === 'failure') {
      console.log(
        'Error when fetching permissions for viz:',
      );
      console.log(getPermissionsResult.error);
      return null;
    }
    const permissions: Array<Permission> =
      getPermissionsResult.value.map(
        (snapshot) => snapshot.data,
      );
    if (permissions.length > 0) {
      const collaboratorsResult: Result<
        Array<Snapshot<User>>
      > = await getUsersByIds(
        permissions.map((permission) => permission.user),
      );
      if (collaboratorsResult.outcome === 'failure') {
        console.log(
          'Error when fetching collaborators for viz:',
        );
        console.log(collaboratorsResult.error);
        return null;
      }
      initialCollaborators = collaboratorsResult.value.map(
        (snapshot) => snapshot.data,
      );
    }

    // TODO unify user fetching into a single call
    // for all the users that we need to fetch, including
    //  * the owner
    //  * the forkedFrom owner
    //  * the collaborators

    // The unfurl image URL for the page.
    const { thumbnailURLs, fullResolutionURLs, generateAndSaveNewImageKeys } =
      await getThumbnailURLs([end], defaultVizWidth);
    const image = thumbnailURLs[end];
    const downloadImageHref = fullResolutionURLs[end];

    // Kick off this process in the background.
    // We don't await it because it's not critical to the page load.
    // The new thumbnails will populated on next refresh.
    generateAndSaveNewImageKeys();

    // Figure out if the authenticated user has upvoted the viz.
    let initialIsUpvoted: boolean = false;
    if (info.upvotesCount > 0 && authenticatedUserId) {
      const upvoteId: UpvoteId = generateUpvoteId(
        authenticatedUserId,
        id,
      );
      const upvoteResult = await getUpvote(upvoteId);
      if (upvoteResult.outcome === 'success') {
        initialIsUpvoted = true;
      }
    }

    // Get the comments on this viz.
    const initialCommentsResult =
      await gateways.getCommentsForResource(id);
    if (initialCommentsResult.outcome === 'failure') {
      console.log('Error when fetching comments for viz:');
      console.log(initialCommentsResult.error);
      return null;
    }

    // If we're looking at an older version,
    // only show the comments up until that timestamp.
    const initialComments: Array<Snapshot<Comment>> =
      commitMetadata
        ? initialCommentsResult.value.filter(
            (commentSnapshot) =>
              commentSnapshot.data.created <=
              commitMetadata.timestamp,
          )
        : initialCommentsResult.value;

    // Fetch authors for comments.
    const initialCommentAuthorsResult = await getUsersByIds(
      Array.from(
        new Set(
          initialComments.map(
            (comment) => comment.data.author,
          ),
        ),
      ),
    );
    if (initialCommentAuthorsResult.outcome === 'failure') {
      console.log(
        'Error when fetching comment authors for viz:',
      );
      console.log(initialCommentAuthorsResult.error);
      return null;
    }
    const initialCommentAuthors: Array<Snapshot<User>> =
      initialCommentAuthorsResult.value;

    // Score stale vizzes (small batch).
    scoreStaleVizzes();

    // Extract keywords from README.md for SEO
    const keywords = getVizKeywords(content);

    // Compose the data for the page.
    const vizPageData: VizPageData = {
      ownerUserSnapshot,
      forkedFromInfoSnapshot,
      forkedFromOwnerUserSnapshot,
      title,
      image,
      authenticatedUserSnapshot,
      initialReadmeHTML,
      canUserEditViz,
      canUserDeleteViz,
      initialCollaborators,
      initialIsUpvoted,
      initialComments,
      initialCommentAuthors,
      buildVizResult,
      downloadImageHref,
      disableAnalytics,
      keywords,
    };

    // If we are viewing a versioned page,
    // the presence of `commitMetadata` is our signal for that
    // on the client side.
    if (commitMetadata) {
      vizPageData.commitMetadata = commitMetadata;

      // In this case, we include the Info snapshot,
      // but modified to be similar to the way it was at the commit.
      //  - Show old title
      //  - Show old last updated date
      //  - Show old end commit (in revision history navigator)
      vizPageData.infoStatic = {
        ...info,

        // The title is versioned on the content
        title: content.title,

        // Set the last updated date
        // to the commit timestamp.
        updated: commitMetadata.timestamp,

        // Set the `end` commit to the commitId.
        end: commitMetadata.id,
      };
    } else {
      // Only if we are viewing a live page do we include the
      // Info snapshot.
      vizPageData.infoSnapshot = infoSnapshot;
    }

    return vizPageData;
  } catch (e) {
    console.log(
      'error fetching viz with idOrSlug',
      params.idOrSlug,
    );
    console.log(e);
    return null;
  }
};

export { VizPage };
