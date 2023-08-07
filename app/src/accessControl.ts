// Populates request.agent.userId or request.agent.isServer.
//
// This ShareDB middleware triggers when new connections are made,

import { VerifyVizAccess } from 'interactors';
import { CONTENT_COLLECTION } from 'database';
import { parseAuth0Sub } from './parseAuth0User';
import { Gateways } from 'gateways';
import { Info, WRITE } from 'entities';

// whether from the browser or from the server.
export const identifyAgent = (authMiddleware) => (request, next) => {
  // If the connection is coming from the browser,
  if (request.req) {
    // Create something that looks enough like the Express `req` object
    // that we can pass it to the authMiddleware.
    const req = {
      ...request.req,
      get: (key) => {
        const headers = request.req.headers;
        return headers[key];
      },
    };

    // Invoke the authMiddleware to populate `req.oidc`.
    authMiddleware(req, {}, () => {
      const sub = req?.oidc?.user?.sub;
      if (sub) {
        // If the user is logged in, set the ShareDB agent's user ID.
        request.agent.userId = parseAuth0Sub(sub);
      }
    });
  } else {
    // Otherwise set a flag that clarifies that
    // the connection is coming from the server (e.g. for creating User entries).
    request.agent.isServer = true;
  }

  next();
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

// Determines whether or not a given user is allowed to perform
// a given action on a given viz.
// Returns true if the user is allowed to perform the action.
// Returns false if the user is not allowed to perform the action.
const vizWriteAsync = (gateways: Gateways) => {
  const { getInfo, getPermissions, getFolderAncestors } = gateways;
  const verifyVizAccess = VerifyVizAccess(gateways);
  return async (context) => {
    // console.log('vizWriteAsync', request);
    // Unpack the ShareDB request object.
    const {
      agent: { isServer, userId },
      // op,
      collection,
      snapshot,
    } = context;

    // Let the server do whatever it wants, because
    // all interactions there are mediated by interactors,
    // which take access control into account.
    if (isServer) {
      return;
    }

    // Vet ops against viz content documents.
    if (collection === CONTENT_COLLECTION) {
      const infoResult = await getInfo(snapshot.id);
      if (infoResult.outcome === 'failure') {
        throw infoResult.error;
      }
      const info: Info = infoResult.value.data;
      const verifyResult = await verifyVizAccess({
        userId,
        info,
        action: WRITE,
      });
      // console.log('verifyResult in vizWriteAsync', verifyResult);
      if (verifyResult.outcome === 'failure') {
        throw verifyResult.error;
      }
      const canWrite = verifyResult.value;
      if (!canWrite) {
        throw new Error('This visualization is unforked. Fork to save edits.');
      }
    } else {
      // console.log('Allowing op on collection ', collection);
    }

    // const info = await getInfo();

    // console.log(verifyVizAccess({ userId, info: {}, action: 'read' }));
    //   // Only vet ops against viz info and content documents.
    //   // TODO cover this logic with tests
    //   if (collection !== DOCUMENT_CONTENT && collection !== DOCUMENT_INFO) {
    //     return;
    //   }

    //   // For all ops, owner must be the logged in user.
    //   if (!userId) {
    //     throw new Error('You must be logged in to edit.');
    //   }
    //   // Do nothing in the case of create and delete ops.
    //   // TODO check that owner matches in case of create ops
    //   // TODO check that owner matches in case of delete ops
    //   if (op && (op.create || op.del)) {
    //     return;
    //   }
    //   // Let anyone add or remove their own upvotes to any viz.
    //   // TODO split this out.
    //   if (op && op.op && op.op.length > 0 && op.op[0].p[0] === 'upvotes') {
    //     for (let i = 0; i < op.op.length; i++) {
    //       const c = op.op[i];
    //       // Validate the upvote initialization op.
    //       // Looks like this: { p: [ 'upvotes' ], oi: [] }
    //       if (c.p[0] === 'upvotes' && c.p.length == 1) {
    //         if (JSON.stringify(c.oi) !== '[]') {
    //           throw new Error('Unauthorized vote manipulation.');
    //         }
    //       }
    //       // Validate the upvote addition or deletion ops.
    //       // Looks like this:
    //       // {
    //       //   p: [ 'upvotes', 0 ],
    //       //   li: { userId: '47895473289547832938754', timestamp: 1569094989 }
    //       // }
    //       // Or like this:
    //       // {
    //       //   p: [ 'upvotes', 0 ],
    //       //   ld: { userId: '47895473289547832938754', timestamp: 1569094989 }
    //       // }
    //       if (c.p[0] === 'upvotes' && c.p.length == 2) {
    //         const entry = c.li || c.ld;
    //         if (entry) {
    //           // Users may only submit ops that change their own entries.
    //           if (entry.userId !== userId) {
    //             throw new Error('Unauthorized vote manipulation.');
    //           }
    //         } else {
    //           throw new Error('Unauthorized vote manipulation.');
    //         }
    //       }
    //     }
    //     return;
    //   }
    //   const vizInfo = await getVizInfo(collection, snapshot);
    //   if (!allowWrite(vizInfo, userId)) {
    //     throw new Error('This visualization is unforked. Fork to save edits.');
    //   }
  };
};

export const vizWrite = (gateways) => (request, next) => {
  vizWriteAsync(gateways)(request)
    .then(() => next())
    .catch((error) => next(error.message));
};
