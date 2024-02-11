import {
  Timestamp,
  User,
  getUserDisplayName,
} from 'entities';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { Page, PageData } from '../Page';
import { Body } from './Body';
import {
  getProfilePageHref,
  getVizPageHref,
} from '../../accessors';
import { getAvatarURL } from '../../accessors/getAvatarURL';
import { formatTimestamp } from '../../accessors/formatTimestamp';
import { Stargazer } from 'components';

export type StargazersPageData = PageData & {
  stargazers: Array<{
    userProfileHref: string;
    userAvatarURL: string;
    userDisplayName: string;
    upvotedTimestamp: Timestamp;
  }>;
  authenticatedUserSnapshot;
  starredVizInfo;
  starredVizOwnerUser;
};

// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const StargazersPage: Page = ({
  pageData: {
    authenticatedUserSnapshot,
    stargazers,
    starredVizInfo,
    starredVizOwnerUser,
  },
}: {
  pageData: StargazersPageData;
}) => (
  <AuthenticatedUserProvider
    authenticatedUserSnapshot={authenticatedUserSnapshot}
  >
    <Body
      starredVizTitle={starredVizInfo.title}
      starredVizHref={getVizPageHref({
        ownerUser: starredVizOwnerUser,
        info: starredVizInfo,
      })}
      renderStargazers={() => (
        <>
          {stargazers.map(
            ({
              userProfileHref,
              userAvatarURL,
              userDisplayName,
              upvotedTimestamp,
            }) => (
              <Stargazer
                userProfileHref={getProfilePageHref(user)}
                userAvatarURL={getAvatarURL(user)}
                userDisplayName={getUserDisplayName(user)}
                starredDateFormatted={formatTimestamp(
                  upvotedTimestamp,
                )}
              />
            ),
          )}
        </>
      )}
    />
  </AuthenticatedUserProvider>
);

StargazersPage.path = '/:userName/:id/stargazers';
