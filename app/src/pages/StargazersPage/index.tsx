import { Info, Timestamp, User } from 'entities';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { Page, PageData } from '../Page';
import { Body } from './Body';
import { getVizPageHref } from '../../accessors';
import { formatTimestamp } from '../../accessors/formatTimestamp';
import { Stargazer } from 'components';

export type StargazersPageData = PageData & {
  stargazers: Array<{
    userProfileHref: string;
    userAvatarURL: string;
    userDisplayName: string;
    upvotedTimestamp: Timestamp;
  }>;
  starredVizInfo: Info;
  starredVizOwnerUser: User;
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
                key={userProfileHref}
                userProfileHref={userProfileHref}
                userAvatarURL={userAvatarURL}
                userDisplayName={userDisplayName}
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

StargazersPage.path = '/:userName/:idOrSlug/stargazers';
