import { auth } from 'express-openid-connect';
import { decodeJwt } from 'jose';
import {
  UpdateOrCreateUser,
  RecordAnalyticsEvents,
} from 'interactors';
import { parseAuth0Sub } from 'api';

// Deals with authentication via Auth0.
export const authentication = ({ env, gateways, app }) => {
  const updateOrCreateUser = UpdateOrCreateUser(gateways);
  const recordAnalyticsEvents =
    RecordAnalyticsEvents(gateways);

  // See https://github.com/auth0/express-openid-connect/blob/master/EXAMPLES.md#9-validate-claims-from-an-id-token-before-logging-a-user-in
  const afterCallback = async (req, res, session) => {
    try {
      const claims = decodeJwt(session.id_token);

      // Example claims from GitHub social login:
      // {
      //     nickname: 'curran',
      //     name: 'Curran Kelleher',
      //     picture: 'https://avatars.githubusercontent.com/u/68416?v=4',
      //     updated_at: '2023-04-11T11:30:03.680Z',
      //     email: 'curran.kelleher@gmail.com',
      //     email_verified: true,
      //     iss: 'https://dev-5yxv3gr1hiwuvv46.us.auth0.com/',
      //     aud: 'faBeeyfQBSm11XbTLZ25AMTDmp3noHnJ',
      //     iat: 1681212844,
      //     exp: 1681248844,
      //     sub: 'github|68416',
      //     sid: 'HIUOoaC_USzcL3hni_1skATDZO4ABVRs',
      //     nonce: '_2chroq4hfghgsxa8RJHDhJqNIjYB7VjPa5U9B3Jins'
      //   }

      // VizHub 2 used the GitHub id as the user id,
      // so let's use that here as well so that users of
      // VizHub 2 can log into VizHub 3 and access their accounts.
      const id = parseAuth0Sub(claims.sub);

      const options = {
        id,
        userName: claims.nickname as string,
        displayName: claims.name as string,
        email: claims.email as string,
        picture: claims.picture as string,
      };

      const result = await updateOrCreateUser(options);

      if (result.outcome !== 'success') {
        console.log('Error when updating user');
        console.log(result.error);
      }

      await recordAnalyticsEvents({
        eventId: `event.login.${id}`,
      });

      return session;
    } catch (error) {
      console.log('Error in authentication.ts');
      console.log(error);
    }
  };

  const authMiddleware = auth({
    authRequired: false,
    auth0Logout: true,
    secret: env.VIZHUB3_AUTH0_SECRET,
    baseURL: env.VIZHUB3_AUTH0_BASE_URL,
    clientID: env.VIZHUB3_AUTH0_CLIENT_ID,
    issuerBaseURL: env.VIZHUB3_AUTH0_ISSUER_BASE_URL,
    routes: {
      // This is particular for the GitHub auth provider
      callback: '/login/callback',

      // We override the login route so that
      // we can set the returnTo parameter.
      // See https://github.com/auth0/express-openid-connect/blob/master/examples/custom-routes.js#L11
      // login: false,
    },
    afterCallback,
  });

  app.use(authMiddleware);

  // app.get('/login', (req, res) =>
  //   // TODO make this work properly,
  //   // and also handle pages with dynamic routes such as
  //   //  '/:userName/:id';
  //   res.oidc.login({
  //     returnTo: validPaths.includes(req.query.redirect)
  //       ? `/${req.query.redirect}`
  //       : undefined,
  //   }),
  // );

  return authMiddleware;
};
