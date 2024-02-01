import { MongoClient } from 'mongodb';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  // console.log('updatestatus.post.ts: body:', body);

  // Connect to MongoDB

  // const uri = 'mongodb+srv://rippfball56:49ersarenumberone@ryan-griego.x7xox5g.mongodb.net/?retryWrites=true&w=majority';
  const uri = config.mongodbUri;
  console.log('updatestatus.post.ts: uri:', uri);

  const client = new MongoClient(uri);


  try {
    // Connect to the MongoDB server
    await client.connect();

    // Access the MongoDB client
    const db = client.db('test');
    // console.log('updatestatus.post.ts: db:', db);
    // Use the db object to perform database operations

    // Update the job item that matches the jobId in the body with a status of "Sent"
    // Example:
    await db.collection('jobs').updateOne({ jobId: body }, { $set: { status: 'Sent' } });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    // Close the MongoDB client connection
    console.log("did it");
    await client.close();
  }
});
