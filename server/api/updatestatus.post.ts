import { MongoClient } from 'mongodb';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const uri = config.keys.mongodbUri;
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db('test');

    // Handle both old format (just jobId) and new format (object with jobId and status)
    let jobId, status;
    if (typeof body === 'object' && body.jobId) {
      jobId = body.jobId;
      status = body.status || 'Sent'; // Default to 'Sent' for backward compatibility
    } else {
      jobId = body; // Old format - just the jobId
      status = 'Sent'; // Default status
    }

    console.log(`Updating job ${jobId} status to: ${status}`);
    await db.collection('jobs').updateOne({ jobId: jobId }, { $set: { status: status } });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    console.log("did it");
    await client.close();
  }
});
