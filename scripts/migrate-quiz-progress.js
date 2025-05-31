/**
 * Script to migrate quiz progress data to use ObjectId and add userId field
 * This script should be run once after the schema changes
 */

const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB
async function connectToDB() {
  try {
    if (!process.env.ATLAS_DB_CONNECTION_STRING) {
      console.error("MONGODB_URI environment variable is not defined");
      console.error(
        "Please create a .env file with your MongoDB connection string:",
      );
      console.error(
        "MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database",
      );
      process.exit(1);
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.ATLAS_DB_CONNECTION_STRING);
    console.log("Connected to MongoDB successfully");

    // List collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "Available collections:",
      collections.map((c) => c.name),
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

// Define schemas
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

const UserProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  userId: {
    type: String,
    required: true,
    index: true,
  },
  level: { type: Number, default: 1 },
  points: { type: Number, default: 0 },
  quizzesTaken: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  streakDays: { type: Number, default: 0 },
  lastQuizDate: { type: Date },
  badges: [
    {
      id: String,
      name: String,
      description: String,
      icon: String,
      unlocked: Boolean,
      unlockedAt: Date,
      category: String,
      requirement: String,
    },
  ],
  quizHistory: [
    {
      quizId: String,
      category: String,
      difficulty: String,
      score: Number,
      total: Number,
      date: Date,
    },
  ],
});

const LegacyUserProgressSchema = new mongoose.Schema({
  user: { type: String, required: true, index: true },
  level: { type: Number, default: 1 },
  points: { type: Number, default: 0 },
  quizzesTaken: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  streakDays: { type: Number, default: 0 },
  lastQuizDate: { type: Date },
  badges: [
    {
      id: String,
      name: String,
      description: String,
      icon: String,
      unlocked: Boolean,
      unlockedAt: Date,
      category: String,
      requirement: String,
    },
  ],
  quizHistory: [
    {
      quizId: String,
      category: String,
      difficulty: String,
      score: Number,
      total: Number,
      date: Date,
    },
  ],
});

async function checkCollections() {
  try {
    // Check if the userprogresses collection exists
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const hasUserProgressCollection = collections.some(
      (c) => c.name === "userprogresses",
    );

    if (!hasUserProgressCollection) {
      console.log("⚠️ The userprogresses collection does not exist yet!");
      console.log(
        "This is normal if no quiz data has been saved. The migration will be skipped.",
      );
      return false;
    }

    console.log("✅ Found userprogresses collection");

    // Check if the users collection exists
    const hasUsersCollection = collections.some((c) => c.name === "users");
    if (!hasUsersCollection) {
      console.log("⚠️ The users collection does not exist!");
      console.log(
        "The migration will still run, but user ObjectIds cannot be connected.",
      );
    } else {
      console.log("✅ Found users collection");
    }

    return true;
  } catch (error) {
    console.error("Error checking collections:", error);
    return false;
  }
}

async function migrateQuizProgress() {
  try {
    // Check that collections exist
    const collectionsExist = await checkCollections();
    if (!collectionsExist) {
      console.log("Skipping migration - collections not ready");
      return;
    }

    // Get models
    const User = mongoose.models.User || mongoose.model("User", UserSchema);
    const UserProgress =
      mongoose.models.UserProgress ||
      mongoose.model("UserProgress", UserProgressSchema);

    // Create a temporary model for the legacy schema to avoid conflicts
    const LegacyUserProgress = mongoose.model(
      "LegacyUserProgress",
      LegacyUserProgressSchema,
      "userprogresses",
    );

    // Check if any user documents exist
    const userCount = await User.countDocuments();
    console.log(`Found ${userCount} users in the database`);

    // Get all existing progress records
    const legacyProgresses = await LegacyUserProgress.find({});
    console.log(
      `Found ${legacyProgresses.length} quiz progress records to migrate`,
    );

    if (legacyProgresses.length === 0) {
      console.log("No progress records to migrate. Exiting.");
      return;
    }

    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // Iterate through each record
    for (const progress of legacyProgresses) {
      try {
        const userId = progress.user;

        // Skip if already has userId field
        if (progress.userId) {
          console.log(
            `Progress for user ${userId} already has userId field, skipping`,
          );
          skippedCount++;
          continue;
        }

        console.log(`Migrating progress for user: ${userId}`);

        // Try to find the user if the ID is an email
        let userObjId = null;
        if (userId.includes("@")) {
          const user = await User.findOne({ email: userId });
          if (user) {
            userObjId = user._id;
            console.log(
              `Found user with ObjectId ${userObjId} for email ${userId}`,
            );
          } else {
            console.log(`User not found for email ${userId}`);
          }
        }

        // Update the document to add userId field and user ObjectId if available
        await UserProgress.findByIdAndUpdate(progress._id, {
          $set: {
            userId: userId,
            ...(userObjId && { user: userObjId }),
          },
        });

        console.log(`Progress for user ${userId} updated successfully`);
        migratedCount++;
      } catch (error) {
        console.error(
          `Error updating progress for user ${progress.user}:`,
          error,
        );
        errorCount++;
      }
    }

    console.log("\nMigration completed:");
    console.log(`- ${migratedCount} records migrated successfully`);
    console.log(`- ${skippedCount} records already migrated (skipped)`);
    console.log(`- ${errorCount} records had errors during migration`);
  } catch (error) {
    console.error("Migration error:", error);
  }
}

async function run() {
  try {
    console.log("==== Quiz Progress Migration Script ====");
    await connectToDB();
    await migrateQuizProgress();
    console.log("\nScript completed successfully!");
    console.log("You can now restart your application to apply the changes.");
  } catch (error) {
    console.error("\nScript error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

run();
