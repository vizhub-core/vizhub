// Inspired by
// https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/App.jsx
// https://github.com/vizhub-core/vizhub/blob/main/vizhub-v2/packages/neoFrontend/src/App.js
import { useMemo, Fragment } from 'react';
import {
  Route,
  Routes,
  useLocation,
} from './reactRouterExports';
import { LanguageProvider } from 'components';
import { pages } from './pages/client';

const debug = false;

export const App = ({ pageData }) => {
  // TODO handle client-side navigation.
  // See https://github.com/vizhub-core/vizhub3/issues/98
  // Every time App renders client-side, there may have been a navigation.
  const location = useLocation();
  const url = useMemo(
    () => location.pathname + location.search,
    [location.pathname, location.search],
  );
  if (!import.meta.env.SSR && url !== pageData.url) {
    if (debug) {
      console.log(
        'Might need to fetch page data from client',
      );
    }
  }

  return (
    <LanguageProvider>
      <Routes>
        {pages.map((Page) => (
          <Fragment key={Page.path}>
            <Route
              path={Page.path}
              element={<Page pageData={pageData} />}
            />
            {Page.path2 && (
              <Route
                path={Page.path2}
                element={<Page pageData={pageData} />}
              />
            )}
          </Fragment>
        ))}

        {/*
                    <Route path="/404" component={NotFoundPage} />
                    <Route
                      path="/authenticated/:provider"
                      component={AuthPopupPage}
                    />
                    <Route path="/authenticated" component={AuthPopupPage} />
                    <Route exact path="/" component={HomePage} />
                    <Route path="/auth" component={AuthPage} />
                    <Route path="/pricing" component={PricingPage} />
                    <Route
                      path="/upgrade-success"
                      component={UpgradeSuccessPage}
                    />
                    <Route
                      path="/upgrade-canceled"
                      component={UpgradeCanceledPage}
                    />
                    <Route path="/terms" component={TermsPage} />
                    <Route path="/datavis-2020" component={Datavis2020Page} />
                    <Route path="/contact" component={ContactPage} />
                    <Route path="/create-viz" component={CreateVizPage} />
                    <Route path="/search" component={SearchResultsPage} />
                    <Route path="/stats" component={VizHubStatsPage} />
                    <Route
                      path="/creating-viz-from-scratch"
                      component={CreatingVizFromScratchPage}
                    />
                    <Route
                      path="/:userName/:vizId/forks"
                      component={ForksPage}
                    />
                    <Route path="/:userName/account" component={AccountPage} />
                    <Route component={NotFoundPage} />
	  */}
      </Routes>
    </LanguageProvider>
  );
};
