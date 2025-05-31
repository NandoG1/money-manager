"use client";

import { connectToDB } from "@/lib/mongoose";
import { auth, getCurrentUserInfo } from "@/auth";
import mongoose from "mongoose";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt: Date | undefined;
  category: string;
  requirement: string;
}

interface QuizHistoryItem {
  quizId: string;
  category?: string;
  difficulty?: string;
  score: number;
  total: number;
  date: Date;
}


interface UserProgressData {
  user: string;
  level: number;
  points: number;
  quizzesTaken: number;
  correctAnswers: number;
  streakDays: number;
  lastQuizDate?: Date;
  badges: Badge[];
  quizHistory: QuizHistoryItem[];
}


const defaultBadges = [
  {
    id: "first-quiz",
    name: "Quiz Beginner",
    description: "Complete your first quiz",
    icon: "🎓",
    unlocked: false,
    unlockedAt: undefined,
    category: "achievement",
    requirement: "Complete 1 quiz"
  },
  {
    id: "streak-master",
    name: "Streak Master",
    description: "Maintain a 3-day quiz streak",
    icon: "🔥",
    unlocked: false,
    unlockedAt: undefined,
    category: "achievement",
    requirement: "3-day streak"
  },
  {
    id: "perfect-score",
    name: "Perfect Score",
    description: "Get a perfect score on any quiz",
    icon: "🏆",
    unlocked: false,
    unlockedAt: undefined,
    category: "achievement",
    requirement: "100% score"
  },
  {
    id: "saving-expert",
    name: "Saving Expert",
    description: "Master saving concepts by scoring 80%+ on 3 saving quizzes",
    icon: "💰",
    unlocked: false,
    unlockedAt: undefined,
    category: "knowledge",
    requirement: "80%+ on 3 saving quizzes"
  },
  {
    id: "budgeting-expert",
    name: "Budgeting Expert",
    description: "Master budgeting concepts by scoring 80%+ on 3 budgeting quizzes",
    icon: "📊",
    unlocked: false,
    unlockedAt: undefined,
    category: "knowledge",
    requirement: "80%+ on 3 budgeting quizzes"
  },
  {
    id: "investing-expert",
    name: "Investing Expert",
    description: "Master investing concepts by scoring 80%+ on 3 investing quizzes",
    icon: "📈",
    unlocked: false,
    unlockedAt: undefined,
    category: "knowledge",
    requirement: "80%+ on 3 investing quizzes"
  },
  {
    id: "debt-expert",
    name: "Debt Management Expert",
    description: "Master debt concepts by scoring 80%+ on 3 debt quizzes",
    icon: "💳",
    unlocked: false,
    unlockedAt: undefined,
    category: "knowledge",
    requirement: "80%+ on 3 debt quizzes"
  },
  {
    id: "quiz-master",
    name: "Quiz Master",
    description: "Complete 10 quizzes with an average score of 80% or higher",
    icon: "👑",
    unlocked: false,
    unlockedAt: undefined,
    category: "achievement",
    requirement: "10 quizzes with 80%+ avg"
  },
  {
    id: "financial-guru",
    name: "Financial Guru",
    description: "Reach level 10 in your financial knowledge journey",
    icon: "🧠",
    unlocked: false,
    unlockedAt: undefined,
    category: "achievement",
    requirement: "Reach level 10"
  }
];


let UserProgress: any;


async function getUserProgressModel() {
  if (!UserProgress) {
    try {

      if (typeof window === 'undefined') {
        const importedModule = await import("@/lib/models/quiz.model");
        UserProgress = importedModule.default;
      } else {

        console.log("Client-side: Using API endpoints for quiz progress");

        return {};
      }
    } catch (err) {
      console.error("Error importing UserProgress model:", err);
    }
  }
  return UserProgress;
}


