const { MongoClient } = require('mongodb');

async function convertFieldsToArrays() {
  const uri = 'mongodb+srv://rippfball56:HenRocLiaYaBa@ryan-griego.x7xox5g.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB URI
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('test'); // Replace with your database name
    const collection = db.collection('jobs'); // Replace with your collection name

    // Find documents that have the fields we want to update
    const documents = await collection.find({}).toArray();

    if (documents.length === 0) {
      console.log('No documents found.');
      return;
    }

    for (const doc of documents) {
      const updates = {};

      if (doc.jobPosterName && typeof doc.jobPosterName === 'string') {
        updates.jobPosterName = [doc.jobPosterName];
      } else if (Array.isArray(doc.jobPosterName)) {
        updates.jobPosterName = doc.jobPosterName;
      }

      if (doc.jobPosterProfileUrl && typeof doc.jobPosterProfileUrl === 'string') {
        updates.jobPosterProfileUrl = [doc.jobPosterProfileUrl];
      } else if (Array.isArray(doc.jobPosterProfileUrl)) {
        updates.jobPosterProfileUrl = doc.jobPosterProfileUrl;
      }

      if (doc.jobPosterEmail && typeof doc.jobPosterEmail === 'string') {
        updates.jobPosterEmail = [doc.jobPosterEmail];
      } else if (Array.isArray(doc.jobPosterEmail)) {
        updates.jobPosterEmail = doc.jobPosterEmail;
      }

      if (Object.keys(updates).length > 0) {
        console.log(`Updating document with jobId: ${doc.jobId}`);
        const updateResult = await collection.updateOne(
          { _id: doc._id },
          { $set: updates }
        );
        console.log(`Updated ${updateResult.modifiedCount} document(s)`);
      }
    }

    console.log('Field conversion complete');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    await client.close();
  }
}

convertFieldsToArrays().catch(console.error);
