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
      // If we get here, the user has permission to perform the op.
      // Now all we need to do is verify that the size of the op
      // is within the limits of the user's plan.
      // We only need to do this for write ops.

      if (action === WRITE) {
        const opSizeKB =
          JSON.stringify(context.op).length / 1024;

        // TODO different limits for different tiers.
        // const freeTierSizeLimitKB = 1000;
        // const premiumTierSizeLimitKB = 5000;
        const opSizeLimitKB = 3000;

        if (opSizeKB > opSizeLimitKB) {
          // return next(
          //   `Your plan limits you to ${opSizeLimitKB}KB per write operation. This operation is ${opSizeKB}KB.`,
          // );

          // TODO replace checking startsWith('Data too large.') in VizPageToasts with
          // error code checking.
          return next(
            `Data too large. Size limit is ${opSizeLimitKB}KB. This operation is ${Math.round(
              opSizeKB,
            )}KB.`,
          );
        }
      }

      // console.log('opSizeKB', opSizeKB);

      // Allow the op to proceed.
      return next();
    }
  };
};

export const vizWrite = (gateways: Gateways) =>
  vizVerify(gateways, WRITE);
export const vizRead = (gateways: Gateways) =>
  vizVerify(gateways, READ);

// This applies to database queries.
export const query = () => (request, next) => {
  // Allow the server to execute queries,
  // via database gateways.
  if (request.agent.isServer) {
    return next();
  }

  // Otherwise, the query is coming from the browser.
  // Block all client-originating queries.
  return next(
    'Client queries are not allowed. Use the API instead.',
  );
};
