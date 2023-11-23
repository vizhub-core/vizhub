import {
  Info,
  VizId,
  Snapshot,
  Content,
  READ,
  WRITE,
} from 'entities';
import { rollup } from 'rollup';
import { JSDOM } from 'jsdom';
import { VerifyVizAccess } from 'interactors';
import { getFileText } from 'entities/src/accessors/getFileText';
import { VizPage, VizPageData } from './index';
import { renderREADME } from './renderREADME';
import { getAuthenticatedUser } from '../getAuthenticatedUser';
import { VizAccess } from 'interactors/src/verifyVizAccess';
import { Result } from 'gateways';
import { computeSrcDoc, setJSDOM } from 'runtime';

setJSDOM(JSDOM);

// TODO move the data fetching part of this to a separate file - interactors/getVizPageData.ts
// This file should mainly deal with computations like rendering the README and
// computing the srcdoc for the iframe.
VizPage.getPageData = async ({
  gateways,
  params,
  auth0User,
}): Promise<VizPageData> => {
  const id: VizId = params.id;
  const { getUser, getInfo, getContent } = gateways;
  const verifyVizAccess = VerifyVizAccess(gateways);

  try {
    // Get the Info entity of the Viz.
    const infoResult = await getInfo(id);
    if (infoResult.outcome === 'failure') {
      // Indicates viz not found
      return null;
    }
    const infoSnapshot: Snapshot<Info> = infoResult.value;
    const info: Info = infoSnapshot.data;
    const { title, owner, forkedFrom } = info;
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
        actions: [READ, WRITE],
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

    // Access control: Verify that the user has write access to the viz.
    // This is used to determine whether to show the "Settings" button.
    const canUserEditViz: boolean = vizAccess[WRITE];

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

    // Compute srcdoc for iframe.
    // TODO cache it per commit.

    const { initialSrcdoc, initialSrcdocError } =
      await computeSrcDoc({ rollup, content });

    return {
      infoSnapshot,
      contentSnapshot,
      ownerUserSnapshot,
      forkedFromInfoSnapshot,
      forkedFromOwnerUserSnapshot,
      title,
      authenticatedUserSnapshot,
      initialReadmeHTML,
      initialSrcdoc,
      initialSrcdocError,
      canUserEditViz,
    };
  } catch (e) {
    console.log('error fetching viz with id ', id);
    console.log(e);
    return null;
  }
};

export { VizPage };
