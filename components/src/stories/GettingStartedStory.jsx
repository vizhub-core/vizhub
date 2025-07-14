import { Header } from '../components/Header';
import { HeaderTop } from '../components/HeaderTop';
import { GettingStarted } from '../pages/GettingStarted';

const Story = () => {
  return (
    <div className="layout-fullscreen">
      <div className="vh-page">
        <HeaderTop />
        <Header 
          authenticatedUserAvatarURL=""
          loginHref="/login"
          logoutHref="/logout"
          profileHref="/profile"
          createVizHref="/create"
          onVizHubClick={() => {}}
          pricingHref="/pricing"
          onNotificationsClick={() => {}}
          onBillingClick={() => {}}
          userHasNotifications={false}
        />
        <GettingStarted />
      </div>
    </div>
  );
};

export default Story;
