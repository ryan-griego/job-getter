import { MongoClient } from 'mongodb';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const uri = config.mongodbUri;
  const client = new MongoClient(uri);

  try {
    await client.connect();

    console.log("log the body in add jobs", body);
    const db = client.db('test');
    const jobsCollection = db.collection('jobs');

    for (const job of body) {
      const filter = { jobId: job.jobId }; // Replace 'jobId' with your unique identifier
      const update = { $set: job };
      const options = { upsert: true };
      await jobsCollection.updateOne(filter, update, options);
    }



    // await db.collection('jobs').insertMany(body);

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    console.log("did it in add jobs");
    await client.close();
  }
});
