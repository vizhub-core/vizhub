// Modeled after https://github.com/octokit/octokit.js/#constructor-options
// See also https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#uploading_json_data
export const VizKit = ({ baseUrl, ssrFetch }) => {
  // fetch needs special treatment because our AWS AppRunner environment
  // only supports up to Node 16, which is missing native `fetch`.
  // Once our infra supports Node 18, we can drop 'node-fetch' and delete this.
  let fetch;
  if (import.meta.env.SSR) {
    fetch = ssrFetch;
  } else {
    fetch = window.fetch;
  }

  return {
    rest: {
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
      // TODO reduce duplication
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
    },
  };
};
