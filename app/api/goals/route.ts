import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { connectToDB } from "@/lib/mongoose";
import SavingGoal from "@/lib/models/saving-goal.model";
import { Session } from "next-auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDB();

    const userId = session.user.id;

    const goals = await SavingGoal.find({ user: userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ success: true, goals });
  } catch (error) {
    console.error("Error fetching goals:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch goals" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDB();

    const body = await req.json();
    const { title, targetAmount, currentAmount, deadline, description, color } = body;

    if (!title || !targetAmount || !deadline) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const goal = await SavingGoal.create({
      title,
      targetAmount,
      currentAmount: currentAmount || 0,
      deadline,
      description: description || "",
      color: color || "#10b981",
      user: session.user.id,
      contributions: [],
    });

    return NextResponse.json({ success: true, goal }, { status: 201 });
  } catch (error) {
    console.error("Error creating goal:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create goal" },
      { status: 500 }
    );
  }
}
