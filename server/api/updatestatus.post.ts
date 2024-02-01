import { MongoClient } from 'mongodb';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const uri = config.mongodbUri;
  console.log('updatestatus.post.ts: uri:', uri);

  const client = new MongoClient(uri);


  try {
    await client.connect();

    const db = client.db('test');

    await db.collection('jobs').updateOne({ jobId: body }, { $set: { status: 'Sent' } });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    console.log("did it");
    await client.close();
  }
});
