import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

import User from "@/lib/models/user.model";
import Account from "@/lib/models/account.model";
import Income from "@/lib/models/income.model";
import Expense from "@/lib/models/expense.model";
import { getServerSession , Session} from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDB();
    
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
    
    const accounts = await Account.find({ user: userId })
      .sort({ name: 1 });
      
    return NextResponse.json(accounts, { status: 200 });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json(
      { message: "Error fetching accounts" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { name, userId, balance, color } = await req.json();

  await connectToDB();

  try {
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { message: "You need to be authenticated to add an account" },
        { status: 401 },
      );
    }

    if (name.length < 3) {
      return NextResponse.json(
        { message: "Account name should be atleast 3 characters" },
        { status: 400 },
      );
    }

    const account = new Account({
      name: name,
      user: userId,
      balance: balance || 0,
      color: color,
    });

    await account.save();

    user.account.push(account._id);
    await user.save();

    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating account" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const { userId, accountId, newName, newColor } = await req.json();

  await connectToDB();

  try {
    const user = await User.findById(userId);
    const account = await Account.findById(accountId);

    if (!user) {
      return NextResponse.json(
        { message: "You need to be authenticated to edit this expense" },
        { status: 401 },
      );
    }

    if (!account) {
      return NextResponse.json(
        { message: "Account not found" },
        { status: 404 },
      );
    }

    if (newName.length < 3) {
      return NextResponse.json(
        { message: "Name must be atleast 3 characters" },
        { status: 409 },
      );
    }

    account.name = newName;
    account.color = newColor;
    await account.save();

    return NextResponse.json(
      { message: "Account edited successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error editing account" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { userId, accountId } = await req.json();

  await connectToDB();
  try {
    const user = await User.findById(userId);
    const account = await Account.findById(accountId);

    if (!user) {
      return NextResponse.json(
        { message: "You need to be authenticated to edit this expense" },
        { status: 401 },
      );
    }

    if (!account) {
      return NextResponse.json(
        { message: "Account not found" },
        { status: 404 },
      );
    }

    await Income.deleteMany({ _id: { $in: account.income } });
    await Expense.deleteMany({ _id: { $in: account.expense } });

    await Account.findByIdAndDelete(accountId);
    return NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting account" },
      { status: 500 },
    );
  }
}
