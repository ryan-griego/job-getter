// updateDocumentsByJobPosterEmail.js

const { MongoClient } = require("mongodb");

// MongoDB connection details
const uri =
  "mongodb+srv://rippfball56:HenRocLiaYaBa@ryan-griego.x7xox5g.mongodb.net/?retryWrites=true&w=majority";
const DATABASE_NAME = "test"; // Replace with your database name
const COLLECTION_NAME = "jobs"; // Replace with your collection name

// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function updateDocumentsByJobPosterEmail() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("✅ Connected successfully to MongoDB.");

    const database = client.db(DATABASE_NAME);
    const collection = database.collection(COLLECTION_NAME);

    // Define the filter and update
    const filter = { jobPosterEmail: "ryangriego@gmail.com", companyName: "Example Company 4" };
    const update = {
      $set: {
        jobType: "test2",
        sentFollowUp1: false,
        status: "Sent"
      },
    };

    // Update the documents matching the filter
    const result = await collection.updateMany(filter, update);

    console.log(`✅ Updated ${result.modifiedCount} document(s).`);
  } catch (error) {
    console.error("❌ An error occurred:", error);
  } finally {
    // Close the connection
    await client.close();
    console.log("🔒 MongoDB connection closed.");
  }
}

// Execute the function
updateDocumentsByJobPosterEmail();
