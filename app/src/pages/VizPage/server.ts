import { GetViz } from 'interactors';
import { Info, VizId, Snapshot } from 'entities';
import { JSDOM } from 'jsdom';
import { parseAuth0Sub } from '../../parseAuth0User';
import { getFileText } from '../../accessors/getFileText';
import { VizPage, VizPageData } from './index';
import { renderREADME } from './renderREADME';
import { setJSDOM } from './V2Runtime/getComputedIndexHtml';
import { computeSrcDoc } from './V2Runtime/computeSrcDoc';

setJSDOM(JSDOM);

VizPage.getPageData = async ({
  gateways,
  params,
  auth0User,
}): Promise<VizPageData> => {
  const id: VizId = params.id;
  const { getUser, getInfo } = gateways;
  const getViz = GetViz(gateways);

  // Get the Info and Content entities that comprise the Viz.
  try {
    const vizResult = await getViz(id);
    if (vizResult.outcome === 'failure') {
      // Indicates viz not found
      return null;
    }

    const { infoSnapshot, contentSnapshot, info } = vizResult.value;
    const { title, owner, forkedFrom } = info;

    // Get the User entity for the owner of the viz.
    const ownerUserResult = await getUser(owner);
    if (ownerUserResult.outcome === 'failure') {
      console.log('Error when fetching owner user:');
      console.log(ownerUserResult.error);
      return null;
    }
    const ownerUserSnapshot = ownerUserResult.value;

    // If the user is currently authenticated...
    let authenticatedUserSnapshot = null;
    if (auth0User) {
      const authenticatedUserId = parseAuth0Sub(auth0User.sub);

      // Get the User entity for the currently authenticated user.
      // TODO batch this together so we make only one query against User collection
      // e.g. const getUsersResult = await getUsers([owner,authenticatedUserId,forkedFromOwner]);

      const authenticatedUserResult = await getUser(authenticatedUserId);
      if (authenticatedUserResult.outcome === 'failure') {
        console.log('Error when fetching authenticated user:');
        console.log(authenticatedUserResult.error);
        return null;
      }
      authenticatedUserSnapshot = authenticatedUserResult.value;
    }

    // Render Markdown server-side.
    // TODO cache it per commit.
    const content = contentSnapshot.data;
    const initialReadmeHTML = renderREADME(getFileText(content, 'README.md'));

    let forkedFromInfoSnapshot: Snapshot<Info> = null;
    let forkedFromOwnerUserSnapshot = null;
    if (forkedFrom) {
      // Get the Info entity for the viz that this viz was forked from.
      const forkedFromInfoResult = await getInfo(forkedFrom);
      if (forkedFromInfoResult.outcome === 'failure') {
        console.log('Error when fetching owner user for forked from:');
        console.log(forkedFromInfoResult.error);
        return null;
      }
      forkedFromInfoSnapshot = forkedFromInfoResult.value;

      // Get the User entity for the owner of the viz that this viz was forked from.
      const forkedFromOwnerUserResult = await getUser(
        forkedFromInfoSnapshot.data.owner,
      );
      if (forkedFromOwnerUserResult.outcome === 'failure') {
        console.log('Error when fetching owner user for forked from:');
        console.log(forkedFromOwnerUserResult.error);
        return null;
      }
      forkedFromOwnerUserSnapshot = forkedFromOwnerUserResult.value;
    }

    // Compute srcdoc for iframe using `computeSrcDoc` function.
    // TODO cache it per commit.
    const initialSrcdoc = await computeSrcDoc(content);

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
    };
  } catch (e) {
    console.log('error fetching viz with id ', id);
    console.log(e);
    return null;
  }
};

export { VizPage };
