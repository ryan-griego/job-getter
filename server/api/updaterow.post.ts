import { MongoClient } from 'mongodb';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const uri = config.keys.mongodbUri;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('test');

    console.log("log the body going in toupdate row", body);

    await db.collection('jobs').updateOne(
        { jobId: body.jobId },
        { $set: {
            companyOfficialUrl: body.domain,
            jobPosterName: body.jobPosterName,
            jobPosterEmail: body.jobPosterEmail,
            qrCodeUrl: body.qrCodeUrl ?? "",
            //status: body.status,
            outcome: body.outcome ?? "",
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
