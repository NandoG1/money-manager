// /Users/akmalhendrian/Desktop/coba1/money-manager-master/lib/mongoose.ts
import mongoose from "mongoose";

let isConnected = false;
const defaultMongoUri = "mongodb://localhost:27017/fintrack"; // Fallback for development

export const connectToDB = async () => {
  if (typeof window !== 'undefined') {
    console.log("Client-side: No need to connect to MongoDB directly");
    return;
  }

  if (isConnected) {
    console.log("Already connected to MongoDB");
    return;
  }

  const mongodbUri = process.env.ATLAS_DB_CONNECTION_STRING || defaultMongoUri;

  if (!mongodbUri) {
    console.error("MONGODB_URI environment variable is not defined and fallback is not available");

    return; 
  }

  try {
    console.log("Connecting to MongoDB...");

    mongoose.set('strictQuery', true);

    let sanitizedUri = "mongodb://[hidden-credentials]"; 
    try {
      if (mongodbUri) {
        const uri = new URL(mongodbUri);
        if (uri.password) {
          uri.password = "****"; 
        }
        sanitizedUri = uri.toString();
      }
    } catch (e) {
      console.warn("Could not parse MongoDB URI for sanitization:", e);
    }
    console.log("Using MongoDB URI:", sanitizedUri);

    let retries = 3;
    while (retries > 0) {
      try {
        await mongoose.connect(mongodbUri, {
        });
        isConnected = true;
        console.log("MongoDB connected successfully to database:", mongoose.connection.name);
        break; 
      } catch (error) {
        console.error(`MongoDB connection attempt failed. Retries left: ${retries - 1}. Error:`, error);
        retries--;
        if (retries === 0) {
          isConnected = false; 
          throw error; 
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * (4 - retries))); // Jeda sebelum retry berikutnya (1s, 2s, 3s)
      }
    }

    if (isConnected) {
      try {
        if (mongoose.connection.db) {
          const collections = await mongoose.connection.db.listCollections().toArray();
          const collectionNames = collections.map(c => c.name);
          console.log("Available collections:", collectionNames);
        } else {
          console.warn("mongoose.connection.db is undefined, cannot list collections.");
        }
      } catch (err) {
        console.warn("Could not list collections:", err);
      }

      try {
        if (mongoose.connection) {
            const collection = mongoose.connection.collection('userprogresses');
            const indices = await collection.indexInformation(); 
            if (!indices || !indices.user_1) { 
                await collection.createIndex({ user: 1 }, { unique: true });
                console.log("Created unique index on 'user' field in 'userprogresses' collection");
            }
        } else {
            console.warn("mongoose.connection is undefined, cannot create index.");
        }
      } catch (indexError: any) {
        if (indexError.codeName === 'NamespaceNotFound') {
            console.warn("Collection 'userprogresses' not found. Index creation skipped. This might be normal if the collection is created later.");
        } else {
            console.warn("Failed to create or check index for 'userprogresses':", indexError);
        }
      }
    }
  } catch (error) {
    console.error("General error in connectToDB function:", error);
    isConnected = false; 
  }
};