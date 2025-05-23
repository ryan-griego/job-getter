const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.MONGODB_DATABASE;
const COLLECTION_NAME = process.env.MONGODB_COLLECTION;

// Function to fetch the next 10 jobs sorted by the oldest timestamp
async function getNextJobs(limit = 12) {
  let client;

  try {
    client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Query to fetch relevant documents
    const query = {
      sentFollowUp1: false,
      status: "Sent",
      // jobPosterName: { $exists: true, $ne: null },
      // jobPosterEmail: { $exists: true, $ne: null },
      jobPosterName: { $exists: true, $nin: [null, ""] },
      jobPosterEmail: { $exists: true, $nin: [null, ""] },

    };

    // Find documents matching the criteria, sort by timestamp, and limit results
    const documents = await collection
      .find(query)
      .sort({ timestamp: 1 }) // Sort by oldest timestamp
      .limit(limit)
      .toArray();

    console.log(`Next ${documents.length} jobs to be processed:`);
    documents.forEach((doc, index) => {
      console.log(
        `${index + 1}. Job ID: ${doc.jobId}, Title: ${doc.jobTitle}, Company: ${doc.companyName}, Timestamp: ${doc.timestamp}`
      );
    });

    return documents;
  } catch (error) {
    console.error("Error fetching documents:", error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Execute the script
getNextJobs();
