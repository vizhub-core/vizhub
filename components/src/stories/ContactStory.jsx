import { Header } from '../components/Header';
import { HeaderTop } from '../components/HeaderTop';
import { Contact } from '../pages/Contact';

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
        <Contact />
      </div>
    </div>
  );
};

export default Story;
