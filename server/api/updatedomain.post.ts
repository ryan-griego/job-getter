import { MongoClient } from 'mongodb';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const uri = config.mongodbUri;
  const client = new MongoClient(uri);

  console.log('log the body in updatedomain', body);

  try {
    await client.connect();
    const db = client.db('test');
    await db.collection('jobs').updateOne({ jobId: body.jobId }, { $set: { companyOfficialUrl: body.domain } });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    console.log("did it in update domain");
    await client.close();
  }
});
