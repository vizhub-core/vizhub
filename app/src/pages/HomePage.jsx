import { useNavigate } from 'react-router-dom';
// Decoupled navigation from interaction, to support
// testing the UI in isolation, for example in Storybook.
// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const HomePage = () => {
  const navigate = useNavigate();
  return (
    <ul>
      <li onClick={() => navigate('/about')}>About</li>
    </ul>
  );
};
