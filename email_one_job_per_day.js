// Load environment variables from .env file
require('dotenv').config();

const { MongoClient } = require("mongodb");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

// MongoDB connection details (use environment variables for sensitive data)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://rippfball56:HenRocLiaYaBa@ryan-griego.x7xox5g.mongodb.net/?retryWrites=true&w=majority'
const DATABASE_NAME = "test"; // Replace with your actual database name
const COLLECTION_NAME = "jobs";
const TRACKING_COLLECTION = "cron_tracking"; // Collection to track the last processed document

// SendGrid API details (use environment variables for sensitive data)
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '***REMOVED***'
const TO_EMAIL = "ryangriego@gmail.com"; // Replace with your email
const FROM_EMAIL = "ryangriego@gmail.com"; // Replace with your email

async function main() {
  const client = new MongoClient(MONGODB_URI, { useUnifiedTopology: true });

  try {
    // Connect to MongoDB
    await client.connect();
    const database = client.db(DATABASE_NAME);
    const collection = database.collection(COLLECTION_NAME);
    const trackingCollection = database.collection(TRACKING_COLLECTION);

    // Get the last processed document's _id
    let trackingDoc = await trackingCollection.findOne({ _id: "lastProcessed" });
    let lastProcessedId = trackingDoc ? trackingDoc.lastId : null;

    // Build the query to fetch the next document
    const query = lastProcessedId ? { _id: { $gt: lastProcessedId } } : {};
    const nextDoc = await collection.find(query).sort({ _id: 1 }).limit(1).toArray();

    if (nextDoc.length === 0) {
      console.log("No more documents to process.");
      return;
    }

    const doc = nextDoc[0];
    const { jobPosterName, jobPosterEmail, companyName, jobTitle } = doc;
    const message = `Contact Name: ${jobPosterName}\nEmail: ${jobPosterEmail}\nCompany: ${companyName}\nJob Title: ${jobTitle}`;

    // Send the email
    const subject = `Today's Contact: ${jobPosterName}`;
    const emailResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: TO_EMAIL }], subject: subject }],
        from: { email: FROM_EMAIL },
        content: [{ type: "text/plain", value: message }],
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      throw new Error(`Email sending failed: ${emailResponse.status} ${emailResponse.statusText} - ${errorText}`);
    }

    console.log("Email sent successfully.");

    // Update the last processed document's _id
    await trackingCollection.updateOne(
      { _id: "lastProcessed" },
      { $set: { lastId: doc._id } },
      { upsert: true }
    );
  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    await client.close();
  }
}

main();
