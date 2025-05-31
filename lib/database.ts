import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.ATLAS_DB_CONNECTION_STRING) return console.log("MONGODB_URI Not Found");
  if (isConnected) return console.log("Already connected to MongoDB");

  try {
    await mongoose.connect(process.env.ATLAS_DB_CONNECTION_STRING);

    isConnected = true;
  } catch (error) {
    console.log(error);
  }
};

