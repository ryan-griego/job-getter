import { MongoClient } from 'mongodb';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const uri = config.mongodbUri;
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db('test');

    console.log("log the type", body.type)

    if(body.type === "multi") {
      await db.collection('jobs_backup').insertMany(body.data);
    } else {
      console.log("lo gthe data going in add jobs", body.data);
      await db.collection('jobs_backup').insertOne(body.data);
    }

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    console.log("did it in add jobs");
    await client.close();
  }
});
