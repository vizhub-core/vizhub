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
  <div className="stargazer">
    <a href={userProfileHref} className="stargazer-left">
      <img
        src={userAvatarURL}
        width="40"
        height="40"
        className="rounded-circle"
      ></img>
      <h4>{userDisplayName}</h4>
    </a>
    <div className="stargazer-right">
      <div>Starred on {starredDateFormatted}</div>
    </div>
  </div>
);
