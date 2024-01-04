// Populates request.agent.userId or request.agent.isServer.
//
// This ShareDB middleware triggers when new connections are made,

import { VerifyVizAccess } from 'interactors';
import { CONTENT_COLLECTION } from 'database';
import { parseAuth0Sub } from 'api';
import { Gateways, Result } from 'gateways';
import { Action, Info, READ, VizId, WRITE } from 'entities';
import { VizAccess } from 'interactors/src/verifyVizAccess';
import { INFO_COLLECTION } from 'database/src/collectionNames';

// Useful for debugging agent identification.
const debug = false;

// For client-side connections (in the browser), leverage the
// existing auth middleware to populate the ShareDB agent's user ID.
// This is later referenced by access control rules.
export const identifyClientAgent =
  (authMiddleware) => (request, next) => {
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
      // Do nothing. This case is handled by identifyServerAgent
    }

    next();
  };

export const identifyServerAgent = (request, next) => {
  // If the connection is coming from the browser,
  if (request.req) {
    // do nothing.
    // This case is handled by identifyClientAgent
  } else {
    // Otherwise set a flag that clarifies that
    // the connection is coming from the server.
    request.agent.isServer = true;
  }

  next();
};
// The way ShareDB middleware works is like this:
// 1. The middleware is invoked with a request object.
// 2. The middleware can do whatever it wants with the request object.
// 3. The middleware must invoke the next() function.
// 4. The middleware can optionally pass an error message to next().
// 5. The next() function invokes the next middleware in the chain.
// 6. Pass a string, not an Error, into next(). Otherwise ShareDB will
//    log the error to the server console.
// see https://share.github.io/sharedb/middleware/op-submission
const vizVerify = (gateways: Gateways, action: Action) => {
  const { getInfo } = gateways;
  const verifyVizAccess = VerifyVizAccess(gateways);

  return async (context, next) => {
    // console.log('vizWriteAsync', request);
    // Unpack the ShareDB request object.
    const {
      agent: { isServer, userId },
      // op,
      collection,

      // `snapshot` is populated for write ops (ShareDB "apply" middleware)
      snapshot,

      // `snapshots` is populated for read ops (ShareDB "readSnapshots" middleware)
      snapshots,
    } = context;

    if (debug) {
      console.log('[vizVerify] ', {
        isServer,
        userId,
        action,
      });
    }

    // Let the server do whatever it wants, because
    // all interactions there are mediated by interactors,
    // which take access control into account.
    if (isServer) {
      return next();
    }

    // Block all ops on all collections except viz info and content.
    if (
      collection !== CONTENT_COLLECTION &&
      collection !== INFO_COLLECTION
    ) {
      return next(
        'You do not have permissions to edit this collection.',
      );
    }

    // Isolate the viz info.
    let info: Info;
    if (collection === CONTENT_COLLECTION) {
      const id: VizId = snapshot
        ? snapshot.id
        : snapshots[0].id;

      if (snapshots && snapshots.length > 1) {
        throw new Error(
          'TODO handle reading multiple snapshots at once in accessControl.',
        );
      }

      const infoResult = await getInfo(id);
      if (infoResult.outcome === 'failure') {
        throw infoResult.error;
      }
      info = infoResult.value.data;
    } else if (collection === INFO_COLLECTION) {
      info = snapshot ? snapshot.data : snapshots[0].data;
    }

    // Vet ops against viz info and content documents in the same way.
    const verifyResult: Result<VizAccess> =
      await verifyVizAccess({
        authenticatedUserId: userId,
        info,
        actions: [action],
        debug,
      });
    if (verifyResult.outcome === 'failure') {
      throw verifyResult.error;
    }

    if (debug) {
      console.log('[vizVerify] verifyResult', verifyResult);
    }
    const hasPermission = verifyResult.value[action];
    if (!hasPermission) {
      return next(
        'You do not have permissions to edit this viz.',
      );
    } else {
      // Allow the op to proceed.
      return next();
    }
  };
};

export const vizWrite = (gateways: Gateways) =>
  vizVerify(gateways, WRITE);
export const vizRead = (gateways: Gateways) =>
  vizVerify(gateways, READ);

export const query = () => (request, next) => {
  // console.log('query', request);
  if (request.agent.isServer) {
    return next();
  }
  // Otherwise, the query is coming from the browser.
  // Block all queries.
  return next(
    'Client queries are not allowed. Use the API instead.',
  );
};

// V2 Code for reference
// TODO handle access control for upvoting.
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
