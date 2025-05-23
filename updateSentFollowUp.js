// updateSentFollowUp.js

// This file updates the sentFollowUp1 field to false for all documents where the jobType field is equal to "test".

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

async function updateSentFollowUp() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("✅ Connected successfully to MongoDB.");

    const database = client.db(DATABASE_NAME);
    const collection = database.collection(COLLECTION_NAME);

    // Define the filter and the update
    // const filter = {
    //   status: "Applied",
    //   jobPosterName: { $exists: true, $ne: null },
    //   jobPosterEmail: { $exists: true, $ne: null }
    // };
    const filter = {
      jobPosterEmail: 'ryangriego@gmail.com'
    };
    //const update = { $set: { sentFollowUp1: false } };
    const update = { $set: { sentFollowUp1: true } };

    // Perform the updateMany operation
    const updateResult = await collection.updateMany(filter, update);
    //const updateResult = await collection.updateMany(update);
    console.log(`📄 Matched Documents: ${updateResult.matchedCount}`);
    console.log(`📄 Modified Documents: ${updateResult.modifiedCount}`);

    if (updateResult.modifiedCount === 0) {
      console.log("ℹ️ No documents were updated.");
    } else {
      console.log("✅ Documents successfully updated.");
    }
  } catch (error) {
    console.error("❌ An error occurred:", error);
  } finally {
    // Close the connection
    await client.close();
    console.log("🔒 MongoDB connection closed.");
  }
}

// Execute the function
updateSentFollowUp();
