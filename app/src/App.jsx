// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/App.jsx
import { Link, Route, Routes } from 'react-router-dom';
import { About } from './pages/About';
import { Home } from './pages/Home';

const routes = [
  { name: 'About', path: '/about', component: About },
  { name: 'Home', path: '/', component: Home },
];

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
        {routes.map(({ path, component: RouteComp }) => {
          return <Route key={path} path={path} element={<RouteComp />}></Route>;
        })}
      </Routes>
    </>
  );
}
