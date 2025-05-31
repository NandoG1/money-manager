import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    content: {
      type: String,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    color: {
      type: String,
      enum: ["blue", "green", "purple", "yellow", "red"],
      default: "blue",
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);

export default Note;
