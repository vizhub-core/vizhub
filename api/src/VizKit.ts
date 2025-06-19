import { VizContent, VizId } from '@vizhub/viz-types';
import {
  SortId,
  UserId,
  Visibility,
  SectionId,
  User,
  Comment,
  CommentId,
  RevisionHistory,
  APIKey,
  APIKeyId,
  Plan,
  VizNotification,
} from 'entities';
import { AIEditMetadataUsage } from 'entities/src/AIEditMetadata';
import { VizNotificationRequestResult } from 'entities/src/Notifications';
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
      content?: VizContent;

      // The visibility of the forked viz
      visibility?: Visibility;
    }) => Promise<
      Result<{
        vizId: VizId;
        ownerUserName: string;
      }>
    >;

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
      plan?: Plan;
      isMonthly?: boolean;
      isCreditTopUp?: boolean;
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

    getRevisionHistory: (
      vizId: VizId,
    ) => Promise<Result<RevisionHistory>>;

    restoreToRevision: (
      vizId: VizId,
      commitId: string,
    ) => Promise<Result<Success>>;

    getAPIKeys: () => Promise<Result<Array<APIKey>>>;

    generateAPIKey: (options: { name: string }) => Promise<
      Result<{
        apiKey: APIKey;
        apiKeyString: string;
      }>
    >;

    revokeAPIKey: (
      apiKeyId: string,
    ) => Promise<Result<Success>>;

    editWithAI: (options: {
      id: VizId;
      prompt: string;

      // OpenRouter model name
      modelName?: string;
    }) => Promise<Result<Success>>;

    getAIUsage: (options: {
      userId: UserId;
    }) => Promise<Result<Array<AIEditMetadataUsage>>>;

    createVizFromPromptAndFile: (options: {
      prompt: string;
      file: File;
    }) => Promise<
      Result<{
        vizId: VizId;
      }>
    >;

    getNotifications: (options: {
      userId: UserId;
    }) => Promise<Result<VizNotificationRequestResult>>;
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
        content?: VizContent;
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
        isCreditTopUp,
        plan,
      }) =>
        await postJSON(
          `${baseUrl}/create-checkout-session`,
          {
            userId,
            isMonthly,
            isCreditTopUp,
            plan,
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

      getRevisionHistory: async (vizId: VizId) =>
        await postJSON(`${baseUrl}/get-revision-history`, {
          vizId,
        }),

      getAPIKeys: async () =>
        await postJSON(`${baseUrl}/get-api-keys`),

      generateAPIKey: async (options: { name: string }) =>
        await postJSON(
          `${baseUrl}/generate-api-key`,
          options,
        ),

      revokeAPIKey: async (apiKeyId: APIKeyId) =>
        await postJSON(`${baseUrl}/revoke-api-key`, {
          apiKeyId,
        }),

      editWithAI: async (options: {
        id: VizId;
        prompt: string;
        modelName: string;
        onChunk?: (chunk: string) => void;
        onComplete?: (result: any) => void;
        onError?: (error: any) => void;
      }) =>
        await postJSON(`${baseUrl}/edit-with-ai`, options),

      restoreToRevision: async (
        vizId: VizId,
        commitId: string,
      ) =>
        await postJSON(`${baseUrl}/restore-to-revision`, {
          vizId,
          commitId,
        }),
      getAIUsage: async (options: { userId: UserId }) =>
        await postJSON(`${baseUrl}/get-ai-usage`, options),

      createVizFromPromptAndFile: async (options: {
        prompt: string;
        file: File;
      }) => {
        if (!fetch) throw new Error('fetch is not defined');

        // For file uploads, we need to use FormData
        const formData = new FormData();
        formData.append('prompt', options.prompt);
        formData.append('file', options.file);

        const response = await fetch(
          `${baseUrl}/create-viz-from-prompt`,
          {
            method: 'POST',
            body: formData,
          },
        );

        return await response.json();
      },

      getNotifications: async (options: {
        userId: UserId;
      }) =>
        await postJSON(
          `${baseUrl}/get-notifications`,
          options,
        ),
    },
  };
};
