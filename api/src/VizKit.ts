import { SortId, UserId, Viz, VizId, Content, Visibility } from 'entities';

// Modeled after https://github.com/octokit/octokit.js/#constructor-options
// See also https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#uploading_json_data
export const VizKit = ({ baseUrl, ssrFetch = null }) => {
  // fetch needs special treatment because our AWS AppRunner environment
  // only supports up to Node 16, which is missing native `fetch`.
  // Once our infra supports Node 18, we can drop 'node-fetch' and delete this.
  let fetch;
  // @ts-ignore
  if (import.meta.env.SSR) {
    fetch = ssrFetch;
  } else {
    fetch = window.fetch;
  }

  return {
    rest: {
      // TODO reduce duplication between these methods
      privateBetaEmailSubmit: async (email) =>
        await (
          await fetch(`${baseUrl}/private-beta-email-submit`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          })
        ).json(),

      recordAnalyticsEvents: async (eventId) =>
        await (
          await fetch(`${baseUrl}/record-analytics-event`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ eventId }),
          })
        ).json(),

      getInfosAndOwners: async ({
        forkedFrom,
        owner,
        noNeedToFetchUsers,
        sortId,
        pageNumber,
      }: {
        forkedFrom: VizId;
        owner: UserId;
        // An array of user ids that we already have in the client
        noNeedToFetchUsers: Array<UserId>;
        // The sort id that we want to fetch
        sortId: SortId;
        // The page number that we want to fetch
        pageNumber: number;
      }) =>
        await (
          await fetch(`${baseUrl}/get-infos-and-owners`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              forkedFrom,
              owner,
              noNeedToFetchUsers,
              sortId,
              pageNumber,
            }),
          })
        ).json(),
      forkViz: async ({
        forkedFrom,
        content,
        title,
        owner,
        visibility,
      }: {
        // The viz that we want to fork.
        forkedFrom: VizId;

        // If null, forked viz will use the same content as the forkedFrom viz.
        // If not null, forked viz will use this content instead.
        // Not null when the user has made changes to the unforked viz.
        content: Content | null;

        // The title of the new viz.
        title: string;

        // The owner of the new viz.
        owner: UserId;

        // The visibility of the new viz.
        visibility: Visibility;
      }) =>
        await (
          await fetch(`${baseUrl}/fork-viz`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              forkedFrom,
              content,
              title,
              owner,
              visibility,
            }),
          })
        ).json(),
    },
  };
};
