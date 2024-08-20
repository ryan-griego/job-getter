// import { MongoClient } from 'mongodb';


// interface JobUpdateBody {
//   jobId: string;
//   companyOfficialUrl?: string;
//   jobPosterName?: string;
//   jobPosterEmail?: string;
//   qrCodeUrl?: string;
//   status?: string;
// }

// export default defineEventHandler(async (event) => {
//   const config = useRuntimeConfig();
//   // const body = await readBody(event);
//   const body: JobUpdateBody = await readBody(event); // Use the interface here

//   const uri = config.mongodbUri;
//   const client = new MongoClient(uri);
//   console.log("log the body IN UPDAT ROW", body);


//   const updateFields: Partial<JobUpdateBody> = {}; // Define the type for the update object
//   if (body.companyOfficialUrl !== undefined) updateFields.companyOfficialUrl = body.companyOfficialUrl;
//   if (body.jobPosterName !== undefined) updateFields.jobPosterName = body.jobPosterName;
//   if (body.jobPosterEmail !== undefined) updateFields.jobPosterEmail = body.jobPosterEmail;
//   if (body.qrCodeUrl !== undefined) updateFields.qrCodeUrl = body.qrCodeUrl;
//   if (body.status !== undefined) updateFields.status = body.status;




//   try {
//     await client.connect();
//     const db = client.db('test');

//     await db.collection('jobs').updateOne(
//       { jobId: body.jobId },
//       { $set: updateFields } // Ensure updateFields is in scope here
//       { jobId: body.jobId },
//       {
//         $set: {
//           companyOfficialUrl: body.companyOfficialUrl,
//           jobPosterName: body.jobPosterName,
//           jobPosterEmail: body.jobPosterEmail,
//           qrCodeUrl: body.qrCodeUrl,
//           status: body.status,
//         }
//       }
//     );

//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//   } finally {
//     console.log("did it in update row");
//     await client.close();
//   }
// });

// import { MongoClient } from 'mongodb';

// interface JobUpdateBody {
//   jobId: string;
//   companyOfficialUrl?: string;
//   jobPosterName?: string;
//   jobPosterEmail?: string;
//   qrCodeUrl?: string;
//   status?: string;
// }

// export default defineEventHandler(async (event) => {
//   const config = useRuntimeConfig();
//   const body: JobUpdateBody = await readBody(event);

//   const uri = config.mongodbUri;
//   const client = new MongoClient(uri);
//   console.log("Log the body IN UPDATE ROW", body);

//   const updateFields: Partial<JobUpdateBody> = {};
//   if (body.companyOfficialUrl !== undefined) updateFields.companyOfficialUrl = body.companyOfficialUrl;
//   if (body.jobPosterName !== undefined) updateFields.jobPosterName = body.jobPosterName;
//   if (body.jobPosterEmail !== undefined) updateFields.jobPosterEmail = body.jobPosterEmail;
//   if (body.qrCodeUrl !== undefined) updateFields.qrCodeUrl = body.qrCodeUrl;
//   if (body.status !== undefined) updateFields.status = body.status;

//   console.log("Update fields:", updateFields);

//   try {
//     await client.connect();
//     const db = client.db('test');

//     const existingDocument = await db.collection('jobs').findOne({ jobId: body.jobId });
//     console.log("Existing document before update:", existingDocument);

//     const result = await db.collection('jobs').updateOne(
//       { jobId: body.jobId },
//       { $set: updateFields }
//     );

//     console.log("Update result:", result);

//     const updatedDocument = await db.collection('jobs').findOne({ jobId: body.jobId });
//     console.log("Updated document:", updatedDocument);

//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//   } finally {
//     console.log("Completed update operation");
//     await client.close();
//   }
// });














// import { MongoClient } from 'mongodb';

// interface JobUpdateBody {
//   jobId: string;
//   companyOfficialUrl?: string;
//   jobPosterName?: string[];
//   jobPosterEmail?: string[];
//   jobPosterProfileUrl?: string[];
//   qrCodeUrl?: string;
//   status?: string;
// }

// export default defineEventHandler(async (event) => {
//   const config = useRuntimeConfig();
//   const body: JobUpdateBody = await readBody(event);

//   const uri = config.mongodbUri;
//   const client = new MongoClient(uri);
//   console.log("Log the body IN UPDATE ROW", body);

//   try {
//     await client.connect();
//     const db = client.db('test');
//     const collection = db.collection('jobs');

//     const existingDocument = await collection.findOne({ jobId: body.jobId });
//     console.log("Existing document before update:", existingDocument);

//     const updateOperations: Record<string, any> = {};

//     console.log("log the body in UPDATE ROW", body);

//     if (body.jobPosterName !== undefined) {
//       let newNames: string[] = [];
//       if (typeof body.jobPosterName === 'string') {
//         newNames = [body.jobPosterName];
//       } else {
//         newNames = body.jobPosterName;
//       }

//       const existingNames = existingDocument?.jobPosterName || [];
//       const uniqueNames = Array.from(new Set([...existingNames, ...newNames]));

//       updateOperations.$set = { jobPosterName: uniqueNames };
//       console.log("Update operations after jobPosterName:", updateOperations);
//     }

