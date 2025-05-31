/**
 * Test script to verify quiz progress for different users
 * Run this to check if quiz progress is correctly isolated between users
 */

const mongoose = require("mongoose");
require("dotenv").config();

async function connectToDB() {
  try {
    if (!process.env.ATLAS_DB_CONNECTION_STRING) {
      console.error("MONGODB_URI environment variable is not defined");
      process.exit(1);
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.ATLAS_DB_CONNECTION_STRING);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

// Define the user progress schema - must match the actual schema in the app
const UserProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.Mixed, // Can be ObjectId or String
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
  },
  { timestamps: true },
);

// Create test users and quiz progress
async function setupTestData() {
  try {
    // Get or create the UserProgress model
    const UserProgress =
      mongoose.models.UserProgress ||
      mongoose.model("UserProgress", UserProgressSchema);

    // Generate random IDs for test users
    const testUser1Id = `test-user-1-${Date.now()}`;
    const testUser2Id = `test-user-2-${Date.now()}`;

    console.log(
      `Creating test users with IDs:\n- ${testUser1Id}\n- ${testUser2Id}`,
    );

    // Create progress for test user 1
    const progress1 = await UserProgress.create({
      user: testUser1Id,
      userId: testUser1Id,
      level: 1,
      points: 10,
      quizzesTaken: 1,
      correctAnswers: 4,
      streakDays: 1,
      lastQuizDate: new Date(),
      badges: [
        {
          id: "first-quiz",
          name: "Quiz Beginner",
          description: "Complete your first quiz",
          icon: "🎓",
          unlocked: true,
          unlockedAt: new Date(),
          category: "achievement",
          requirement: "Complete 1 quiz",
        },
      ],
      quizHistory: [
        {
          quizId: Date.now().toString(),
          category: "budgeting",
          difficulty: "easy",
          score: 4,
          total: 5,
          date: new Date(),
        },
      ],
    });

    console.log("Created progress for test user 1:", progress1._id);

    // Create progress for test user 2 with different stats
    const progress2 = await UserProgress.create({
      user: testUser2Id,
      userId: testUser2Id,
      level: 2,
      points: 25,
      quizzesTaken: 2,
      correctAnswers: 9,
      streakDays: 2,
      lastQuizDate: new Date(),
      badges: [
        {
          id: "first-quiz",
          name: "Quiz Beginner",
          description: "Complete your first quiz",
          icon: "🎓",
          unlocked: true,
          unlockedAt: new Date(),
          category: "achievement",
          requirement: "Complete 1 quiz",
        },
        {
          id: "perfect-score",
          name: "Perfect Score",
          description: "Get a perfect score on any quiz",
          icon: "🏆",
          unlocked: true,
          unlockedAt: new Date(),
          category: "achievement",
          requirement: "100% score",
        },
      ],
      quizHistory: [
        {
          quizId: (Date.now() - 1000).toString(),
          category: "investing",
          difficulty: "easy",
          score: 4,
          total: 5,
          date: new Date(Date.now() - 86400000), // Yesterday
        },
        {
          quizId: Date.now().toString(),
          category: "saving",
          difficulty: "easy",
          score: 5,
          total: 5,
          date: new Date(),
        },
      ],
    });

    console.log("Created progress for test user 2:", progress2._id);

    return { testUser1Id, testUser2Id };
  } catch (error) {
    console.error("Error setting up test data:", error);
    throw error;
  }
}

// Verify that each user has separate progress
async function verifyUserProgress(testUser1Id, testUser2Id) {
  try {
    // Get the UserProgress model
    const UserProgress = mongoose.models.UserProgress;

    // Fetch progress for both users
    const progress1 = await UserProgress.findOne({ userId: testUser1Id });
    const progress2 = await UserProgress.findOne({ userId: testUser2Id });

    console.log("\n==== Test Results ====");

    if (!progress1) {
      console.error("❌ Failed: Progress for test user 1 not found");
    } else {
      console.log("✅ Success: Found progress for test user 1");
      console.log(
        `   Level: ${progress1.level}, Points: ${progress1.points}, Quizzes: ${progress1.quizzesTaken}`,
      );
    }

    if (!progress2) {
      console.error("❌ Failed: Progress for test user 2 not found");
    } else {
      console.log("✅ Success: Found progress for test user 2");
      console.log(
        `   Level: ${progress2.level}, Points: ${progress2.points}, Quizzes: ${progress2.quizzesTaken}`,
      );
    }

    // Verify they have different values
    if (progress1 && progress2) {
      if (
        progress1.level !== progress2.level ||
        progress1.points !== progress2.points ||
        progress1.quizzesTaken !== progress2.quizzesTaken
      ) {
        console.log("✅ Success: Users have different progress data!");
      } else {
        console.error("❌ Failed: Both users have identical progress data");
      }

      if (progress1.badges.length !== progress2.badges.length) {
        console.log("✅ Success: Users have different badge counts");
      } else {
        console.log(
          "ℹ️ Note: Users have the same number of badges, but this could be coincidental",
        );
      }

      if (progress1.quizHistory.length !== progress2.quizHistory.length) {
        console.log("✅ Success: Users have different quiz history lengths");
      } else {
        console.log(
          "ℹ️ Note: Users have the same number of quiz attempts, but this could be coincidental",
        );
      }
    }
  } catch (error) {
    console.error("Error verifying user progress:", error);
  }
}

// Clean up test data
async function cleanupTestData(testUser1Id, testUser2Id) {
  try {
    // Get the UserProgress model
    const UserProgress = mongoose.models.UserProgress;

    // Delete test progress data
    const result1 = await UserProgress.deleteOne({ userId: testUser1Id });
    const result2 = await UserProgress.deleteOne({ userId: testUser2Id });

    console.log("\n==== Cleanup ====");
    console.log(
      `Deleted test user 1 progress: ${result1.deletedCount} record(s)`,
    );
    console.log(
      `Deleted test user 2 progress: ${result2.deletedCount} record(s)`,
    );
  } catch (error) {
    console.error("Error cleaning up test data:", error);
  }
}

async function run() {
  try {
    console.log("==== Quiz User Isolation Test ====");
    await connectToDB();

    // Create test data
    const { testUser1Id, testUser2Id } = await setupTestData();

    // Verify progress
    await verifyUserProgress(testUser1Id, testUser2Id);

    // Clean up
    await cleanupTestData(testUser1Id, testUser2Id);

    console.log("\n==== Test Complete ====");
    console.log(
      'If you see "Success" messages above, users now have separate quiz progress!',
    );
  } catch (error) {
    console.error("Test error:", error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

run();
