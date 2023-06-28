import { Snapshot, User } from 'entities';
import { Gateways } from 'gateways';

export type Page = {
  // The component that renders this page (isomorphic).
  (props: { pageData: PageData }): JSX.Element;

  // The path to this page, with parameters.
  // e.g. '/:userName/:id';
  path: string;

  // A server-side-only function that returns the data for this page.
  getPageData?: ({
    params,
    env,
    gateways,
    auth0User,
  }: {
    // The URL parameters for this page, e.g. { userName: 'curran' }.
    params: { [key: string]: string };

    // Environment variables
    env?: { [key: string]: string };

    // Gateways for accessing the database.
    gateways: Gateways;

    // The authenticated user from Auth0, if any.
    auth0User: Auth0User | null;
  }) => Promise<PageData>;
};

export type PageData = {
  // The page title.
  title: string;

  // The authenticated user, if any.
  authenticatedUserSnapshot: Snapshot<User> | null;
};

// An example Auth0User object:
// {
//   nickname: 'curran',
//   name: 'Curran Kelleher',
//   picture: 'https://avatars.githubusercontent.com/u/68416?v=4',
//   updated_at: '2023-06-28T11:49:44.658Z',
//   email: 'curran.kelleher@gmail.com',
//   email_verified: true,
//   sub: 'github|68416',
//   sid: 'oaHgv-9KKGT9Fng0k-OerSSEZ6MW0Gr5'
// }
export type Auth0User = {
  nickname: string;
  name: string;
  picture: string;
  updated_at: string;
  email: string;
  email_verified: boolean;
  sub: string;
  sid: string;
};
