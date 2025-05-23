const { MongoClient } = require('mongodb');

// Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://rippfball56:HenRocLiaYaBa@ryan-griego.x7xox5g.mongodb.net/?retryWrites=true&w=majority';
const DATABASE_NAME = "test"; // Replace with your actual database name
const COLLECTION_NAME = "jobs";

// Function to retrieve a job by jobId
async function getJobById(companyOfficialUrl) {
  const client = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");

    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Query for the specific jobId
    const query = { companyOfficialUrl }; // Assumes jobId is a string or number exactly as stored

    const job = await collection.findOne(query);

    if (job) {
      console.log("Job found:", job);
    } else {
      console.log("No job found with jobId:", companyOfficialUrl);
    }

    return job;

  } catch (error) {
    console.error("An error occurred while retrieving the job:", error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed.");
  }
}

// Replace 'your-job-id-here' with the actual jobId you want to search for
getJobById("flaunt.com");
