import { describe, it, expect } from 'vitest';
import { bundle } from './bundle';

// From https://github.com/vizhub-core/vizhub/blob/main/vizhub-v2/packages/presenters/test/test.js

// Convenience for testing.
const removeSourceMap = (files) => {
  files[0].text = files[0].text.split('\n//# sourceMappingURL')[0];
  return files;
};

describe('getComputedIndexHTML', () => {
  it('should bundle files using Rollup', async () => {
    const files = [
      {
        name: 'index.js',
        text: 'import { foo } from "./foo.js"; console.log(foo);',
      },
      { name: 'foo.js', text: 'export const foo = "bar";' },
    ];
    expect(removeSourceMap(await bundle(files))).toEqual([
      {
        name: 'bundle.js',
        text: '(function () {\n\t\'use strict\';\n\n\tconst foo = "bar";\n\n\tconsole.log(foo);\n\n}());\n',
      },
    ]);
  });
});

// import assert from 'assert';
// import { testData } from 'vizhub-entities';
// import { JSDOM } from 'jsdom';
// import {
//   VisualizationViewModel,
//   DatasetViewModel,
//   bundle,
//   setJSDOM,
// } from '../src';
// import sinon from 'sinon';

// setJSDOM(JSDOM);

// const { visualization, dataset } = testData;

// global.fetch = sinon.fake.resolves({
//   ok: true,
//   url: '',
//   text: () =>
//     Promise.resolve(
//       'const globals={};const noop={};const dispatch_dev={};const validate_slots={};const SvelteComponentDev={};const init={};const safe_not_equal={}; export { globals, noop, dispatch_dev, validate_slots, SvelteComponentDev, init, safe_not_equal }'
//     ),
// });

//   describe('Bundler', () => {

//     it('should refer to global d3 in bundle for d3 package', async () => {
//       const files = [
//         {
//           name: 'index.js',
//           text: 'import { select } from "d3"; console.log(select);',
//         },
//       ];
//       assert.deepEqual(removeSourceMap(await bundle(files)), [
//         {
//           name: 'bundle.js',
//           text:
//             "(function (d3) {\n\t'use strict';\n\n\tconsole.log(d3.select);\n\n}(d3));\n",
//         },
//       ]);
//     });

//     it('should refer to global React in bundle for React package', async () => {
//       const files = [
//         {
//           name: 'index.js',
//           text: 'import React from "react"; console.log(React);',
//         },
//       ];
//       assert.deepEqual(removeSourceMap(await bundle(files)), [
//         {
//           name: 'bundle.js',
//           text:
//             "(function (React) {\n\t'use strict';\n\n\tReact = React && Object.prototype.hasOwnProperty.call(React, 'default') ? React['default'] : React;\n\n\tconsole.log(React);\n\n}(React));\n",
//         },
//       ]);
//     });

//     it('should transpile JSX', async () => {
//       const files = [{ name: 'index.js', text: '<div>Hello JSX!</div>' }];
//       assert.deepEqual(removeSourceMap(await bundle(files)), [
//         {
//           name: 'bundle.js',
//           text:
//             "(function () {\n\t'use strict';\n\n\tReact.createElement( 'div', null, \"Hello JSX!\" );\n\n}());\n",
//         },
//       ]);
//     });

//     it('should not transpile ES6', async () => {
//       const files = [
//         {
//           name: 'index.js',
//           text: 'const fn = a => a * a; console.log(fn(4));',
//         },
//       ];
//       assert.deepEqual(removeSourceMap(await bundle(files)), [
//         {
//           name: 'bundle.js',
//           text:
//             "(function () {\n\t'use strict';\n\n\tconst fn = a => a * a; console.log(fn(4));\n\n}());\n",
//         },
//       ]);
//     });

//     it('should allow generators', async () => {
//       const files = [
//         {
//           name: 'index.js',
//           text: 'console.log(function* () { yield 5; }().next().value)',
//         },
//       ];
//       assert.deepEqual(removeSourceMap(await bundle(files)), [
//         {
//           name: 'bundle.js',
//           text:
//             "(function () {\n\t'use strict';\n\n\tconsole.log(function* () { yield 5; }().next().value);\n\n}());\n",
//         },
//       ]);
//     });

//     it('should allow characters outside of the Latin1 range', async () => {
//       const files = [{ name: 'index.js', text: 'console.log("Привет")' }];
//       assert.deepEqual(removeSourceMap(await bundle(files)), [
//         {
//           name: 'bundle.js',
//           text:
//             '(function () {\n\t\'use strict\';\n\n\tconsole.log("Привет");\n\n}());\n',
//         },
//       ]);
//     });
//   });
//   //describe('Svelte', () => {
//   //  it('should bundle files using Rollup', async () => {
//   //    const files = [
//   //      {
//   //        name: 'index.js',
//   //        text:
//   //          "import App from './App.svelte'; const app = new App({ target: document.body, }); export default app;",
//   //      },
//   //      { name: 'App.svelte', text: '<script>console.log(foo);</script>' },
//   //    ];
//   //    assert.deepEqual(removeSourceMap(await bundle(files)), [
//   //      {
//   //        name: 'bundle.js',
//   //        text:
//   //          'var bundle = (function () {\n\t\'use strict\';\n\n\tconst globals={};const noop={};const dispatch_dev={};const validate_slots={};const SvelteComponentDev={};const init={};const safe_not_equal={};\n\n\t/* code.svelte generated by Svelte v3.31.0 */\n\n\tconst { console: console_1 } = globals;\n\n\tfunction create_fragment(ctx) {\n\t\tconst block = {\n\t\t\tc: noop,\n\t\t\tl: function claim(nodes) {\n\t\t\t\tthrow new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");\n\t\t\t},\n\t\t\tm: noop,\n\t\t\tp: noop,\n\t\t\ti: noop,\n\t\t\to: noop,\n\t\t\td: noop\n\t\t};\n\n\t\tdispatch_dev("SvelteRegisterBlock", {\n\t\t\tblock,\n\t\t\tid: create_fragment.name,\n\t\t\ttype: "component",\n\t\t\tsource: "",\n\t\t\tctx\n\t\t});\n\n\t\treturn block;\n\t}\n\n\tfunction instance($$self, $$props) {\n\t\tlet { $$slots: slots = {}, $$scope } = $$props;\n\t\tvalidate_slots("Code", slots, []);\n\t\tconsole.log(foo);\n\t\tconst writable_props = [];\n\n\t\tObject.keys($$props).forEach(key => {\n\t\t\tif (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Code> was created with unknown prop \'${key}\'`);\n\t\t});\n\n\t\treturn [];\n\t}\n\n\tclass Code extends SvelteComponentDev {\n\t\tconstructor(options) {\n\t\t\tsuper(options);\n\t\t\tinit(this, options, instance, create_fragment, safe_not_equal, {});\n\n\t\t\tdispatch_dev("SvelteRegisterComponent", {\n\t\t\t\tcomponent: this,\n\t\t\t\ttagName: "Code",\n\t\t\t\toptions,\n\t\t\t\tid: create_fragment.name\n\t\t\t});\n\t\t}\n\t}\n\n\tconst app = new Code({ target: document.body, });\n\n\treturn app;\n\n}());\n',
//   //      },
//   //    ]);
//   //  });
//   //});
// });
