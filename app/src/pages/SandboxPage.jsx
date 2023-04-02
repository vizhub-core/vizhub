export const SandboxPage = ({ pageData }) => {
  console.log('in sandbox page render');
  console.log(pageData);

  return (
    <pre style={{ fontSize: '4em' }}>{JSON.stringify(pageData, null, 2)}</pre>
  );
};

SandboxPage.path = '/sandbox';

SandboxPage.getPageData = async ({ env }) => {
  const envVar = env.VITE_SOME_KEY || 'not found';
  console.log('in sandbox page getPageData');
  console.log(envVar);

  return { envVar, test: 'test' };
};