export async function getUserProgress() {
  try {

    if (typeof window !== 'undefined') {

      console.log("Client-side: Fetching user progress from API");
      
      try {
        const response = await fetch('/api/quiz/progress');
        if (!response.ok) {
          console.error(`Failed to fetch user progress: ${response.status} ${response.statusText}`);
          throw new Error(`Failed to fetch user progress: ${response.statusText}`);
        }
        const data = await response.json();
        
        try {
          const currentUser = getCurrentUserInfo();
          const userSpecificKey = `fintrack_quiz_progress_${currentUser.id}`;
          localStorage.setItem(userSpecificKey, JSON.stringify(data.userProgress));
        } catch (storageError) {
          console.warn("Could not save quiz progress to localStorage:", storageError);
        }
        
        return data.userProgress;
      } catch (error) {
        console.error("Error fetching user progress from API:", error);
        
        try {
          const currentUser = getCurrentUserInfo();
          const userSpecificKey = `fintrack_quiz_progress_${currentUser.id}`;
          const savedProgress = localStorage.getItem(userSpecificKey);
          if (savedProgress) {
            console.log(`Using quiz progress from localStorage for user: ${currentUser.id}`);
            return JSON.parse(savedProgress);
          }
        } catch (storageError) {
          console.warn("Could not read quiz progress from localStorage:", storageError);
        }
        
        console.log("Using fallback user progress data");
        const fallbackProgress = {
          level: 1,
          points: 0,
          quizzesTaken: 0,
          correctAnswers: 0,
          streakDays: 0,
          badges: defaultBadges,
          quizHistory: []
        };
        
        try {
          const currentUser = getCurrentUserInfo();
          const userSpecificKey = `fintrack_quiz_progress_${currentUser.id}`;
          localStorage.setItem(userSpecificKey, JSON.stringify(fallbackProgress));
        } catch (storageError) {
          console.warn("Could not save fallback progress to localStorage:", storageError);
        }
        
        return fallbackProgress;
      }
    }
    
    await connectToDB();
    
    const session = await auth();
    
    if (!session || !session.user) {
      throw new Error("User not authenticated");
    }
    
    const userId = session.user.id || session.user.email;
    
    if (!userId) {
      throw new Error("User ID not found in session");
    }
    
    console.log("Getting user progress for user:", userId);
    
    const UserProgressModel = await getUserProgressModel();
    if (!UserProgressModel) {
      throw new Error("UserProgress model not available");
    }
    
    let userProgress = await UserProgressModel.findOne({ userId: userId });
    
    if (!userProgress) {
      userProgress = await UserProgressModel.findOne({ user: userId });
    }
    
    if (!userProgress) {
      console.log("Creating new user progress for user:", userId);
      
      let userObjId = null;
      if (userId.includes('@')) {
        const userSchema = new mongoose.Schema({
          email: { type: String, required: true, unique: true }
        });
        
        const User = mongoose.models.User || mongoose.model("User", userSchema);
        
        const user = await User.findOne({ email: userId });
        if (user) {
          userObjId = user._id;
        }
      }
      
      userProgress = await UserProgressModel.create({
        user: userObjId || userId, 
        userId: userId,
        level: 1,
        points: 0,
        quizzesTaken: 0,
        correctAnswers: 0,
        streakDays: 0,
        badges: defaultBadges,
        quizHistory: []
      });
    } else {
      console.log("Found existing user progress for user:", userId);
    }
    
    return userProgress;
  } catch (error) {
    console.error("Error getting user progress:", error);
    
    return {
      level: 1,
      points: 0,
      quizzesTaken: 0,
      correctAnswers: 0,
      streakDays: 0,
      badges: defaultBadges,
      quizHistory: []
    };
  }
}

function checkForBadgeUnlocks(userProgress: any, category?: string, percentage?: number) {
  const unlockedBadges: Badge[] = [];
  
  const badges = [...userProgress.badges];
  
  const firstQuizBadge = badges.find(b => b.id === "first-quiz");
  if (firstQuizBadge && !firstQuizBadge.unlocked && userProgress.quizzesTaken >= 1) {
    firstQuizBadge.unlocked = true;
    firstQuizBadge.unlockedAt = new Date();
    unlockedBadges.push(firstQuizBadge);
  }
  
  const streakBadge = badges.find(b => b.id === "streak-master");
  if (streakBadge && !streakBadge.unlocked && userProgress.streakDays >= 3) {
    streakBadge.unlocked = true;
    streakBadge.unlockedAt = new Date();
    unlockedBadges.push(streakBadge);
  }
  
  const perfectBadge = badges.find(b => b.id === "perfect-score");
  if (perfectBadge && !perfectBadge.unlocked && percentage === 100) {
    perfectBadge.unlocked = true;
    perfectBadge.unlockedAt = new Date();
    unlockedBadges.push(perfectBadge);
  }
  
  if (category) {
    const categoryMap: { [key: string]: string } = {
      "saving": "saving-expert",
      "budgeting": "budgeting-expert",
      "investing": "investing-expert",
      "debt": "debt-expert"
    };
    
    const badgeId = categoryMap[category];
    if (badgeId) {
      const categoryBadge = badges.find(b => b.id === badgeId);
      if (categoryBadge && !categoryBadge.unlocked && percentage && percentage >= 80) {
        const highScoreQuizzes = userProgress.quizHistory.filter((q: QuizHistoryItem) => 
          q.category === category && ((q.score / q.total) * 100) >= 80
        );
        
        if (highScoreQuizzes.length >= 3) {
          categoryBadge.unlocked = true;
          categoryBadge.unlockedAt = new Date();
          unlockedBadges.push(categoryBadge);
        }
      }
    }
  }
  
  const quizMasterBadge = badges.find(b => b.id === "quiz-master");
  if (quizMasterBadge && !quizMasterBadge.unlocked && userProgress.quizzesTaken >= 10) {
    const totalScore = userProgress.quizHistory.reduce((sum: number, quiz: QuizHistoryItem) => sum + quiz.score, 0);
    const totalPossible = userProgress.quizHistory.reduce((sum: number, quiz: QuizHistoryItem) => sum + quiz.total, 0);
    const averagePercentage = (totalScore / totalPossible) * 100;
    
    if (averagePercentage >= 80) {
      quizMasterBadge.unlocked = true;
      quizMasterBadge.unlockedAt = new Date();
      unlockedBadges.push(quizMasterBadge);
    }
  }
  
  const guruBadge = badges.find(b => b.id === "financial-guru");
  if (guruBadge && !guruBadge.unlocked && userProgress.level >= 10) {
    guruBadge.unlocked = true;
    guruBadge.unlockedAt = new Date();
    unlockedBadges.push(guruBadge);
  }
  
  userProgress.badges = badges;
  
  return unlockedBadges;
}

