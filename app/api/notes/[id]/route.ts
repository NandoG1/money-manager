import { connectToDB } from "@/lib/mongoose";
import Note from "@/lib/models/note.model";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Session } from "next-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const noteId = params.id;
    
    await connectToDB();
    
    const note = await Note.findById(noteId);
    
    if (!note) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }
    
    if (note.user.toString() !== userId) {
      return NextResponse.json(
        { error: "Not authorized to access this note" },
        { status: 403 }
      );
    }
    
    return NextResponse.json(note);
  } catch (error: any) {
    console.error("Error fetching note:", error);
    return NextResponse.json(
      { error: "Failed to fetch note", message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const noteId = params.id;
    const updateData = await request.json();
    
    await connectToDB();
    
    const note = await Note.findById(noteId);
    
    if (!note) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }
    
    if (note.user.toString() !== userId) {
      return NextResponse.json(
        { error: "Not authorized to update this note" },
        { status: 403 }
      );
    }
    
    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { ...updateData },
      { new: true }
    );
    
    return NextResponse.json(
      { message: "Note updated successfully", note: updatedNote }
    );
  } catch (error: any) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { error: "Failed to update note", message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const noteId = params.id;
    
    await connectToDB();
    
    const note = await Note.findById(noteId);
    
    if (!note) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }
    
    if (note.user.toString() !== userId) {
      return NextResponse.json(
        { error: "Not authorized to delete this note" },
        { status: 403 }
      );
    }
    
    // Delete note
    await Note.findByIdAndDelete(noteId);
    
    return NextResponse.json(
      { message: "Note deleted successfully" }
    );
  } catch (error: any) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { error: "Failed to delete note", message: error.message },
      { status: 500 }
    );
  }
}
