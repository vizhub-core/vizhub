import './styles.scss';
export const Stargazer = ({
  userProfileHref,
  userAvatarURL,
  userDisplayName,
  starredDateFormatted,
}: {
  userProfileHref: string;
  userAvatarURL: string;
  userDisplayName: string;
  starredDateFormatted: string;
}) => (
  <a href={userProfileHref} className="stargazer">
    <img
      src={userAvatarURL}
      width="48"
      height="48"
      className="rounded-circle"
    ></img>
    <div className="stargazer-meta">
      <h4>{userDisplayName}</h4>
      <div className="starred-date">
        Starred on {starredDateFormatted}
      </div>
    </div>
  </a>
);
{
  /* <a href={userProfileHref} className="stargazer-left">
      <img
        src={userAvatarURL}
        width="40"
        height="40"
        className="rounded-circle"
      ></img>
      <h4>{userDisplayName}</h4>
    </a>
    <div className="stargazer-right">
     
    </div> */
}
