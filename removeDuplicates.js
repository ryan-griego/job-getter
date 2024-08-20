const { MongoClient } = require('mongodb');

async function removeDuplicates() {
  const uri = 'mongodb+srv://rippfball56:HenRocLiaYaBa@ryan-griego.x7xox5g.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB URI
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db('test'); // Replace with your database name
    const collection = db.collection('jobs_backup'); // Replace with your collection name

    // Find duplicates based on `_id`
    const duplicates = await collection.aggregate([
      { $group: { _id: "$jobId", count: { $sum: 1 }, docs: { $push: "$$ROOT" } } },
      { $match: { count: { $gt: 1 } } }
    ]).toArray();

    if (duplicates.length === 0) {
      console.log('No duplicates found.');
      return;
    }

    for (const duplicate of duplicates) {
      const { docs } = duplicate;

      // Log duplicate details for debugging
      console.log(`Found ${docs.length} documents with _id: ${duplicate._id}`);
      docs.forEach((doc, index) => {
        console.log(`Document ${index + 1}:`, doc);
      });

      // Keep the first document and delete the rest
      const [firstDoc, ...restDocs] = docs;
      const idsToDelete = restDocs.map(doc => doc._id);

      if (idsToDelete.length > 0) {
        console.log(`Deleting ${idsToDelete.length} duplicate(s) for _id: ${firstDoc._id}`);
        const deleteResult = await collection.deleteMany({ _id: { $in: idsToDelete } });
        console.log(`Deleted ${deleteResult.deletedCount} documents`);
      }
    }

    console.log('Duplicate removal complete');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    await client.close();
  }
}

removeDuplicates().catch(console.error);
