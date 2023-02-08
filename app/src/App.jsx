// Inspired by
// https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/App.jsx
// https://github.com/vizhub-core/vizhub/blob/main/vizhub-v2/packages/neoFrontend/src/App.js
import { Link, Route, Routes } from 'react-router-dom';
import { About } from './pages/About';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';

// TODO bring in this nav
//const Nav = () => (
//  <nav>
//    <ul>
//      {routes.map(({ name, path }) => {
//        return (
//          <li key={path}>
//            <Link to={path}>{name}</Link>
//          </li>
//        );
//      })}
//    </ul>
//  </nav>
//);

export function App() {
  return (
    <>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/" element={<Home />} />
        <Route path="/:userName" element={<Profile />} />

        {/*
                    <Route path="/:userName/:vizId" component={VizPage} />
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
    </>
  );
}
