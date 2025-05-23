const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const moment = require("moment-timezone");

// Load environment variables from .env file
dotenv.config();

// Environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.MONGODB_DATABASE;
const COLLECTION_NAME = process.env.MONGODB_COLLECTION;

// Function to fetch the next 12 jobs to be processed
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
      jobPosterName: { $exists: true, $ne: null },
      jobPosterEmail: { $exists: true, $ne: null },
    };

    const threeMonthsAgo = moment().subtract(90, "days").toDate();

    // Find documents matching the criteria, sort by jobId, and limit results
    const documents = await collection
      .find(query)
      .sort({ jobId: 1 })
      .limit(limit)
      .toArray();

    // Filter documents by timestamp
    // const validDocuments = documents.filter((doc) => {
    //   if (doc.timestamp) {
    //     const docTimestamp = new Date(doc.timestamp);
    //     return docTimestamp <= threeMonthsAgo;
    //   }
    //   return false;
    // });

    console.log(`Next ${documents.length} jobs to be processed:`);
    documents.forEach((doc, index) => {
      console.log(`${index + 1}. Job ID: ${doc.jobId}, Title: ${doc.jobTitle}, Company: ${doc.companyName}`);
    });

    return validDocuments;
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
