import { MongoClient } from 'mongodb';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const uri = config.mongodbUri;
  const client = new MongoClient(uri);
  console.log("log the body IN UPDAT ROW", body);

  try {
    await client.connect();
    const db = client.db('test');

    await db.collection('jobs_backup').updateOne(
        { jobId: body.jobId },
        { $set: {
            companyOfficialUrl: body.domain,
            jobPosterName: body.jobPosterName,
            jobPosterEmail: body.jobPosterEmail,
            qrCodeUrl: body.qrCodeUrl,
            status: body.status,
          }
        }
      );

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    console.log("did it in update row");
    await client.close();
  }
});
