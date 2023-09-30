export const primordialCommitFixture = {
  id: '100',
  viz: '86a75dc8bdbe4965ba353a79d4bd44c8',
  authors: ['68416'],
  timestamp: 1534246611,
  ops: [
    [
      'files',
      {
        i: {
          cc07dec7: {
            name: 'myMessage.js',
            text: "// This is an example of an ES6 module.\nexport const message = 'Hello VizHub!';\n",
          },
          '432a258b': {
            name: 'index.js',
            text: "// You can import API functions like this from D3.js.\nimport { select } from 'd3';\n\n// You can import local ES6 modules like this. See message.js!\nimport { message } from './myMessage';\n\n// This line uses D3 to set the text of the message div.\nselect('#message').text(message);\n",
          },
          cfa37031: {
            name: 'styles.css',
            text: '#message {\n  text-align: center;\n  font-size: 12em;\n}\n',
          },
          f4af977b: {
            name: 'index.html',
            text: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>Hello VizHub</title>\n\n    <!-- You can import css from local files like this. -->\n    <link rel="stylesheet" href="styles.css" />\n\n    <!-- Libraries can be included like this from a CDN. -->\n    <script src="https://unpkg.com/d3@5.16.0/dist/d3.min.js"></script>\n  </head>\n  <body>\n    <div id="message"></div>\n    <script src="bundle.js"></script>\n  </body>\n</html>\n',
          },
          fd5b098d: {
            name: 'README.md',
            text: 'An example showing the capabilities of VizHub:\n * Loads D3 via UNPKG.\n * Demonstrates use of `import` from `"d3"`.\n * Demonstrates use of `import` from local ES6 modules.',
          },
        },
      },
    ],
    [
      'height',
      {
        i: 500,
      },
    ],
    [
      'id',
      {
        i: '86a75dc8bdbe4965ba353a79d4bd44c8',
      },
    ],
    [
      'title',
      {
        i: 'Hello VizHub',
      },
    ],
  ],
  milestone: null,
};
