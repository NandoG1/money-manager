// app/api/quiz/progress/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose"; 
import { auth } from "@/auth"; 
import { connectToDB } from "@/lib/mongoose";
import UserProgress from "@/lib/models/quiz.model";
import User from "@/lib/models/user.model";    

const defaultBadges = [
  { id: "first-quiz", name: "Quiz Beginner", description: "Complete your first quiz", icon: "🎓", unlocked: false, category: "achievement", requirement: "Complete 1 quiz" },
  { id: "streak-master", name: "Streak Master", description: "Maintain a 3-day quiz streak", icon: "🔥", unlocked: false, category: "achievement", requirement: "3-day streak" },
  { id: "perfect-score", name: "Perfect Score", description: "Get a perfect score on any quiz", icon: "🏆", unlocked: false, category: "achievement", requirement: "100% score" },
  { id: "saving-expert", name: "Saving Expert", description: "Master saving concepts by scoring 80%+ on 3 saving quizzes", icon: "💰", unlocked: false, category: "knowledge", requirement: "80%+ on 3 saving quizzes" },
  { id: "budgeting-expert", name: "Budgeting Expert", description: "Master budgeting concepts by scoring 80%+ on 3 budgeting quizzes", icon: "📊", unlocked: false, category: "knowledge", requirement: "80%+ on 3 budgeting quizzes" },
  { id: "investing-expert", name: "Investing Expert", description: "Master investing concepts by scoring 80%+ on 3 investing quizzes", icon: "📈", unlocked: false, category: "knowledge", requirement: "80%+ on 3 investing quizzes" },
  { id: "debt-expert", name: "Debt Management Expert", description: "Master debt concepts by scoring 80%+ on 3 debt quizzes", icon: "💳", unlocked: false, category: "knowledge", requirement: "80%+ on 3 debt quizzes" },
  { id: "quiz-master", name: "Quiz Master", description: "Complete 10 quizzes with an average score of 80% or higher", icon: "👑", unlocked: false, category: "achievement", requirement: "10 quizzes with 80%+ avg" },
  { id: "financial-guru", name: "Financial Guru", description: "Reach level 10 in your financial knowledge journey", icon: "🧠", unlocked: false, category: "achievement", requirement: "Reach level 10" }
];

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    
    const session = await auth(); 
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    const userIdStringFromSession = session.user.id || session.user.email; 
    
    if (!userIdStringFromSession) {
      return NextResponse.json({ error: "User ID not found in session" }, { status: 400 });
    }
    
    console.log("API: Fetching progress for user ID (string):", userIdStringFromSession);
    
    let userProgressDoc = await UserProgress.findOne({ userId: userIdStringFromSession });
    
    console.log("API: User progress found in DB:", userProgressDoc ? "Yes" : "No");
    
    if (!userProgressDoc) {
      console.log("API: Creating new user progress document for userId:", userIdStringFromSession);
      
      let userDocument;
      if (mongoose.Types.ObjectId.isValid(userIdStringFromSession)) {
        userDocument = await User.findById(userIdStringFromSession);
      } else if (userIdStringFromSession.includes('@')) {
        userDocument = await User.findOne({ email: userIdStringFromSession });
      }

      if (!userDocument) {
        console.error(`API: Cannot create UserProgress. User document not found for identifier: ${userIdStringFromSession}`);
        return NextResponse.json({ error: "Associated user record not found to create progress." }, { status: 404 });
      }
      
      userProgressDoc = await UserProgress.create({
        user: userDocument._id,       
        userId: userIdStringFromSession, 
        level: 1,
        points: 0,
        quizzesTaken: 0,
        correctAnswers: 0,
        streakDays: 0,
        badges: defaultBadges.map(badge => ({ ...badge, unlockedAt: null })), 
        quizHistory: []
      });
      
      console.log("API: New user progress created successfully.");
    }
    
    return NextResponse.json({ userProgress: userProgressDoc });

  } catch (error: any) {
    console.error("API: Error fetching user progress:", error.message);
    console.error("API: Error stack trace:", error.stack);
    
    return NextResponse.json(
      { error: "Failed to fetch user progress", details: error.message },
      { status: 500 }
    );
  }
}