export async function submitQuizResults(quizData: {
  category?: string;
  difficulty?: string;
  score: number;
  total: number;
}) {
  try {
    if (typeof window !== 'undefined') {
      console.log("Client-side: Submitting quiz results to API");
      
      try {
        const response = await fetch('/api/quiz/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(quizData),
        });
        
        if (!response.ok) {
          console.error(`Failed to submit quiz results: ${response.status} ${response.statusText}`);
          throw new Error(`Failed to submit quiz results: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        try {
          const currentUser = getCurrentUserInfo();
          const userSpecificKey = `fintrack_quiz_progress_${currentUser.id}`;
          localStorage.setItem(userSpecificKey, JSON.stringify(result.userProgress));
        } catch (storageError) {
          console.warn("Could not save updated quiz progress to localStorage:", storageError);
        }
        
        return result;
      } catch (error) {
        console.error("Error submitting quiz results to API:", error);
        
        try {
          console.log("Using fallback: Updating quiz progress in localStorage");
          
          const currentUser = getCurrentUserInfo();
          const userSpecificKey = `fintrack_quiz_progress_${currentUser.id}`;
          
          let currentProgress;
          try {
            const savedProgress = localStorage.getItem(userSpecificKey);
            currentProgress = savedProgress ? JSON.parse(savedProgress) : {
              level: 1,
              points: 0,
              quizzesTaken: 0,
              correctAnswers: 0,
              streakDays: 0,
              badges: defaultBadges,
              quizHistory: []
            };
          } catch (storageError) {
            console.warn("Could not read quiz progress from localStorage:", storageError);
            currentProgress = {
              level: 1,
              points: 0,
              quizzesTaken: 0,
              correctAnswers: 0,
              streakDays: 0,
              badges: defaultBadges,
              quizHistory: []
            };
          }
          
          const { category, difficulty, score, total } = quizData;
          const percentage = (score / total) * 100;
          
          currentProgress.quizHistory.push({
            quizId: new Date().getTime().toString(),
            category,
            difficulty,
            score,
            total,
            date: new Date()
          });
          
          currentProgress.quizzesTaken += 1;
          currentProgress.correctAnswers += score;
          
          let pointsEarned = score;
          if (difficulty === "medium") pointsEarned *= 2;
          if (difficulty === "hard") pointsEarned *= 3;
          
          currentProgress.points += pointsEarned;
          
          currentProgress.level = Math.floor(currentProgress.points / 100) + 1;
          
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (currentProgress.lastQuizDate) {
            const lastQuizDay = new Date(currentProgress.lastQuizDate);
            lastQuizDay.setHours(0, 0, 0, 0);
            
            const dayDifference = Math.floor((today.getTime() - lastQuizDay.getTime()) / (1000 * 60 * 60 * 24));
            
            if (dayDifference === 1) {
              currentProgress.streakDays += 1;
            } else if (dayDifference > 1) {
              currentProgress.streakDays = 1;
            }
          } else {
            currentProgress.streakDays = 1;
          }
          
          currentProgress.lastQuizDate = today;
          
          const unlockedBadges = checkForBadgeUnlocks(currentProgress, category, percentage);
          
          localStorage.setItem(userSpecificKey, JSON.stringify(currentProgress));
          
          console.log(`Updated quiz progress saved to localStorage for user: ${currentUser.id}`);
          
          return {
            userProgress: currentProgress,
            unlockedBadges
          };
        } catch (localStorageError) {
          console.error("Error updating progress in localStorage:", localStorageError);
          
          console.log("Using minimal fallback quiz submission data");
          
          const firstQuizBadge = defaultBadges.find(b => b.id === "first-quiz");
          const unlockedFirstQuizBadge = firstQuizBadge ? {
            ...firstQuizBadge,
            unlocked: true,
            unlockedAt: new Date()
          } : undefined;
          
          return {
            userProgress: {
              level: 1,
              points: quizData.score,
              quizzesTaken: 1,
              correctAnswers: quizData.score,
              streakDays: 1,
              badges: defaultBadges.map(badge => {
                if (badge.id === "first-quiz") {
                  return { ...badge, unlocked: true, unlockedAt: new Date() };
                }
                return badge;
              }),
              quizHistory: [{
                quizId: new Date().getTime().toString(),
                category: quizData.category,
                difficulty: quizData.difficulty,
                score: quizData.score,
                total: quizData.total,
                date: new Date()
              }]
            },
            unlockedBadges: unlockedFirstQuizBadge ? [unlockedFirstQuizBadge] : []
          };
        }
      }
    }
    
    await connectToDB();
    
    const session = await auth();
    
    if (!session || !session.user) {
      throw new Error("User not authenticated");
    }
    
    const userId = session.user.id || session.user.email;
    
    if (!userId) {
      throw new Error("User ID not found in session");
    }
    
    console.log("Submitting quiz results for user:", userId);
    
    const UserProgressModel = await getUserProgressModel();
    if (!UserProgressModel) {
      throw new Error("UserProgress model not available");
    }
    
    let userProgress = await UserProgressModel.findOne({ user: userId });
    
    if (!userProgress) {
      console.log("Creating new user progress for quiz submission:", userId);
      userProgress = await UserProgressModel.create({
        user: userId,
        level: 1,
        points: 0,
        quizzesTaken: 0,
        correctAnswers: 0,
        streakDays: 0,
        badges: defaultBadges,
        quizHistory: []
      });
    }
    
    const { category, difficulty, score, total } = quizData;
    const percentage = (score / total) * 100;
    
    userProgress.quizHistory.push({
      quizId: new Date().getTime().toString(),
      category,
      difficulty,
      score,
      total,
      date: new Date()
    });
    
    userProgress.quizzesTaken += 1;
    userProgress.correctAnswers += score;
    
    let pointsEarned = score;
    if (difficulty === "medium") pointsEarned *= 2;
    if (difficulty === "hard") pointsEarned *= 3;
    
    userProgress.points += pointsEarned;
    
    const newLevel = Math.floor(userProgress.points / 100) + 1;
    userProgress.level = newLevel;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (userProgress.lastQuizDate) {
      const lastQuizDay = new Date(userProgress.lastQuizDate);
      lastQuizDay.setHours(0, 0, 0, 0);
      
      const dayDifference = Math.floor((today.getTime() - lastQuizDay.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDifference === 1) {
        userProgress.streakDays += 1;
      } else if (dayDifference > 1) {
        userProgress.streakDays = 1;
      }
    } else {
      userProgress.streakDays = 1;
    }
    
    userProgress.lastQuizDate = today;
    
    const unlockedBadges = checkForBadgeUnlocks(userProgress, category, percentage);
    
    await userProgress.save();
    console.log("Saved updated user progress to database for user:", userId);
    
    return {
      userProgress,
      unlockedBadges
    };
  } catch (error) {
    console.error('Error updating user progress in database:', error);
    
    const mockUserProgress = {
      level: 1,
      points: quizData.score,
      quizzesTaken: 1,
      correctAnswers: quizData.score,
      streakDays: 1,
      badges: defaultBadges.map(badge => {
        if (badge.id === "first-quiz") {
          return { ...badge, unlocked: true, unlockedAt: new Date() };
        }
        return badge;
      }),
      quizHistory: [{
        quizId: new Date().getTime().toString(),
        category: quizData.category,
        difficulty: quizData.difficulty,
        score: quizData.score,
        total: quizData.total,
        date: new Date()
      }]
    };
    
    const firstQuizBadge = defaultBadges.find(b => b.id === "first-quiz");
    const unlockedFirstQuizBadge = firstQuizBadge ? {
      ...firstQuizBadge,
      unlocked: true,
      unlockedAt: new Date()
    } : undefined;
    
    return {
      userProgress: mockUserProgress,
      unlockedBadges: unlockedFirstQuizBadge ? [unlockedFirstQuizBadge] : []
    };
  }
}
