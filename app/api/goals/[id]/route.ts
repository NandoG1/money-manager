import { NextRequest, NextResponse } from "next/server";
import { getServerSession , Session} from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { connectToDB } from "@/lib/mongoose";
import SavingGoal from "@/lib/models/saving-goal.model";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid goal ID" },
        { status: 400 }
      );
    }

    await connectToDB();

    const userId = session.user.id;
    
    const goal = await SavingGoal.findOne({
      _id: id,
      user: userId,
    });

    if (!goal) {
      return NextResponse.json(
        { success: false, message: "Goal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, goal });
  } catch (error) {
    console.error("Error fetching goal:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch goal" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid goal ID" },
        { status: 400 }
      );
    }

    await connectToDB();

    const body = await req.json();
    const { title, targetAmount, currentAmount, deadline, description, color } = body;
    const userId = session.user.id;
    
    const existingGoal = await SavingGoal.findOne({
      _id: id,
      user: userId,
    });

    if (!existingGoal) {
      return NextResponse.json(
        { success: false, message: "Goal not found" },
        { status: 404 }
      );
    }

    const updatedGoal = await SavingGoal.findByIdAndUpdate(
      id,
      {
        ...(title && { title }),
        ...(targetAmount !== undefined && { targetAmount }),
        ...(currentAmount !== undefined && { currentAmount }),
        ...(deadline && { deadline }),
        ...(description !== undefined && { description }),
        ...(color && { color }),
      },
      { new: true }
    );

    return NextResponse.json({ success: true, goal: updatedGoal });
  } catch (error) {
    console.error("Error updating goal:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update goal" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid goal ID" },
        { status: 400 }
      );
    }

    await connectToDB();

    const userId = session.user.id;
    
    const existingGoal = await SavingGoal.findOne({
      _id: id,
      user: userId,
    });

    if (!existingGoal) {
      return NextResponse.json(
        { success: false, message: "Goal not found" },
        { status: 404 }
      );
    }

    await SavingGoal.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Goal deleted successfully" });
  } catch (error) {
    console.error("Error deleting goal:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete goal" },
      { status: 500 }
    );
  }
}
