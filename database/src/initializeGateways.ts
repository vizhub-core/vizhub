import { initializeMongoDB } from './initializeMongoDB';
import { initializeShareDB } from './initializeShareDB';
import { DatabaseGateways } from './DatabaseGateways';
import { Gateways } from 'gateways';
import { initializeSupabase } from './initializeSupabase';

// `attachMiddleware` allows ShareDB middleware to be attached to the ShareDB backend
// in the proper sequence such that the middleware handles the initial server-side connection.
// The main purpose of this is to support access control middleware, which needs to
// determine the "agent" (i.e. the user) that is making the connection.
// Specifically, the access control middleware needs to know the agent before the
// ShareDB connection is established, so that it can determine whether the agent
// is allowed to connect to the ShareDB backend.
// Mainly it populates `agent.isServer`, which allows the access control middleware
// to know _for sure_ that the connection is server-side, therefore is _trusted_,
// i.e. allowed to perform any and all ops and access any and all documents.
//
// For security purposes, it's important to note that _all_ server-side connections
// are _only_ used via interactors from the `interactors` package. This means that those
// interactors need to be aware of access control rules.
export const initializeGateways = async ({
  isProd,
  env,
  attachMiddleware,
}: {
  isProd: boolean;
  env: { [key: string]: string | undefined };
  attachMiddleware?: (shareDBBackend: any) => void;
}) => {
  const { mongoDBConnection, mongoDBDatabase } =
    await initializeMongoDB({
      isProd,
      env,
    });

  const { shareDBBackend, shareDBConnection } =
    await initializeShareDB({
      mongoDBConnection,
      attachMiddleware,
    });

  // TODO initialize postgres via Supabase
  const supabase = initializeSupabase();

  // For ease of development, the DatabaseGateways are implemented in JavaScript.
  // @ts-ignore
  const gateways: Gateways = DatabaseGateways({
    shareDBConnection,
    mongoDBDatabase,
    supabase,
  }) as Gateways;

  return {
    gateways,
    shareDBBackend,
    shareDBConnection,
    mongoDBDatabase,
    mongoDBConnection,
  };
};
