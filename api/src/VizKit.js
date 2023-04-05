// Modeled after https://github.com/octokit/octokit.js/#constructor-options
// See also https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#uploading_json_data
export const VizKit = ({ baseUrl }) => {
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
      sendEvent: async (eventIds) =>
        await (
          await fetch(`${baseUrl}/send-event`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ eventIds }),
          })
        ).json(),
    },
  };
};
