// Safely transporting page data to the client via JSON in a <script> tag.
// We need to escape script ending tags, so we can transport HTML within JSON.

// Inspired by:
// https://github.com/ember-fastboot/fastboot/pull/85/commits/08d6e0ad653723be2096a0fab326164bd8f63ebf
// https://www.man42.net/blog/2016/12/safely-escape-user-data-in-a-script-tag/
// https://github.com/yahoo/serialize-javascript/blob/7f3ac252d86b802454cb43782820aea2e0f6dc25/index.js#L25
// https://pragmaticwebsecurity.com/articles/spasecurity/json-stringify-xss.html
// https://redux.js.org/usage/server-rendering/#security-considerations
const escaped = {
  '&': '\\u0026',
  '>': '\\u003e',
  '<': '\\u003c',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
};
const regex = /[\u2028\u2029&><]/g;
const replacer = (match) => escaped[match];
export const escapeProperly = (str) =>
  str.replace(regex, replacer);