//     if (body.jobPosterEmail !== undefined) {
//       let newEmails: string[] = [];
//       if (typeof body.jobPosterEmail === 'string') {
//         newEmails = [body.jobPosterEmail];
//       } else {
//         newEmails = body.jobPosterEmail;
//       }

//       const existingEmails = existingDocument?.jobPosterEmail || [];
//       const uniqueEmails = Array.from(new Set([...existingEmails, ...newEmails]));

//       updateOperations.$set = { jobPosterEmail: uniqueEmails };
//       console.log("Update operations after jobPosterEmail:", updateOperations);
//     }

//     if (body.jobPosterProfileUrl !== undefined) {
//       let newUrls: string[] = [];
//       if (typeof body.jobPosterProfileUrl === 'string') {
//         newUrls = [body.jobPosterProfileUrl];
//       } else {
//         newUrls = body.jobPosterProfileUrl;
//       }

//       const existingUrls = existingDocument?.jobPosterProfileUrl || [];
//       const uniqueUrls = Array.from(new Set([...existingUrls, ...newUrls]));

//       updateOperations.$set = { jobPosterProfileUrl: uniqueUrls };
//       console.log("Update operations after jobPosterProfileUrl:", updateOperations);
//     }

//     if (body.companyOfficialUrl !== undefined) {
//       updateOperations.$set = { companyOfficialUrl: body.companyOfficialUrl };
//     }
//     if (body.qrCodeUrl !== undefined) {
//       updateOperations.$set = { qrCodeUrl: body.qrCodeUrl };
//     }
//     if (body.status !== undefined) {
//       updateOperations.$set = { status: body.status };
//     }

//     console.log("Update fields:", updateOperations);

//     const result = await collection.updateOne(
//       { jobId: body.jobId },
//       updateOperations
//     );

//     console.log("Update result:", result);

//     const updatedDocument = await collection.findOne({ jobId: body.jobId });
//     console.log("Updated document:", updatedDocument);

//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//   } finally {
//     console.log("Completed update operation");
//     await client.close();
//   }
// });









import { MongoClient } from 'mongodb';

interface JobUpdateBody {
  jobId: string;
  companyOfficialUrl?: string;
  jobPosterName?: string[];
  jobPosterEmail?: string[];
  jobPosterProfileUrl?: string[];
  qrCodeUrl?: string;
  status?: string;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body: JobUpdateBody = await readBody(event);

  const uri = config.mongodbUri;
  const client = new MongoClient(uri);
  // console.log("Log the body IN UPDATE ROW", body);

  try {
    await client.connect();
    const db = client.db('test');
    const collection = db.collection('jobs');

    const existingDocument = await collection.findOne({ jobId: body.jobId });
    // console.log("Existing document before update:", existingDocument);

    const updateOperations: Record<string, any> = {
      $set: {} // Initialize $set as an empty object
    };

    if (body.jobPosterName !== undefined) {
      let newNames: string[] = Array.isArray(body.jobPosterName)
        ? body.jobPosterName
        : [body.jobPosterName];

      const existingNames = existingDocument?.jobPosterName || [];
      const uniqueNames = Array.from(new Set([...existingNames, ...newNames]));

      updateOperations.$set.jobPosterName = uniqueNames;
      // console.log("Update operations after jobPosterName:", updateOperations);
    }

    if (body.jobPosterEmail !== undefined) {
      let newEmails: string[] = Array.isArray(body.jobPosterEmail)
        ? body.jobPosterEmail
        : [body.jobPosterEmail];

      const existingEmails = existingDocument?.jobPosterEmail || [];
      const uniqueEmails = Array.from(new Set([...existingEmails, ...newEmails]));

      updateOperations.$set.jobPosterEmail = uniqueEmails;
      // console.log("Update operations after jobPosterEmail:", updateOperations);
    }

    if (body.jobPosterProfileUrl !== undefined) {
      let newUrls: string[] = Array.isArray(body.jobPosterProfileUrl)
        ? body.jobPosterProfileUrl
        : [body.jobPosterProfileUrl];

      const existingUrls = existingDocument?.jobPosterProfileUrl || [];
      const uniqueUrls = Array.from(new Set([...existingUrls, ...newUrls]));

      updateOperations.$set.jobPosterProfileUrl = uniqueUrls;
      // console.log("Update operations after jobPosterProfileUrl:", updateOperations);
    }

    if (body.companyOfficialUrl !== undefined) {
      updateOperations.$set.companyOfficialUrl = body.companyOfficialUrl;
    }

    if (body.qrCodeUrl !== undefined) {
      updateOperations.$set.qrCodeUrl = body.qrCodeUrl;
    }

    if (body.status !== undefined) {
      updateOperations.$set.status = body.status;
    }

    // console.log("Update fields:", updateOperations);

    const result = await collection.updateOne(
      { jobId: body.jobId },
      updateOperations
    );

    console.log("Update result:", result);

    const updatedDocument = await collection.findOne({ jobId: body.jobId });
    // console.log("Updated document:", updatedDocument);

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    console.log("Completed update operation");
    await client.close();
  }
});
