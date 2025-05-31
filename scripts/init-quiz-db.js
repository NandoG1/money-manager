// Script to initialize the quiz database collection
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Define the badge schema
const BadgeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  unlocked: { type: Boolean, default: false },
  unlockedAt: { type: Date, default: null },
  category: { type: String, required: true },
  requirement: { type: String, required: true },
});

// Define the user progress schema
const UserProgressSchema = new mongoose.Schema({
  user: { type: String, required: true, index: true },
  level: { type: Number, default: 1 },
  points: { type: Number, default: 0 },
  quizzesTaken: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  streakDays: { type: Number, default: 0 },
  lastQuizDate: { type: Date },
  badges: [BadgeSchema],
  quizHistory: [{
    quizId: { type: String },
    category: { type: String },
    difficulty: { type: String },
    score: { type: Number },
    total: { type: Number },
    date: { type: Date, default: Date.now }
  }]
});

// Create the model
const UserProgress = mongoose.model("UserProgress", UserProgressSchema);

// Default badges
const defaultBadges = [
  {
    id: "first-quiz",
    name: "Quiz Beginner",
    description: "Complete your first quiz",
    icon: "🎓",
    unlocked: false,
    unlockedAt: null,
    category: "achievement",
    requirement: "Complete 1 quiz"
  },
  {
    id: "streak-master",
    name: "Streak Master",
    description: "Maintain a 3-day quiz streak",
    icon: "🔥",
    unlocked: false,
    unlockedAt: null,
    category: "achievement",
    requirement: "3-day streak"
  },
  {
    id: "perfect-score",
    name: "Perfect Score",
    description: "Get a perfect score on any quiz",
    icon: "🏆",
    unlocked: false,
    unlockedAt: null,
    category: "achievement",
    requirement: "100% score"
  }
];

async function initializeDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.ATLAS_DB_CONNECTION_STRING);
    console.log('Connected to MongoDB');

    // Create a test user progress document
    const testUser = await UserProgress.create({
      user: 'test-user',
      level: 1,
      points: 0,
      quizzesTaken: 0,
      correctAnswers: 0,
      streakDays: 0,
      badges: defaultBadges,
      quizHistory: []
    });

    console.log('Test user created:', testUser);
    
    // Count documents in collection
    const count = await UserProgress.countDocuments();
    console.log(`Total documents in UserProgress collection: ${count}`);
    
    // List all collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in database:');
    collections.forEach(collection => {
      console.log(` - ${collection.name}`);
    });

  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the initialization
initializeDatabase();
