import { MongoClient } from 'mongodb';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const { jobId, qrCodeUrl } = body;
  const shareableUrl = qrCodeUrl;

  if (!jobId || !shareableUrl) {
    return {
      statusCode: 400,
      body: { error: 'jobId and shareableUrl are required' },
    };
  }

  const uri = config.mongodbUri;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('test');
    await db.collection('jobs_backup').updateOne(
      { jobId: jobId },
      { $set: { qrCodeUrl: shareableUrl } }
    );

    return {
      statusCode: 200,
      body: { message: 'Shareable URL updated successfully' },
    };
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return {
      statusCode: 500,
      body: { error: 'Internal server error' },
    };
  } finally {
    await client.close();
  }
});
