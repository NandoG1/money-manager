// lib/models/quiz.model.ts
import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IBadge extends Document {
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
}, { _id: false }); 

export interface IQuizHistoryItem extends Document {
  quizId: string;
  category?: string;
  difficulty?: string;
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
}, { _id: false }); 

export interface IUserProgress extends Document {
  user: mongoose.Types.ObjectId; 
  userId: string;                
  level: number;
  points: number;
  quizzesTaken: number;
  correctAnswers: number;
  streakDays: number;
  lastQuizDate?: Date;
  badges: IBadge[];
  quizHistory: IQuizHistoryItem[];
  createdAt?: Date;
  updatedAt?: Date; 
}

const UserProgressSchema = new Schema<IUserProgress>({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  userId: { 
    type: String, 
    required: true, 
    index: true, 
    unique: true 
  },
  level: { type: Number, default: 1 },
  points: { type: Number, default: 0 },
  quizzesTaken: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  streakDays: { type: Number, default: 0 },
  lastQuizDate: { type: Date },
  badges: [BadgeSchema],
  quizHistory: [QuizHistorySchema]
}, { 
  timestamps: true 
});

const UserProgress = models.UserProgress as mongoose.Model<IUserProgress> || model<IUserProgress>('UserProgress', UserProgressSchema);

export default UserProgress;