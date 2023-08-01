import { parse } from 'cookie';
import { JWK, JWKS, JWE, errors } from 'jose';
import http from 'http';
// import test from 'express-openid-connect/lib/appSession.js';

// From https://gist.github.com/edwardb96/ee287a1b0a90dbdad1eec1551dcd4878
// Via https://github.com/auth0/express-openid-connect/issues/151#issuecomment-715588934
// See also https://github.com/auth0/express-openid-connect/blob/master/lib/appSession.js
// function decrypt(jwe) {
//   // const keystore = new JWKS.KeyStore(JWK.asKey(env.VIZHUB3_AUTH0_SECRET));

//   const alg = 'dir';
//   const enc = 'A256GCM';
//   return JWE.decrypt(jwe, keystore, {
//     complete: true,
//     contentEncryptionAlgorithms: [enc],
//     keyManagementAlgorithms: [alg],
//   });
// }

// import { getUserIDFromJWT } from 'vizhub-controllers';

// Populates request.agent.userId or request.agent.isServer.
//
// This ShareDB middleware triggers when new connections are made,
// whether from the browser or from the server.
export const identifyAgent = (authMiddleware) => (request, done) => {
  //   // If the connection is coming from the browser,
  if (request.req) {
    // console.log('req in identifyAgent', Object.keys(request.req));
    // console.log('request.req.headers', request.req.headers);
    // const req = request.req;
    // const res = new http.ServerResponse(req);
    const req = {
      ...request.req,
      get: (key) => {
        console.log('called get with ' + key);
        const headers = request.req.headers;
        console.log('returning ' + headers[key]);
        return headers[key];
      },
    };
    authMiddleware(req, {}, () => {
      console.log('here');
      console.log('req.oidc', req.oidc);
      console.log('req.oidc.user', req.oidc.user);
    });
    // console.log('req.oidc2', req.oidc);
    // console.log(Object.keys(request));
    // authMiddleware(req, {}, () => {
    //   console.log('here');
    //   // console.log(Object.keys(req));
    // });
    // const cookie = request.req.headers.cookie;
    // if (cookie) {
    // console.log('parse(cookie)', parse(cookie));
    // console.log('request after', Object.keys(request.req));
    //       const { vizHubJWT } = parse(cookie);
    //       // and the user is authenticated,
    //       // expose the user id to downstream middleware via agent.session.
    //       if (vizHubJWT) {
    //         request.agent.userId = getUserIDFromJWT(vizHubJWT);
    //       }
  } else {
    // Otherwise set a flag that clarifies that
    // the connection is coming from the server (e.g. for creating User entries).
    request.agent.isServer = true;
  }
  //   console.log('identifyAgent', request.req);

  done();
};
// import { getVizInfo } from './getVizInfo';
// import { DOCUMENT_CONTENT, DOCUMENT_INFO } from 'vizhub-database';
// import { allowWrite } from 'vizhub-use-cases';

// import { DOCUMENT_CONTENT, DOCUMENT_INFO } from 'vizhub-database';
// import { getVizInfo } from './getVizInfo';
// import { allowRead } from 'vizhub-use-cases';

// const vizReadAsync = async (request) => {
//   //   // Unpack the ShareDB request object.
//   //   const {
//   //     agent: { isServer, userId },
//   //     collection,
//   //     snapshots,
//   //   } = request;
//   //   // Only vet ops against viz info and content documents.
//   //   if (collection !== DOCUMENT_CONTENT && collection === DOCUMENT_INFO) {
//   //     return;
//   //   }
//   //   // Let the server do whatever it wants, because
//   //   // all interactions there are mediated by interactors.
//   //   if (isServer) {
//   //     return;
//   //   }
//   //   return Promise.all(
//   //     snapshots.map(async (snapshot) => {
//   //       const vizInfo = await getVizInfo(collection, snapshot);
//   //       if (!allowRead(vizInfo, userId)) {
//   //         throw new Error('This visualization is private.');
//   //       }
//   //     }),
//   //   );
//   return true;
// };

// export const vizRead = (request, callback) => {
//   callback();
//   //   vizReadAsync(request)
//   //     .then(() => callback())
//   //     .catch((error) => callback(error.message));
// };

// const vizWriteAsync = async (request) => {
//   //   // Unpack the ShareDB request object.
//   //   const {
//   //     agent: { isServer, userId },
//   //     op,
//   //     collection,
//   //     snapshot,
//   //   } = request;
//   //   // Only vet ops against viz info and content documents.
//   //   // TODO cover this logic with tests
//   //   if (collection !== DOCUMENT_CONTENT && collection !== DOCUMENT_INFO) {
//   //     return;
//   //   }
//   //   // Let the server do whatever it wants, because
//   //   // all interactions there are mediated by interactors.
//   //   if (isServer) {
//   //     return;
//   //   }
//   //   // For all ops, owner must be the logged in user.
//   //   if (!userId) {
//   //     throw new Error('You must be logged in to edit.');
//   //   }
//   //   // Do nothing in the case of create and delete ops.
//   //   // TODO check that owner matches in case of create ops
//   //   // TODO check that owner matches in case of delete ops
//   //   if (op && (op.create || op.del)) {
//   //     return;
//   //   }
//   //   // Let anyone add or remove their own upvotes to any viz.
//   //   // TODO split this out.
//   //   if (op && op.op && op.op.length > 0 && op.op[0].p[0] === 'upvotes') {
//   //     for (let i = 0; i < op.op.length; i++) {
//   //       const c = op.op[i];
//   //       // Validate the upvote initialization op.
//   //       // Looks like this: { p: [ 'upvotes' ], oi: [] }
//   //       if (c.p[0] === 'upvotes' && c.p.length == 1) {
//   //         if (JSON.stringify(c.oi) !== '[]') {
//   //           throw new Error('Unauthorized vote manipulation.');
//   //         }
//   //       }
//   //       // Validate the upvote addition or deletion ops.
//   //       // Looks like this:
//   //       // {
//   //       //   p: [ 'upvotes', 0 ],
//   //       //   li: { userId: '47895473289547832938754', timestamp: 1569094989 }
//   //       // }
//   //       // Or like this:
//   //       // {
//   //       //   p: [ 'upvotes', 0 ],
//   //       //   ld: { userId: '47895473289547832938754', timestamp: 1569094989 }
//   //       // }
//   //       if (c.p[0] === 'upvotes' && c.p.length == 2) {
//   //         const entry = c.li || c.ld;
//   //         if (entry) {
//   //           // Users may only submit ops that change their own entries.
//   //           if (entry.userId !== userId) {
//   //             throw new Error('Unauthorized vote manipulation.');
//   //           }
//   //         } else {
//   //           throw new Error('Unauthorized vote manipulation.');
//   //         }
//   //       }
//   //     }
//   //     return;
//   //   }
//   //   const vizInfo = await getVizInfo(collection, snapshot);
//   //   if (!allowWrite(vizInfo, userId)) {
//   //     throw new Error('This visualization is unforked. Fork to save edits.');
//   //   }
// };

// export const vizWrite = (request, callback) => {
//   callback();
//   //   vizWriteAsync(request)
//   //     .then(() => callback())
//   //     .catch((error) => callback(error.message));
// };
