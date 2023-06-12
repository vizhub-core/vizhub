import marked from 'marked';
import xss from 'xss';
import { GetViz } from 'interactors';
import { VizId } from 'entities';
import { parseAuth0Sub } from '../../parseAuth0User';
import { VizPage } from './index';
import { renderREADME } from './renderREADME';
import { getFileText } from '../../accessors/getFileText';

// TODO render markdown server-side and cache it.
// const getInitialReadmeHTML = (content: Content) =>
//   import.meta.env.SSR
//     ? // If we're on the server,
//       // render Markdown synchronously.
//       renderREADME(
//         getFileText(content, 'README.md'),
//         // These dynamic imports should only be called on the server.
//         await import('marked'),
//         await import('filter-xss')
//       )
//     : // If we're in the client,
//       // grab the server-rendered HTML to use for initial hydration,
//       // before the Web Worker that renders Markdown client side has loaded.
//       serverRenderedMarkdown;

VizPage.getPageData = async ({ gateways, params, auth0User }) => {
  const id: VizId = params.id;
  const { getUser } = gateways;
  const getViz = GetViz(gateways);

  // Get the Info and Content entities that comprise the Viz.
  const vizResult = await getViz(id);
  if (vizResult.outcome === 'failure') {
    // Indicates viz not found
    return null;
  }

  const { infoSnapshot, contentSnapshot } = vizResult.value;
  const { title, owner } = infoSnapshot.data;

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
    // e.g. const getUsersResult = await getUsers([owner,authenticatedUserId]);

    const authenticatedUserResult = await getUser(authenticatedUserId);
    if (authenticatedUserResult.outcome === 'failure') {
      console.log('Error when fetching authenticated user:');
      console.log(authenticatedUserResult.error);
      return null;
    }
    authenticatedUserSnapshot = authenticatedUserResult.value;
  }

  // Render Markdown server-side.
  // TODO cache it.
  const content = contentSnapshot.data;
  const initialReadmeHTML = renderREADME(
    getFileText(content, 'README.md'),
    marked,
    xss
  );

  return {
    infoSnapshot,
    contentSnapshot,
    ownerUserSnapshot,
    title,
    authenticatedUserSnapshot,
    initialReadmeHTML,
  };
};

export { VizPage };
