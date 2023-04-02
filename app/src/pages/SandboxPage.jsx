export const SandboxPage = ({ pageData }) => {
  return (
    <pre style={{ fontSize: '4em' }}>{JSON.stringify(pageData, null, 2)}</pre>
  );
};

SandboxPage.path = '/sandbox';

SandboxPage.getPageData = async () => {
  const envVar = import.meta.env.VITE_SOME_KEY || 'not found';

  return { envVar, test: 'test' };
};
