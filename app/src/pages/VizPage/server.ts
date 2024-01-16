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
} from 'entities';
import { rollup } from 'rollup';
import { JSDOM } from 'jsdom';
import {
  CommitViz,
  GetInfoByIdOrSlug,
  ResolveSlug,
  ScoreStaleVizzes,
  VerifyVizAccess,
  generateUpvoteId,
} from 'interactors';
import { getFileText } from 'entities/src/accessors/getFileText';
import { VizPage, VizPageData } from './index';
import { renderREADME } from './renderREADME';
import { getAuthenticatedUser } from '../getAuthenticatedUser';
import { VizAccess } from 'interactors/src/verifyVizAccess';
import { Result } from 'gateways';
import { computeSrcDoc, setJSDOM } from 'runtime';
import {
  VizCache,
  createVizCache,
} from 'runtime/src/v3Runtime/vizCache';
import { getVizThumbnailURL } from '../../accessors';
import { absoluteURL } from '../../seoMetaTags';

setJSDOM(JSDOM);

const debug = false;

// TODO move the data fetching part of this to a separate file - interactors/getVizPageData.ts
// This file should mainly deal with computations like rendering the README and
// computing the srcdoc for the iframe.
VizPage.getPageData = async ({
  gateways,
  params,
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
  } = gateways;
  const verifyVizAccess = VerifyVizAccess(gateways);
  const commitViz = CommitViz(gateways);
  const scoreStaleVizzes = ScoreStaleVizzes(gateways);
  const getInfoByIdOrSlug = GetInfoByIdOrSlug(gateways);

  // A cache for resolving slugs to viz IDs.
  // Keys are of the form `${userName}/${slug}`.
  const slugResolutionCache: Record<string, VizId> = {};

  const resolveSlug = ResolveSlug(
    gateways,
    slugResolutionCache,
  );

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
    let infoResult = await getInfoByIdOrSlug({
      userId,
      idOrSlug,
    });
    if (infoResult.outcome === 'failure') {
      // Indicates viz not found
      return null;
    }
    let infoSnapshot: Snapshot<Info> = infoResult.value;
    let info: Info = infoSnapshot.data;
    const id = info.id;

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

    if (!vizAccess[READ]) {
      // console.log('User does not have read access to viz');
      return null;
    }

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

    // If the viz has a slug, and we are using its id in the URL,
    // then redirect to the URL that uses the slug.
    if (info.slug && idOrSlug !== info.slug) {
      const redirect = `/${params.userName}/${info.slug}`;
      // console.log(
      //   "Redirecting to viz's canonical URL:",
      //   redirect,
      // );
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

    // Access control: Verify that the user has write access to the viz.
    // This is used to determine whether to show the "Settings" button.
    const canUserEditViz: boolean = vizAccess[WRITE];

    // Access control: Verify that the user has delete access to the viz.
    // This is used to determine whether to show the "Delete" button.
    const canUserDeleteViz: boolean = vizAccess[DELETE];

    // If we're here, then the user has read access to the viz,
    // so it's worth fetching the content.
    const contentResult = await getContent(id);

    if (contentResult.outcome === 'failure') {
      // This shouold never happen - if the info is there
      // then the content should be there too,
      // unless it's frozen.
      console.log(
        "Error when fetching viz's content (info is defined but not content):",
      );
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
      // Get the Info entity for the viz that this viz was forked from.
      const forkedFromInfoResult =
        await getInfo(forkedFrom);
      if (forkedFromInfoResult.outcome === 'failure') {
        console.log(
          'Error when fetching owner user for forked from:',
        );
        console.log(forkedFromInfoResult.error);
        return null;
      }
      forkedFromInfoSnapshot = forkedFromInfoResult.value;

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

    // Content snapshots for client-side hydration
    // using ShareDB's ingestSnapshot API.
    const vizCacheContentSnapshots: Record<
      VizId,
      Snapshot<Content>
    > = { [id]: contentSnapshot };

    const vizCache: VizCache = createVizCache({
      initialContents: [content],
      handleCacheMiss: async (vizId: VizId) => {
        // Verify that the user has access to the imported viz.
        const getImportedInfoResult = await getInfo(vizId);
        if (getImportedInfoResult.outcome === 'failure') {
          console.log(
            'Error when fetching imported viz info:',
          );
          console.log(getImportedInfoResult.error);
          throw new Error(
            'Error when fetching imported viz info',
          );
        }

        const importedInfo: Info =
          getImportedInfoResult.value.data;
        const verifyImportedVizReadAccessResult: Result<VizAccess> =
          await verifyVizAccess({
            authenticatedUserId,
            info: importedInfo,
            actions: [READ],
          });
        if (
          verifyImportedVizReadAccessResult.outcome ===
          'failure'
        ) {
          console.log('Error when verifying viz access:');
          console.log(
            verifyImportedVizReadAccessResult.error,
          );
          throw new Error(
            'Error when verifying viz access',
          );
        }
        const importedVizAccess: VizAccess =
          verifyVizAccessResult.value;

        if (!importedVizAccess[READ]) {
          console.log(
            'User does not have read access to viz',
          );
          throw new Error(
            'User does not have read access to imported viz',
          );
        }

        if (debug) {
          console.log(
            'Handling cache miss for vizId',
            vizId,
          );
        }
        const contentResult = await getContent(vizId);
        if (contentResult.outcome === 'failure') {
          console.log(
            'Error when fetching content for viz cache:',
          );
          console.log(contentResult.error);
          return null;
        }

        // Store the content snapshot to support
        // client-side hydration using ShareDB's ingestSnapshot API.
        vizCacheContentSnapshots[vizId] =
          contentResult.value;

        if (debug) {
          console.log('Fetched content for viz cache');
          console.log(contentResult.value.data);
        }
        return contentResult.value.data;
      },
    });

    // Compute srcdoc for iframe.
    // TODO cache it per commit.
    const { initialSrcdoc, initialSrcdocError } =
      await computeSrcDoc({
        rollup,
        content,
        vizCache,
        resolveSlug,
      });

    if (debug) {
      console.log('initialSrcdoc');
      console.log(initialSrcdoc.substring(0, 200));
    }

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
      initialSrcdoc,
      initialSrcdocError,
      canUserEditViz,
      canUserDeleteViz,
      vizCacheContentSnapshots,
      initialCollaborators,
      initialIsUpvoted,
      slugResolutionCache,
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
