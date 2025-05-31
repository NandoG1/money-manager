import { connectToDB } from "@/lib/mongoose";
import Note from "@/lib/models/note.model";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Session } from "next-auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    await connectToDB();
    
    const notes = await Note.find({ user: userId }).sort({ isPinned: -1, updatedAt: -1 });
    
    return NextResponse.json(notes);
  } catch (error: any) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes", message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const { title, content, tags, color } = await request.json();
    
    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }
    
    await connectToDB();
    
    const newNote = await Note.create({
      title,
      content: content || "",
      tags: tags || [],
      color: color || "blue",
      isPinned: false,
      user: userId,
    });
    
    return NextResponse.json(
      { message: "Note created successfully", note: newNote },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: "Failed to create note", message: error.message },
      { status: 500 }
    );
  }
}
