import { useShareDBDocData } from '../../useShareDBDocData';
import { VizPageHead, Header } from 'components';
import { parseAuth0User } from '../parseAuth0User';

// Display `user.displayName` if it's populated.
// Otherwise fall back to `user.userName`.
const getUserDisplayName = (user) => user.displayName || user.userName;

// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const VizPage = ({ pageData }) => {
  const { infoSnapshot, ownerUserSnapshot } = pageData;

  const info = useShareDBDocData(infoSnapshot, 'Info');
  const ownerUser = useShareDBDocData(ownerUserSnapshot, 'User');

  console.log('TODO present this stuff:');
  console.log(JSON.stringify({ info, ownerUser }, null, 2));
  console.log('title', info.title);
  console.log('author', getUserDisplayName(ownerUser));

  // Send an analytics event to track this page view.
  // TODO match how vizHub2 does it, so we can use that existing data
  // useEffect(() => {
  //   vizKit.rest.recordAnalyticsEvents('pageview.viz.' + info.id);
  // }, []);

  // return info.title;

  const { authenticatedUserAvatarURL, authenticatedUserUserName } =
    parseAuth0User(pageData.auth0User);

  return (
    <div className="vh-page overflow-auto">
      <Header
        loginHref={'/login'}
        logoutHref={'/logout'}
        profileHref={`/${authenticatedUserUserName}`}
        authenticatedUserAvatarURL={authenticatedUserAvatarURL}
      ></Header>
      <VizPageHead />
    </div>
  );
};

VizPage.path = '/:userName/:id';
