const { MongoClient } = require('mongodb');

// Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://rippfball56:HenRocLiaYaBa@ryan-griego.x7xox5g.mongodb.net/?retryWrites=true&w=majority';
const DATABASE_NAME = "test"; // Replace with your actual database name
const COLLECTION_NAME = "jobs";

// Regular expression to validate email addresses
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function countJobsWithEmail() {
  const client = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected successfully to MongoDB");

    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Define the query to match valid email addresses in jobPosterEmail
    const query = { jobPosterEmail: { $regex: emailRegex } };

    // Count the number of matching documents
    const count = await collection.countDocuments(query);

    console.log(`Total number of documents with a valid jobPosterEmail: ${count}`);

    return count;

  } catch (error) {
    console.error("An error occurred while counting documents:", error);
  } finally {
    // Close the MongoDB connection
    await client.close();
    console.log("MongoDB connection closed.");
  }
}

// Execute the function
countJobsWithEmail();
