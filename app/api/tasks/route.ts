import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Task from "@/lib/models/task.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
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
    
    if (!userId) {
      console.error("User ID not found in session:", session);
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 400 }
      );
    }
    
    await connectToDB();
    
    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });
    
    return NextResponse.json(tasks);
  } catch (error: any) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session || !session.user) {
      console.error("No session or user found:", session);
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    if (!userId) {
      console.error("User ID not found in session:", session);
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 400 }
      );
    }
    
    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.error("Failed to parse request body:", e);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }
    
    const { title, description, priority, status, deadline } = body;
    
    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }
    
    console.log("Connecting to database...");
    await connectToDB();
    console.log("Connected to database");
    
    console.log("Creating task with data:", {
      title,
      description,
      priority: priority || "medium",
      status: status || "todo",
      deadline: deadline || null,
      user: userId,
    });
    
    const newTask = await Task.create({
      title,
      description: description || "",
      priority: priority || "medium",
      status: status || "todo",
      deadline: deadline || null,
      user: userId,
    });
    
    console.log("Task created successfully:", newTask);
    
    return NextResponse.json(newTask, { status: 201 });
  } catch (error: any) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create task" },
      { status: 500 }
    );
  }
}
