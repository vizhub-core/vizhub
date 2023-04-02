import MongoDB from 'mongodb-legacy';

const { MongoClient, ServerApiVersion } = MongoDB;

export const SandboxPage = ({ pageData }) => {
  console.log('in sandbox page render');
  console.log(pageData);

  return (
    <pre style={{ fontSize: '2em' }}>{JSON.stringify(pageData, null, 2)}</pre>
  );
};

SandboxPage.path = '/sandbox';

SandboxPage.getPageData = async ({ env }) => {
  // TODO const username = env.VIZHUB3_MONGO_USERNAME;
  const password = env.VIZHUB3_MONGO_PASSWORD;
  const uri = `mongodb+srv://vizhub-app-server:${password}@vizhub3.6sag6.mongodb.net/?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });
  await client.connect();
  const db = client.db('test');
  const collections = await db.listCollections().toArray();
  await client.close();

  return { envVar, test: 'test', collections };
};
