const { MongoClient } = require("mongodb");

// MongoDB connection details
const uri = "mongodb+srv://rippfball56:HenRocLiaYaBa@ryan-griego.x7xox5g.mongodb.net/?retryWrites=true&w=majority";
const DATABASE_NAME = "test"; // Replace with your database name
const COLLECTION_NAME = "jobs"; // Replace with your collection name

// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function fetchTimestampsByJobType() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("✅ Connected successfully to MongoDB.");

    const database = client.db(DATABASE_NAME);
    const collection = database.collection(COLLECTION_NAME);

    // Define the filter
    const filter = { jobType: "test2" };

    // Fetch the documents matching the filter
    const documents = await collection.find(filter).project({ timestamp: 1, _id: 0 }).toArray();

    if (documents.length === 0) {
      console.log("ℹ️ No documents found with jobType 'test2'.");
    } else {
      console.log("\n📄 Documents with jobType 'test2':");
      documents.forEach((doc, index) => {
        const timestamp = doc.timestamp;
        console.log(`Document ${index + 1}:`);
        console.log(`  Timestamp: ${timestamp}`);
        console.log(`  Type: ${typeof timestamp}`);
      });
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
fetchTimestampsByJobType();
