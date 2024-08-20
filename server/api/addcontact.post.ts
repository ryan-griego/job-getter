import { MongoClient } from 'mongodb';

interface JobUpdateBody {
  jobId: string;
  jobPosterName?: string | string[]; // Allow single string or array of strings
  jobPosterEmail?: string | string[]; // Allow single string or array of strings
  jobPosterProfileUrl?: string | string[]; // Allow single string or array of strings
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body: JobUpdateBody = await readBody(event);

  console.log("Log the body going into addContact API endpoint:", body);

  const uri = config.mongodbUri;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('test');
    const collection = db.collection('jobs');

    // Prepare update operations
    const updateOperations: Record<string, any> = {};

    // Handle jobPosterName
    if (body.jobPosterName !== undefined) {
      let newNames: string[] = [];
      if (typeof body.jobPosterName === 'string') {
        newNames = [body.jobPosterName];
      } else {
        newNames = body.jobPosterName;
      }

      // Add $addToSet operation to the update object
      updateOperations.$addToSet = updateOperations.$addToSet || {};
      updateOperations.$addToSet.jobPosterName = { $each: newNames };
    }

    // Handle jobPosterEmail
    if (body.jobPosterEmail !== undefined) {
      let newEmails: string[] = [];
      if (typeof body.jobPosterEmail === 'string') {
        newEmails = [body.jobPosterEmail];
      } else {
        newEmails = body.jobPosterEmail;
      }

      // Add $addToSet operation to the update object
      updateOperations.$addToSet = updateOperations.$addToSet || {};
      updateOperations.$addToSet.jobPosterEmail = { $each: newEmails };
    }

    // Handle jobPosterProfileUrl
    if (body.jobPosterProfileUrl !== undefined) {
      let newUrls: string[] = [];
      if (typeof body.jobPosterProfileUrl === 'string') {
        newUrls = [body.jobPosterProfileUrl];
      } else {
        newUrls = body.jobPosterProfileUrl;
      }

      // Add $addToSet operation to the update object
      updateOperations.$addToSet = updateOperations.$addToSet || {};
      updateOperations.$addToSet.jobPosterProfileUrl = { $each: newUrls };
    }

    // Perform the update
    if (Object.keys(updateOperations).length > 0) {
      const result = await collection.updateOne(
        { jobId: body.jobId },
        updateOperations
      );

      console.log("Update result:", result); // Debugging: Check the result of the update operation

      // Fetch the document again to verify the update
      const updatedDocument = await collection.findOne({ jobId: body.jobId });
      console.log("Updated document:", updatedDocument);
    } else {
      console.log("No update operations were performed.");
    }

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    console.log("Completed update operation");
    await client.close();
  }
});
