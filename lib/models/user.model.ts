import mongoose, { Schema, Document } from "mongoose";
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; 
  image?: string;
  account: mongoose.Schema.Types.ObjectId[];
  income: mongoose.Schema.Types.ObjectId[];
  expense: mongoose.Schema.Types.ObjectId[];
  category: mongoose.Schema.Types.ObjectId[];
  transfer: mongoose.Schema.Types.ObjectId[];
  otp?: string;
  otpExpires?: Date;
  isVerified: boolean; 
}

const userSchema = new Schema<IUser>({ 
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
   
  },
  image: String,
  account: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
  ],
  income: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Income",
    },
  ],
  expense: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expense",
    },
  ],
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  transfer: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transfer",
    },
  ],
  otp: {
    type: String,
    required: false, 
  },
  otpExpires: {
    type: Date,
    required: false, 
  },
  isVerified: {
    type: Boolean,
    default: false, 
    required: true,
  },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema); 
export default User;