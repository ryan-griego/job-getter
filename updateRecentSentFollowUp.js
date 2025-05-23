// updateRecentSentFollowUp.js

/**
 * This script updates the `sentFollowUp1` field to `false` for the 10 most recently added documents
 * in the specified MongoDB collection.
 */

const { MongoClient, ObjectId } = require("mongodb");

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

async function updateRecentSentFollowUp() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("✅ Connected successfully to MongoDB.");

    const database = client.db(DATABASE_NAME);
    const collection = database.collection(COLLECTION_NAME);

    // Step 1: Find the 10 most recently added documents
    // Assuming documents are added with an ObjectId `_id` that has a timestamp
    const recentDocsCursor = collection
      .find({})
      .sort({ _id: -1 }) // Sort by _id descending to get the latest documents
      .limit(10); // Limit to 10 documents

    const recentDocs = await recentDocsCursor.toArray();

    if (recentDocs.length === 0) {
      console.log("ℹ️ No documents found in the collection.");
      return;
    }

    // Extract the _id values of the recent documents
    const recentIds = recentDocs.map((doc) => doc._id);

    console.log(`📄 Found ${recentIds.length} recent documents to update.`);

    // Step 2: Update the `sentFollowUp1` field to false for these documents
    const filter = { _id: { $in: recentIds } };
    const update = { $set: { sentFollowUp1: false } };

    const updateResult = await collection.updateMany(filter, update);
    console.log(`📄 Matched Documents: ${updateResult.matchedCount}`);
    console.log(`📄 Modified Documents: ${updateResult.modifiedCount}`);

    if (updateResult.modifiedCount === 0) {
      console.log("ℹ️ No documents were updated. They might already have `sentFollowUp1` set to false.");
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
updateRecentSentFollowUp();
