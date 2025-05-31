import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Account from "@/lib/models/account.model";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    await connectToDB();
    
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    const accounts = await Account.find({ _id: { $in: user.account } })
      .select("name balance color")
      .lean();
    
    const accountsData = accounts.map((account: any) => ({
      id: account._id.toString(),
      name: account.name,
      balance: account.balance,
      color: account.color,
    }));
    
    return NextResponse.json(accountsData);
  } catch (error: any) {
    console.error("Error in accounts export API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to export accounts" },
      { status: 500 }
    );
  }
}
