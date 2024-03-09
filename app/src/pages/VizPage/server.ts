import {
  Info,
  VizId,
  Snapshot,
  Content,
  READ,
  WRITE,
  DELETE,
  Permission,
  User,
  defaultVizWidth,
  UpvoteId,
  getVizThumbnailURL,
  absoluteURL,
  Comment,
} from 'entities';
import { JSDOM } from 'jsdom';
import {
  BuildViz,
  CommitViz,
  GetInfoByIdOrSlug,
  ScoreStaleVizzes,
  VerifyVizAccess,
  generateUpvoteId,
} from 'interactors';
import { getFileText } from 'entities/src/accessors/getFileText';
import { VizPage } from './index';
import { renderREADME } from './renderREADME';
import { getAuthenticatedUser } from '../getAuthenticatedUser';
import { VizAccess } from 'interactors/src/verifyVizAccess';
import { Result } from 'gateways';
import { setJSDOM } from 'runtime';
import { VizPageData } from './VizPageData';

setJSDOM(JSDOM);

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
  } = gateways;
  const verifyVizAccess = VerifyVizAccess(gateways);
  const commitViz = CommitViz(gateways);
  const scoreStaleVizzes = ScoreStaleVizzes(gateways);
  const getInfoByIdOrSlug = GetInfoByIdOrSlug(gateways);
  const buildViz = BuildViz(gateways);

  // TODO move all this into an interactor called
  // getVizPageData or something like that.
  try {
    const idOrSlug: VizId | string = params.idOrSlug;
    const ownerUserName: string = params.userName;

    // Get the User entity for the owner of the viz.
    const ownerUserResult =
      await getUserByUserName(ownerUserName);
    if (ownerUserResult.outcome === 'failure') {
      console.log('Error when fetching owner user:');
      console.log(ownerUserResult.error);
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

    // If the viz is not committed, then commit it.
    if (!info.committed) {
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
        console.log('Error when committing viz:');
        console.log(commitVizResult.error);
      } else {
        info = commitVizResult.value;
      }
    }
    const { title, owner, forkedFrom, end } = info;

    const isEmbedMode = query.mode === 'embed';

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
    const contentResult = await getContent(id);

    if (contentResult.outcome === 'failure') {
      // This shouold never happen - if the info is there
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
    const contentSnapshot: Snapshot<Content> =
      contentResult.value;
    const content: Content = contentSnapshot.data;

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
    const {
      initialSrcdoc,
      initialSrcdocError,
      vizCacheContentSnapshots,
      slugResolutionCache,
    } = await buildViz({
      id,
      infoSnapshot,
      contentSnapshot,
      authenticatedUserId,
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
    const image = absoluteURL(
      getVizThumbnailURL(end, defaultVizWidth),
    );

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
    const initialComments: Array<Snapshot<Comment>> =
      initialCommentsResult.value;
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

    scoreStaleVizzes();

    return {
      infoSnapshot,
      ownerUserSnapshot,
      forkedFromInfoSnapshot,
      forkedFromOwnerUserSnapshot,
      title,
      image,
      authenticatedUserSnapshot,
      initialReadmeHTML,
      canUserEditViz,
      canUserDeleteViz,
      initialSrcdoc,
      initialSrcdocError,
      vizCacheContentSnapshots,
      slugResolutionCache,
      initialCollaborators,
      initialIsUpvoted,
      initialComments,
      initialCommentAuthors,
    };
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
