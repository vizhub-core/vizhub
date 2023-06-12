import { VizPage } from './index';
import { parseAuth0Sub } from '../../parseAuth0User';

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
  const { id } = params;
  const { getInfo, getContent, getUser } = gateways;

  // Get the Info entity.
  const infoResult = await getInfo(id);
  if (infoResult.outcome === 'failure') {
    // Indicates viz not found
    return null;
  }

  const infoSnapshot = infoResult.value;
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

  return {
    infoSnapshot,
    ownerUserSnapshot,
    title,
    authenticatedUserSnapshot,
  };
};

export { VizPage };
