import { auth } from 'express-openid-connect';
import { decodeJwt } from 'jose';
import { UpdateOrCreateUser, RecordAnalyticsEvents } from 'interactors';
import { dateToTimestamp } from 'entities';

// Deals with authentication via Auth0.
export const authentication = ({ app, env, gateways }) => {
  const updateOrCreateUser = UpdateOrCreateUser(gateways);
  const recordAnalyticsEvents = RecordAnalyticsEvents(gateways);

  // See https://github.com/auth0/express-openid-connect/blob/master/EXAMPLES.md#9-validate-claims-from-an-id-token-before-logging-a-user-in
  const afterCallback = async (req, res, session) => {
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
    const id = claims.sub.startsWith('github')
      ? claims.sub.substring(7)
      : claims.sub;

    const options = {
      id,
      userName: claims.nickname,
      displayName: claims.name,
      primaryEmail: claims.email,
      picture: claims.picture,
    };

    const result = await updateOrCreateUser(options);

    if (result.outcome !== 'success') {
      console.log('Error when updating user');
      console.log(result.error);
    }

    await recordAnalyticsEvents({
      eventId: `login.${id}`,
      // TODO consider making this the default internally
      timestamp: dateToTimestamp(new Date()),
    });
    // TODO record analytics event
    // TODO update first login timestamp on user
    // TODO update last login timestamp on user

    return session;
  };

  app.use(
    auth({
      authRequired: false,
      auth0Logout: true,
      secret: env.VIZHUB3_AUTH0_SECRET,
      baseURL: env.VIZHUB3_AUTH0_BASE_URL,
      clientID: env.VIZHUB3_AUTH0_CLIENT_ID,
      issuerBaseURL: env.VIZHUB3_AUTH0_ISSUER_BASE_URL,
      routes: {
        // This is particular for the GitHub auth provider
        callback: '/login/callback',
      },
      afterCallback,
    })
  );
};
