import { Header } from '../components/Header';
import { HeaderTop } from '../components/HeaderTop';
import { LandingPageBody } from '../components/LandingPageBodyOld';
import { LanguageProvider } from '../components/LanguageContext';

const Story = () => {
  return (
    <LanguageProvider>
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
          <LandingPageBody />
        </div>
      </div>
    </LanguageProvider>
  );
};

export default Story;
