import { MongoClient } from 'mongodb';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const uri = config.keys.mongodbUri;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('test');
    const jobs = await db.collection('jobs').find({}).toArray();

    return {
      jobs,
    };
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return {
      jobs: [],
    };
  } finally {
    await client.close();
  }
});
