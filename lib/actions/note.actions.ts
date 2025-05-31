"use server";

import { connectToDB } from "@/lib/mongoose";
import Note from "@/lib/models/note.model";
import User from "@/lib/models/user.model";
import { revalidatePath } from "next/cache";

export async function createNote(
  userId: string,
  title: string,
  content: string,
  tags: string[],
  color: string
) {
  try {
    await connectToDB();

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const newNote = await Note.create({
      title,
      content,
      tags,
      color,
      isPinned: false,
      user: userId,
    });

    revalidatePath("/notes");
    return JSON.parse(JSON.stringify(newNote));
  } catch (error: any) {
    console.error("Error creating note:", error);
    throw new Error(`Failed to create note: ${error.message}`);
  }
}


export async function getUserNotes(userId: string) {
  try {
    await connectToDB();

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const notes = await Note.find({ user: userId }).sort({ isPinned: -1, updatedAt: -1 });

    return JSON.parse(JSON.stringify(notes));
  } catch (error: any) {
    console.error("Error fetching notes:", error);
    throw new Error(`Failed to fetch notes: ${error.message}`);
  }
}


export async function updateNote(
  noteId: string,
  userId: string,
  updateData: {
    title?: string;
    content?: string;
    tags?: string[];
    color?: string;
    isPinned?: boolean;
  }
) {
  try {
    await connectToDB();

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }


    const note = await Note.findById(noteId);
    if (!note) {
      throw new Error("Note not found");
    }

    if (note.user.toString() !== userId) {
      throw new Error("Not authorized to update this note");
    }


    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { ...updateData },
      { new: true }
    );

    revalidatePath("/notes");
    return JSON.parse(JSON.stringify(updatedNote));
  } catch (error: any) {
    console.error("Error updating note:", error);
    throw new Error(`Failed to update note: ${error.message}`);
  }
}


export async function togglePinNote(noteId: string, userId: string) {
  try {
    await connectToDB();


    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }


    const note = await Note.findById(noteId);
    if (!note) {
      throw new Error("Note not found");
    }

    if (note.user.toString() !== userId) {
      throw new Error("Not authorized to update this note");
    }

    // Toggle pin status
    note.isPinned = !note.isPinned;
    await note.save();

    revalidatePath("/notes");
    return JSON.parse(JSON.stringify(note));
  } catch (error: any) {
    console.error("Error toggling pin status:", error);
    throw new Error(`Failed to toggle pin status: ${error.message}`);
  }
}

export async function deleteNote(noteId: string, userId: string) {
  try {
    await connectToDB();


    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const note = await Note.findById(noteId);
    if (!note) {
      throw new Error("Note not found");
    }

    if (note.user.toString() !== userId) {
      throw new Error("Not authorized to delete this note");
    }


    await Note.findByIdAndDelete(noteId);

    revalidatePath("/notes");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting note:", error);
    throw new Error(`Failed to delete note: ${error.message}`);
  }
}
