// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/App.jsx
import { Link, Route, Routes } from 'react-router-dom';

// Auto generates routes from files under ./pages
// https://vitejs.dev/guide/features.html#glob-import
const pages = import.meta.glob('./pages/*.jsx', { eager: true });

const routes = Object.keys(pages).map((path) => {
  const name = path.match(/\.\/pages\/(.*)\.jsx$/)[1];
  return {
    name,
    path: name === 'Home' ? '/' : `/${name.toLowerCase()}`,
    component: pages[path].default,
  };
});

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
