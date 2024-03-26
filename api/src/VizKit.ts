import {
  SortId,
  UserId,
  VizId,
  Content,
  Visibility,
  SectionId,
  User,
  Comment,
  Commit,
  CommentId,
  RevisionHistory,
  APIKey,
} from 'entities';
import { Result, Success } from 'gateways';
import { InfosAndOwners } from 'interactors/src/getInfosAndOwners';

export interface VizKitAPI {
  rest: {
    privateBetaEmailSubmit: (
      email: string,
    ) => Promise<Result<Success>>;

    recordAnalyticsEvents: (
      eventId: string,
    ) => Promise<Result<Success>>;

    getInfosAndOwners: (options: {
      forkedFrom: VizId;
      owner: UserId;

      // An array of user ids that we already have in the client
      noNeedToFetchUsers: Array<UserId>;

      // The section id that we want to use for filtering results
      sectionId?: SectionId;

      // The sort id that we want to use for sorting results
      sortId: SortId;

      // The page number that we want to use for pagination
      pageNumber: number;

      // The search query from the search box
      searchQuery?: string;
    }) => Promise<Result<InfosAndOwners>>;

    forkViz: (options: {
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
    }) => Promise<{
      forkedVizId: VizId;
    }>;

    trashViz: (options: {
      id: VizId;
    }) => Promise<Result<Success>>;

    fakeCheckoutSuccess: (
      userId: UserId,
    ) => Promise<Result<Success>>;

    fakeUnsubscribeSuccess: (
      userId: UserId,
    ) => Promise<Result<Success>>;

    createCheckoutSession: (options: {
      userId: UserId;
      isMonthly: boolean;
      discountCode?: string;
    }) => Promise<
      Result<{
        sessionURL: string;
      }>
    >;

    createBillingPortalSession: (options: {
      userId: UserId;
    }) => Promise<
      Result<{
        sessionURL: string;
      }>
    >;

    // get-users-for-typeahead
    getUsersForTypeahead: (
      query: string,
    ) => Promise<Result<Array<User>>>;

    addCollaborator: (options: {
      vizId: VizId;
      userId: UserId;
    }) => Promise<Result<Success>>;

    removeCollaborator: (options: {
      vizId: VizId;
      userId: UserId;
    }) => Promise<Result<Success>>;

    addComment: (options: {
      comment: Comment;
    }) => Promise<Result<Success>>;

    deleteComment: (options: {
      id: CommentId;
    }) => Promise<Result<Success>>;

    upvoteViz: (vizId: VizId) => Promise<Result<Success>>;

    unUpvoteViz: (vizId: VizId) => Promise<Result<Success>>;

    isSlugAvailable: (options: {
      owner: UserId;
      slug: string;
    }) => Promise<Result<boolean>>;

    getRevisionHistoryCommits: (
      vizId: VizId,
    ) => Promise<Result<RevisionHistory>>;

    generateAPIKey: (options: { name: string }) => Promise<
      Result<{
        apiKey: APIKey;
        apiKeyString: string;
      }>
    >;
  };
}

// Modeled after https://github.com/octokit/octokit.js/#constructor-options
// See also https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#uploading_json_data
const defaultBaseURL = '/api';
export const VizKit = (
  options: {
    baseUrl?: string;
    ssrFetch?: typeof window.fetch;
  } = {
    baseUrl: defaultBaseURL,
    ssrFetch: null,
  },
): VizKitAPI => {
  const { baseUrl = defaultBaseURL, ssrFetch = null } =
    options;

  let fetch: typeof window.fetch | typeof ssrFetch;

  if (import.meta.env.SSR) {
    fetch = ssrFetch;
  } else {
    fetch = window.fetch;
  }

  // We use HTTP POST requests for all endpoints,
  // because it's easy to send JSON data that way.
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
        noNeedToFetchUsers: Array<UserId>;
        sectionId?: SectionId;
        sortId: SortId;
        pageNumber: number;
        searchQuery?: string;
      }) =>
        await postJSON(
          `${baseUrl}/get-infos-and-owners`,
          options,
        ),

      forkViz: async (options: {
        forkedFrom: VizId;
        owner: UserId;
        title?: string;
        content?: Content;
        visibility?: Visibility;
      }) => await postJSON(`${baseUrl}/fork-viz`, options),

      trashViz: async (options: { id: VizId }) =>
        await postJSON(`${baseUrl}/trash-viz`, options),

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

      createCheckoutSession: async ({
        userId,
        isMonthly,
        discountCode,
      }) =>
        await postJSON(
          `${baseUrl}/create-checkout-session`,
          {
            userId,
            isMonthly,
            discountCode,
          },
        ),

      createBillingPortalSession: async ({ userId }) =>
        await postJSON(
          `${baseUrl}/create-billing-portal-session`,
          {
            userId,
          },
        ),

      getUsersForTypeahead: async (query: string) =>
        await postJSON(
          `${baseUrl}/get-users-for-typeahead`,
          {
            query,
          },
        ),

      addCollaborator: async (options: {
        vizId: VizId;
        userId: UserId;
      }) =>
        await postJSON(
          `${baseUrl}/add-collaborator`,
          options,
        ),

      removeCollaborator: async (options: {
        vizId: VizId;
        userId: UserId;
      }) =>
        await postJSON(
          `${baseUrl}/remove-collaborator`,
          options,
        ),

      addComment: async (options: { comment: Comment }) =>
        await postJSON(`${baseUrl}/add-comment`, options),

      deleteComment: async (options: { id: string }) =>
        await postJSON(
          `${baseUrl}/delete-comment`,
          options,
        ),

      upvoteViz: async (vizId: VizId) =>
        await postJSON(`${baseUrl}/upvote-viz`, {
          vizId,
        }),

      unUpvoteViz: async (vizId: VizId) =>
        await postJSON(`${baseUrl}/un-upvote-viz`, {
          vizId,
        }),

      isSlugAvailable: async (options: {
        owner: UserId;
        slug: string;
      }) =>
        await postJSON(
          `${baseUrl}/is-slug-available`,
          options,
        ),

      getRevisionHistoryCommits: async (vizId: VizId) =>
        await postJSON(`${baseUrl}/get-revision-history`, {
          vizId,
        }),

      generateAPIKey: async (options: { name: string }) =>
        await postJSON(
          `${baseUrl}/generate-api-key`,
          options,
        ),
    },
  };
};
