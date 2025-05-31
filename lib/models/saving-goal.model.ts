import mongoose from "mongoose";

const savingGoalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    targetAmount: {
      type: Number,
      required: [true, "Target amount is required"],
      min: [1, "Target amount must be greater than 0"],
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: [0, "Current amount cannot be negative"],
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },
    description: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "#10b981", // Default to emerald-500
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contributions: [
      {
        amount: {
          type: Number,
          required: true,
          min: [1, "Contribution amount must be greater than 0"],
        },
        date: {
          type: Date,
          default: Date.now,
        },
        note: {
          type: String,
          default: "",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const SavingGoal = mongoose.models.SavingGoal || mongoose.model("SavingGoal", savingGoalSchema);

export default SavingGoal;