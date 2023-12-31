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
} from 'entities';
import { rollup } from 'rollup';
import { JSDOM } from 'jsdom';
import { CommitViz, VerifyVizAccess } from 'interactors';
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
  const id: VizId = params.id;
  const {
    getUser,
    getInfo,
    getContent,
    getPermissions,
    getUsersByIds,
  } = gateways;
  const verifyVizAccess = VerifyVizAccess(gateways);
  const commitViz = CommitViz(gateways);

  // TODO move all this into an interactor called
  // getVizPageData or something like that.
  try {
    // Get the Info entity of the Viz.
    let infoResult = await getInfo(id);
    if (infoResult.outcome === 'failure') {
      // Indicates viz not found
      return null;
    }
    let infoSnapshot: Snapshot<Info> = infoResult.value;
    let info: Info = infoSnapshot.data;

    const {
      authenticatedUserId,
      authenticatedUserSnapshot,
    } = await getAuthenticatedUser({
      gateways,
      auth0User,
    });

    // Access control: Verify that the user has read access to the viz.
    const verifyVizReadAccessResult: Result<VizAccess> =
      await verifyVizAccess({
        authenticatedUserId,
        info,
        actions: [READ, WRITE, DELETE],
      });
    if (verifyVizReadAccessResult.outcome === 'failure') {
      console.log('Error when verifying viz access:');
      console.log(verifyVizReadAccessResult.error);
      return null;
    }
    const vizAccess: VizAccess =
      verifyVizReadAccessResult.value;

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
    const { title, owner, forkedFrom } = info;

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

    // Get the User entity for the owner of the viz.
    const ownerUserResult = await getUser(owner);
    if (ownerUserResult.outcome === 'failure') {
      console.log('Error when fetching owner user:');
      console.log(ownerUserResult.error);
      return null;
    }
    const ownerUserSnapshot = ownerUserResult.value;

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
      await computeSrcDoc({ rollup, content, vizCache });

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
    const image = getVizThumbnailURL(
      info.end,
      defaultVizWidth,
    );

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
    };
  } catch (e) {
    console.log('error fetching viz with id ', id);
    console.log(e);
    return null;
  }
};

export { VizPage };
