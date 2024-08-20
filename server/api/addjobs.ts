import { MongoClient } from 'mongodb';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const uri = config.mongodbUri;
  const client = new MongoClient(uri);
  const collection = config.MONGODB_COLLECTION;

//  return;

  try {
    await client.connect();

    const db = client.db('test');

    console.log("log the type", body.type)

    if(body.type === "multi") {
      console.log("lo gthe data going in add jobs - MULTI", body.data);

      await db.collection('jobs').insertMany(body.data);
    } else {
      console.log("lo gthe data going in add jobs - INGLE", body.data);
      await db.collection(collection).insertOne(body.data[0]);
    }

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    console.log("did it in add jobs");
    await client.close();
  }
});
