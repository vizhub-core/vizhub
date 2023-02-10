// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const ProfilePage = () => {
  return 'Profile';
};

ProfilePage.path = '/:userName';
ProfilePage.getPageData = async () => ({
  // TODO replace this with the user's name
  title: 'Profile Page',
});
