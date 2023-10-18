import { rollup } from 'rollup';
import { JSDOM } from 'jsdom';
import {
  Info,
  VizId,
  Snapshot,
  Content,
  READ,
  WRITE,
} from 'entities';
import { VerifyVizAccess } from 'interactors';
import { getFileText } from '../../accessors/getFileText';
import { VizPage, VizPageData } from './index';
import { renderREADME } from './renderREADME';
import { setJSDOM } from './v2Runtime/getComputedIndexHtml';
import { computeSrcDocV2 } from './v2Runtime/computeSrcDocV2';
import { computeSrcDocV3 } from './v3Runtime/computeSrcDocV3';
import { getRuntimeVersion } from '../../accessors/getRuntimeVersion';
import { build } from './v3Runtime/build';
import { toV3RuntimeFiles } from './v3Runtime/toV3RuntimeFiles';
import { getAuthenticatedUser } from '../getAuthenticatedUser';

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
    const verifyVizReadAccessResult = await verifyVizAccess(
      {
        authenticatedUserId,
        info,
        action: READ,
      },
    );
    if (verifyVizReadAccessResult.outcome === 'failure') {
      console.log('Error when verifying viz access:');
      console.log(verifyVizReadAccessResult.error);
      return null;
    }
    if (!verifyVizReadAccessResult.value) {
      // console.log('User does not have read access to viz');
      return null;
    }

    // Access control: Verify that the user has write access to the viz.
    // This is used to determine whether to show the "Settings" button.
    // TODO refactor verifyVizAccess to check multiple actions at once.
    const verifyVizWriteAccessResult =
      await verifyVizAccess({
        authenticatedUserId,
        info,
        action: WRITE,
      });
    if (verifyVizWriteAccessResult.outcome === 'failure') {
      console.log('Error when verifying viz access:');
      console.log(verifyVizWriteAccessResult.error);
      return null;
    }
    const canUserEditViz: boolean =
      verifyVizWriteAccessResult.value;

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

    // `runtimeVersion` is used to determine which runtime
    // to use. It's either 2 or 3.
    const runtimeVersion: number =
      getRuntimeVersion(content);

    const initialSrcdoc =
      runtimeVersion === 2
        ? await computeSrcDocV2(content)
        : await computeSrcDocV3(
            await build({
              files: toV3RuntimeFiles(content.files),
              enableSourcemap: true,
              rollup,
            }),
          );

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
      canUserEditViz,
    };
  } catch (e) {
    console.log('error fetching viz with id ', id);
    console.log(e);
    return null;
  }
};

export { VizPage };
