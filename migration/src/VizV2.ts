import { Files, VizId } from 'entities';

export type VizV2 = {
  info: InfoV2;
  content: ContentV2;
  ops: Array<any>;
  contentCollection: any;
};

export type InfoV2 = {
  id: VizId;
  title: string;
  description: string;
  owner: string;
  collaborators: Array<any>;
  files: Array<any>;
  createdTimestamp: number;
  lastUpdatedTimestamp: number;
  imagesUpdatedTimestamp: number;
  upvotes: Array<any>;
  forksCount: number;
  upvotesCount: number;
  scoreWilson: number;
  scoreRedditHotCreated: number;
  scoreHackerHotCreated: number;
  scoreRedditHotLastUpdated: number;
  scoreHackerHotLastUpdated: number;
};

export type ContentV2 = {
  id: VizId;
  files: FilesV2;
};

export type FilesV2 = Array<FileV2>;
export type FileV2 = {
  name: string;
  text: string;
};

// An example of a VizV2:
// vizV2 {
//   info: {
//     _id: '3fd333e335fe4ecb9ee0c819802443b7',
//     id: '3fd333e335fe4ecb9ee0c819802443b7',
//     documentType: 'visualization',
//     owner: '68416',
//     title: 'Loading CSV',
//     description: 'This example shows how to load a CSV dataset, the [Iris Dataset](https://vizhub.com/curran/datasets/iris).\n' +
//       '\n' +
//       '<iframe width="560" height="315" src="https://www.youtube.com/embed/qaOzZ7L3dJo?rel=0&amp;start=251" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>',
//     lastUpdatedTimestamp: 1577348971,
//     height: 500,
//     imagesUpdatedTimestamp: 1577348982,
//     forksCount: 6,
//     upvotesCount: 0,
//     scoreWilson: 0.4384939195509822,
//     scoreRedditHotCreated: -3277.1335103008355,
//     scoreHackerHotCreated: 9.966681152313245e-9,
//     scoreRedditHotLastUpdated: -2319.377332523058,
//     scoreHackerHotLastUpdated: 1.856558888428561e-8,
//     forkedFrom: '86a75dc8bdbe4965ba353a79d4bd44c8',
//     createdTimestamp: 1534249943,
//     _type: 'http://sharejs.org/types/JSONv0',
//     _v: 10687,
//     _m: { ctime: 1534249943226, mtime: 1681742421422 },
//     _o: new ObjectId("643d5a55b6a55404e1089a87")
//   },
//   content: {
//     _id: '3fd333e335fe4ecb9ee0c819802443b7',
//     id: '3fd333e335fe4ecb9ee0c819802443b7',
//     documentType: 'visualization',
//     files: [ [Object], [Object], [Object], [Object] ],
//     _type: 'http://sharejs.org/types/JSONv0',
//     _v: 28,
//     _m: { ctime: 1534249943226, mtime: 1538737013238 },
//     _o: new ObjectId("5bb7437596846410cb28b267")
//   },
//   ops: [],
//   contentCollection: LegacyCollection {
//   }
// }
// vizV2.info {
//   _id: '3fd333e335fe4ecb9ee0c819802443b7',
//   id: '3fd333e335fe4ecb9ee0c819802443b7',
//   documentType: 'visualization',
//   owner: '68416',
//   title: 'Loading CSV',
//   description: 'This example shows how to load a CSV dataset, the [Iris Dataset](https://vizhub.com/curran/datasets/iris).\n' +
//     '\n' +
//     '<iframe width="560" height="315" src="https://www.youtube.com/embed/qaOzZ7L3dJo?rel=0&amp;start=251" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>',
//   lastUpdatedTimestamp: 1577348971,
//   height: 500,
//   imagesUpdatedTimestamp: 1577348982,
//   forksCount: 6,
//   upvotesCount: 0,
//   scoreWilson: 0.4384939195509822,
//   scoreRedditHotCreated: -3277.1335103008355,
//   scoreHackerHotCreated: 9.966681152313245e-9,
//   scoreRedditHotLastUpdated: -2319.377332523058,
//   scoreHackerHotLastUpdated: 1.856558888428561e-8,
//   forkedFrom: '86a75dc8bdbe4965ba353a79d4bd44c8',
//   createdTimestamp: 1534249943,
//   _type: 'http://sharejs.org/types/JSONv0',
//   _v: 10687,
//   _m: { ctime: 1534249943226, mtime: 1681742421422 },
//   _o: new ObjectId("643d5a55b6a55404e1089a87")
// }
// vizV2.content {
//   _id: '3fd333e335fe4ecb9ee0c819802443b7',
//   id: '3fd333e335fe4ecb9ee0c819802443b7',
//   documentType: 'visualization',
//   files: [
//     {
//       name: 'bundle.js',
//       text: '(function (d3) {\n' +
//         "  'use strict';\n" +
//         '\n' +
//         "  d3.csv('https://vizhub.com/curran/datasets/iris.csv')\n" +
//         '    .then(data => {\n' +
//         "      d3.select('body')\n" +
//         "        .append('pre')\n" +
//         '          .text(JSON.stringify(data, null, 2));\n' +
//         '    });\n' +
//         '\n' +
//         '}(d3));\n' +
//         '\n' +
//         '//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHNlbGVjdCwgY3N2IH0gZnJvbSAnZDMnO1xuXG5jc3YoJ2h0dHBzOi8vdml6aHViLmNvbS9jdXJyYW4vZGF0YXNldHMvaXJpcy5jc3YnKVxuICAudGhlbihkYXRhID0+IHtcbiAgICBzZWxlY3QoJ2JvZHknKVxuICAgICAgLmFwcGVuZCgncHJlJylcbiAgICAgICAgLnRleHQoSlNPTi5zdHJpbmdpZnkoZGF0YSwgbnVsbCwgMikpO1xuICB9KTsiXSwibmFtZXMiOlsiY3N2Iiwic2VsZWN0Il0sIm1hcHBpbmdzIjoiOzs7QUFFQUEsUUFBRyxDQUFDLDZDQUE2QyxDQUFDO0VBQ2xELEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSTtFQUNoQixJQUFJQyxTQUFNLENBQUMsTUFBTSxDQUFDO0VBQ2xCLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQztFQUNwQixTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUM3QyxHQUFHLENBQUM7Ozs7In0='
//     },
//     {
//       name: 'index.html',
//       text: '<!DOCTYPE html>\n' +
//         '<html>\n' +
//         '  <head>\n' +
//         '    <meta charset="utf-8">\n' +
//         '    <meta name="viewport" content="width=device-width">\n' +
//         '    <title>Loading CSV</title>\n' +
//         '    <script src="https://unpkg.com/d3@5.5.0/dist/d3.min.js"></script>\n' +
//         '  </head>\n' +
//         '  <body>\n' +
//         '    <script src="bundle.js"></script>\n' +
//         '  </body>\n' +
//         '</html>'
//     },
//     {
//       name: 'index.js',
//       text: "import { select, csv } from 'd3';\n" +
//         '\n' +
//         "csv('https://vizhub.com/curran/datasets/iris.csv')\n" +
//         '  .then(data => {\n' +
//         "    select('body')\n" +
//         "      .append('pre')\n" +
//         '        .text(JSON.stringify(data, null, 2));\n' +
//         '  });'
//     },
//     {
//       name: 'README.md',
//       text: 'This example shows how to load a CSV dataset, the [Iris Dataset](https://vizhub.com/curran/datasets/iris).\n' +
//         '\n' +
//         '<iframe width="560" height="315" src="https://www.youtube.com/embed/qaOzZ7L3dJo?rel=0&amp;start=251" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>'
//     }
//   ],
//   _type: 'http://sharejs.org/types/JSONv0',
//   _v: 28,
//   _m: { ctime: 1534249943226, mtime: 1538737013238 },
//   _o: new ObjectId("5bb7437596846410cb28b267")
// }
