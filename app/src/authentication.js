import { auth } from 'express-openid-connect';

// Deals with authentication via Auth0.
export const authentication = ({ app, env }) => {
  app.use(
    auth({
      authRequired: false,
      auth0Logout: true,
      secret: env.VIZHUB3_AUTH0_SECRET,
      baseURL: env.VIZHUB3_AUTH0_BASE_URL,
      clientID: env.VIZHUB3_AUTH0_CLIENT_ID,
      issuerBaseURL: env.VIZHUB3_AUTH0_ISSUER_BASE_URL,
      routes: {
        callback: '/login/callback',
      },
    })
  );
};
