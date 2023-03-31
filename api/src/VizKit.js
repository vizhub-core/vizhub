// Modeled after https://github.com/octokit/octokit.js/#constructor-options
export const VizKit = ({ baseUrl }) => {
  return {
    rest: {
      test: () => fetch(`${baseUrl}/test`),
    },
  };
};
