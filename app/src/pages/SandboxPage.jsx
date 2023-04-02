import MongoDB from 'mongodb-legacy';

const { MongoClient, ServerApiVersion } = MongoDB;

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

  const v3MongoURI =
    'mongodb+srv://vizhub-app-server:dtW42z472ki6zlSM@vizhub3-pe-0.6sag6.mongodb.net/?retryWrites=true&w=majority';
  const v3MongoClient = new MongoClient(v3MongoURI);
  const v3MongoDBDatabase = await v3MongoDBConnection.db();

  let dbPing;
  try {
    await v3MongoDBDatabase.command({ ping: 1 });
    dbPing = 'success';
  } catch (error) {
    dbPing = error;
  }

  return { envVar, test: 'test', dbPing };
};
