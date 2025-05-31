// app/api/quiz/check/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose, { Schema, models, model, Document } from "mongoose"; 
import { connectToDB } from "@/lib/mongoose";
import { auth } from "@/auth"; 


interface IBadge extends Document {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date | null;
  category: string;
  requirement: string;
}

const BadgeSchema = new Schema<IBadge>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  unlocked: { type: Boolean, default: false },
  unlockedAt: { type: Date, default: null },
  category: { type: String, required: true },
  requirement: { type: String, required: true },
});

interface IQuizHistoryItem extends Document {
  quizId: string;
  category: string;
  difficulty: string;
  score: number;
  total: number;
  date: Date;
}

const QuizHistorySchema = new Schema<IQuizHistoryItem>({
  quizId: { type: String },
  category: { type: String },
  difficulty: { type: String },
  score: { type: Number },
  total: { type: Number },
  date: { type: Date, default: Date.now }
});

export interface IUserProgress extends Document {
  user: mongoose.Types.ObjectId | string; 
  userId: string; 
  level: number;
  points: number;
  quizzesTaken: number;
  correctAnswers: number;
  streakDays: number;
  lastQuizDate?: Date;
  badges: IBadge[];
  quizHistory: IQuizHistoryItem[];
}

const UserProgressSchema = new Schema<IUserProgress>({
  user: { type: Schema.Types.Mixed, required: true, index: true }, 
  userId: { type: String, required: true, index: true, unique: true }, 
  level: { type: Number, default: 1 },
  points: { type: Number, default: 0 },
  quizzesTaken: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  streakDays: { type: Number, default: 0 },
  lastQuizDate: { type: Date },
  badges: [BadgeSchema],
  quizHistory: [QuizHistorySchema]
}, { timestamps: true });

const UserProgress = models.UserProgress as mongoose.Model<IUserProgress> || model<IUserProgress>('UserProgress', UserProgressSchema);

export async function GET(req: NextRequest) {
  try {
    const ATLAS_CONNECTION_STRING = process.env.ATLAS_DB_CONNECTION_STRING;
    
    const mongoConnectionStatus = ATLAS_CONNECTION_STRING 
      ? "ATLAS_DB_CONNECTION_STRING is defined" 
      : "ATLAS_DB_CONNECTION_STRING is not defined";
    
    const session = await auth(); 
    const authStatus = session ? "Authenticated" : "Not authenticated";
    
    let currentUserId = "Not available"; 
    if (session && session.user) {
      currentUserId = session.user.id || session.user.email || "Not available"; 
    }
    
    try {
      await connectToDB(); 
      const totalDocuments = await UserProgress.countDocuments();
      
      let userProgressExistsForCurrentUser = false;
      if (session && session.user && currentUserId !== "Not available") {
        const userProgress = await UserProgress.findOne({ userId: currentUserId });
        userProgressExistsForCurrentUser = !!userProgress;
      }
      
      return NextResponse.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        mongodb: {
          connectionStringStatus: mongoConnectionStatus,
          connected: true, 
          databaseName: mongoose.connection.name, 
          totalUserProgressDocuments: totalDocuments,
          currentUserProgressExists: userProgressExistsForCurrentUser
        },
        auth: {
          status: authStatus,
          userId: currentUserId
        }
      });
    } catch (dbError: any) {
      console.error("Database operation error in /api/quiz/check:", dbError);
      return NextResponse.json({
        status: "error",
        timestamp: new Date().toISOString(),
        message: "Database operation failed.",
        mongodb: {
          connectionStringStatus: mongoConnectionStatus,
          connected: false, 
          error: dbError.message
        },
        auth: {
          status: authStatus,
          userId: currentUserId
        }
      }, { status: 500 }); 
    }
  } catch (error: any) {
    console.error("General error in /api/quiz/check:", error);
    return NextResponse.json({
      status: "error",
      timestamp: new Date().toISOString(),
      message: "An unexpected error occurred on the server.",
      errorDetails: error.message 
    }, { status: 500 });
  }
}