import { VizPage } from './index';

VizPage.getPageData = async ({ gateways, params }) => {
  const { id } = params;
  const { getInfo, getUser } = gateways;

  const infoResult = await getInfo(id);
  if (infoResult.outcome === 'failure') {
    // Indicates viz not found
    return null;
  }

  const infoSnapshot = infoResult.value;
  const { title, owner } = infoSnapshot.data;

  const ownerUserResult = await getUser(owner);

  // Should never happen
  if (ownerUserResult.outcome === 'failure') {
    console.log('Error when fetching owner user:');
    console.log(ownerUserResult.error);
    return null;
  }
  const ownerUserSnapshot = ownerUserResult.value;

  return {
    infoSnapshot,
    ownerUserSnapshot,
    title,
  };
};

export { VizPage };
