import {
  SortId,
  UserId,
  VizId,
  Content,
  Visibility,
} from 'entities';

// Modeled after https://github.com/octokit/octokit.js/#constructor-options
// See also https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#uploading_json_data

export const VizKit = ({ baseUrl, ssrFetch = null }) => {
  let fetch: typeof window.fetch | typeof ssrFetch;

  if (import.meta.env.SSR) {
    fetch = ssrFetch;
  } else {
    fetch = window.fetch;
  }

  const postJSON = async (
    url: string,
    data: { [key: string]: any } | null = null,
  ) => {
    if (!fetch) throw new Error('fetch is not defined');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  };

  return {
    rest: {
      privateBetaEmailSubmit: async (email: string) =>
        await postJSON(
          `${baseUrl}/private-beta-email-submit`,
          {
            email,
          },
        ),

      recordAnalyticsEvents: async (eventId: string) =>
        await postJSON(
          `${baseUrl}/record-analytics-event`,
          {
            eventId,
          },
        ),

      getInfosAndOwners: async (options: {
        forkedFrom: VizId;
        owner: UserId;

        // An array of user ids that we already have in the client
        noNeedToFetchUsers: Array<UserId>;

        // The sort id that we want to use for sorting results
        sortId: SortId;

        // The page number that we want to use for pagination
        pageNumber: number;
      }) =>
        await postJSON(
          `${baseUrl}/get-infos-and-owners`,
          options,
        ),

      forkViz: async (options: {
        // The viz that we want to fork
        forkedFrom: VizId;

        // The new owner of the forked viz
        owner: UserId;

        // The title of the forked viz
        title?: string;

        // The new content of the forked viz
        // If undefined, the forked viz will have the same content as the original viz
        // This is only populated when the user has made changes to the viz
        // but doesn't have the access permissions to actually change the original viz.
        // In this case, forking is a way for the user to save their changes.
        content?: Content;

        // The visibility of the forked viz
        visibility?: Visibility;
      }) => await postJSON(`${baseUrl}/fork-viz`, options),

      fakeCheckoutSuccess: async (userId: UserId) =>
        await postJSON(`${baseUrl}/fake-checkout-success`, {
          userId,
        }),

      fakeUnsubscribeSuccess: async (userId: UserId) =>
        await postJSON(
          `${baseUrl}/fake-unsubscribe-success`,
          {
            userId,
          },
        ),

      createCheckoutSession: async (userId: UserId) => {
        const result = await postJSON(
          `${baseUrl}/create-checkout-session`,
          {
            userId,
          },
        );
        console.log('createCheckoutSession result', result);

        return result;
      },
    },
  };
};
