const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://rippfball56:HenRocLiaYaBa@ryan-griego.x7xox5g.mongodb.net/?retryWrites=true&w=majority";

(async () => {
  const client = new MongoClient(uri);

  try {
    console.log("Connecting to MongoDB...");
    await client.connect();

    const database = client.db(); // Automatically selects the default database from the URI
    const collection = database.collection("jobs"); // Your collection name

    console.log("Fetching collection fields and sample data...");

    // Get a sample document
    const sampleDocument = await collection.findOne();
    if (sampleDocument) {
      console.log("Fields (Headers) in the 'jobs' collection:");
      console.log(Object.keys(sampleDocument));

      console.log("\nSample Document:");
      console.log(JSON.stringify(sampleDocument, null, 2));
    } else {
      console.log("No documents found in the 'jobs' collection.");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB or fetching data:", error);
  } finally {
    await client.close();
    console.log("Connection closed.");
  }
})();
