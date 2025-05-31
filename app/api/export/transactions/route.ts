import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Expense from "@/lib/models/expense.model";
import Income from "@/lib/models/income.model";
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
    
    const expenses = await Expense.find({ account: { $in: user.account } })
      .select("name date amount account category")
      .populate("account", "name")
      .populate("category", "name")
      .lean();
    
    const incomes = await Income.find({ account: { $in: user.account } })
      .select("name date amount account")
      .populate("account", "name")
      .lean();
    
    const transactions = [
      ...expenses.map((expense: any) => ({
        id: expense._id.toString(),
        title: expense.name,
        amount: expense.amount,
        type: "Expense",
        category: expense.category?.name || "N/A",
        account: expense.account?.name || "N/A",
        date: new Date(expense.date).toLocaleDateString(),
      })),
      ...incomes.map((income: any) => ({
        id: income._id.toString(),
        title: income.name,
        amount: income.amount,
        type: "Income",
        category: "N/A", 
        account: income.account?.name || "N/A",
        date: new Date(income.date).toLocaleDateString(),
      })),
    ];
    
    return NextResponse.json(transactions);
  } catch (error: any) {
    console.error("Error in transactions export API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to export transactions" },
      { status: 500 }
    );
  }
}
