import './styles.scss';

export const BetaConfirmPageBody = ({ onEmailSubmit }) => {
  return (
    <div className="vh-page vh-beta-confirm-page">
      <div className="blurb-container">
        <div className="blurb">
          <div className="callout large">Thanks!</div>
          <p className="description">
            Thanks for your interest! You'll be hearing from
            us.
          </p>
        </div>
      </div>
    </div>
  );
};
