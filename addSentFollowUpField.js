const { MongoClient } = require("mongodb");

// Replace with your MongoDB connection URI
const uri = "mongodb+srv://rippfball56:HenRocLiaYaBa@ryan-griego.x7xox5g.mongodb.net/?retryWrites=true&w=majority";

(async () => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    // Specify the database you want to use
    const db = client.db(); // Uses default database from URI if specified

    // Update all documents in the 'jobs' collection to add 'sentFollowUp1: true'
    const result = await db.collection("jobs").updateMany(
      {}, // Match all documents
      { $set: { sentFollowUp1: true } } // Add 'sentFollowUp1: true'
    );

    console.log(`${result.matchedCount} documents matched the filter.`);
    console.log(`${result.modifiedCount} documents were updated.`);
  } catch (error) {
    console.error("Error updating documents:", error);
  } finally {
    await client.close();
    console.log("Connection closed.");
  }
})();
