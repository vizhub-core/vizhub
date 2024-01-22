// Populates request.agent.userId or request.agent.isServer.
//
// This ShareDB middleware triggers when new connections are made,
import { format } from 'd3-format';
import { VerifyVizAccess } from 'interactors';
import { CONTENT_COLLECTION } from 'database';
import { parseAuth0Sub } from 'api';
import { Gateways, Result } from 'gateways';
import {
  Action,
  Info,
  READ,
  User,
  VizId,
  WRITE,
} from 'entities';
import { VizAccess } from 'interactors/src/verifyVizAccess';
import { INFO_COLLECTION } from 'database/src/collectionNames';
import {
  tooLargeError,
  tooLargeForFreeError,
} from 'gateways/src/errors';

const commaFormat = format(',');

// Useful for debugging agent identification.
const debug = false;

// For client-side connections (in the browser), leverage the
// existing auth middleware to populate the ShareDB agent's user ID.
// This is later referenced by access control rules.
export const identifyClientAgent =
  ({
    authMiddleware,
    gateways,
  }: {
    authMiddleware: any;
    gateways: Gateways;
  }) =>
  async (request, next) => {
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

      const userId = await new Promise((resolve) => {
        authMiddleware(req, {}, () => {
          const sub = req?.oidc?.user?.sub;
          if (sub) {
            resolve(parseAuth0Sub(sub));
          } else {
            resolve(undefined);
          }
        });
      });

      // If the user is logged in, set the ShareDB agent's user ID.
      // TODO phase this out entirely, and always leverage request.agent.user
      request.agent.userId = userId;

      // Get the actual User entity at the time of connection,
      // so we don't have to worry about it querying for it later.
      const userResult = await gateways.getUser(
        request.agent.userId,
      );
      if (userResult.outcome === 'failure') {
        throw userResult.error;
      }
      const user: User = userResult.value.data;
      request.agent.user = user;
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

  return async (request, next) => {
    // Unpack the ShareDB request object.
    const {
      agent: { isServer, userId, user },
      // op,
      collection,

      // `snapshot` is populated for write ops (ShareDB "apply" middleware)
      snapshot,

      // `snapshots` is populated for read ops (ShareDB "readSnapshots" middleware)
      snapshots,
    } = request;

    if (debug) {
      console.log('[vizVerify] ', {
        isServer,
        userId,
        user,
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

// Checks the size of the document against the user's plan.
export const sizeCheck = (gateways) => (request, next) => {
  console.log('checking size');
  // Unpack the ShareDB request object.
  console.log(request);
  const {
    agent: { user },
    collection,

    // `snapshot` here is the snapshot _after_ the op has been applied.
    // We can check the size of this snapshot to see if it's too big.
    snapshot,
  } = request;

  console.log('collection === CONTENT_COLLECTION');
  console.log(collection === CONTENT_COLLECTION);

  if (collection === CONTENT_COLLECTION) {
    // The size of the viz document after the op has been applied.
    const docSizeKB =
      JSON.stringify(snapshot).length / 1024;

    console.log('docSizeKB');
    console.log(docSizeKB);

    // TODO different limits for different tiers.
    // const freeTierSizeLimitKB = 1000;
    const freeTierSizeLimitKB = 1;

    const premiumTierSizeLimitKB = 5000;
    // const opSizeLimitKB = 3000;

    // If the data is too large for VizHub in general,
    // report an error.
    if (docSizeKB > premiumTierSizeLimitKB) {
      return next(
        tooLargeError(
          `The data size limit for VizHub is ${commaFormat(
            premiumTierSizeLimitKB,
          )}KB. This document is ${commaFormat(
            Math.ceil(docSizeKB),
          )}KB. Please reduce the size of your data or consider hosting it externally.`,
        ),
      );
    }

    // If the data is too large for the free tier,
    // but not for the premium tier,
    // check if the user is on the free tier.
    if (docSizeKB > freeTierSizeLimitKB) {
      console.log('docSizeKB > freeTierSizeLimitKB');
      console.log(docSizeKB > freeTierSizeLimitKB);
      console.log('user.plan === free');
      console.log(user.plan === 'free');
      console.log(user.plan);

      if (user.plan === 'free') {
        return next(
          tooLargeForFreeError(
            `The data size limit is ${commaFormat(
              freeTierSizeLimitKB,
            )}KB for the VizHub Starter plan. This document is ${commaFormat(
              Math.ceil(docSizeKB),
            )}KB. Upgrade to VizHub Premium to increase the limit to ${commaFormat(
              premiumTierSizeLimitKB,
            )}KB, which would allow you to upload this data.`,
          ),
        );
      }
    }
  }

  // In this case we are under the limits, or
  // the collection is not CONTENT_COLLECTION.
  return next();
};
