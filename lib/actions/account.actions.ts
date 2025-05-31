import { AccountType, CategoryExpenses } from "@/index"; 
import { connectToDB } from "../mongoose";
import Account from "../models/account.model";
import Expense from "../models/expense.model";
import Income from "../models/income.model";
import User from "../models/user.model";
import Category from "../models/category.model";

export async function getUserAccount(userId: string): Promise<AccountType[]> {
  if (!userId) {
    console.warn("getUserAccount: userId is undefined or null. Returning empty array.");
    return [];
  }
  await connectToDB();

  try {
    const user = await User.findById(userId).populate({
        path: 'account',
        populate: [ 
            { path: 'income' },
            { path: 'expense' }
        ]
    });

    if (!user) {
      console.warn(`getUserAccount: User not found for ID: ${userId}. Returning empty array.`);
      return [];
    }

    if (!user.account || user.account.length === 0) {
        console.log(`getUserAccount: User ${userId} has no accounts. Returning empty array.`);
        return [];
    }

    const accounts = user.account.map((acc: any) => {
      const incomeIds = acc.income?.map((income: any) => income._id?.toString()).filter(Boolean) || [];
      const expenseIds = acc.expense?.map((expense: any) => expense._id?.toString()).filter(Boolean) || [];
      
      return {
        ...acc.toObject(), 
        _id: acc._id?.toString(),
        user: acc.user?.toString(), 
        income: incomeIds,
        expense: expenseIds,
      };
    });

    return accounts as AccountType[]; 
  } catch (error: any) {
    console.error(`Error in getUserAccount for userId ${userId}:`, error.message, error.stack);
   
    return []; 
  }
}

export async function getAccountSum(userId: string): Promise<number> {
  if (!userId) return 0;
  await connectToDB();

  try {
    const user = await User.findById(userId).populate("account");

    let totalAccountSum = 0; 
    if (user && user.account && user.account.length > 0) {
      totalAccountSum = user.account.reduce(
        (total: number, acc: any) => total + (acc.balance || 0), 
        0,
      );
    }
    return totalAccountSum;
  } catch (error: any) {
    console.error(`Error in getAccountSum for userId ${userId}:`, error);
    throw error; 
  }
}

export async function getIncomeAccount(userId: string): Promise<any[]> {
  if (!userId) return [];
  await connectToDB();

  try {
    const user = await User.findById(userId).select("account"); 

    if (!user || !user.account || user.account.length === 0) {
      return [];
    }

    const accountsFromDB = await Account.find({ _id: { $in: user.account } })
      .select("name balance color _id"); 

    const accountsWithIncome = await Promise.all(
      accountsFromDB.map(async (account) => {
        const totalIncomeResult = await Income.aggregate([
          { $match: { account: account._id } }, 
          { $group: { _id: null, totalIncome: { $sum: "$amount" }}}, 
        ]);
        
        return {
          type: "Income",
          name: account.name as string,
          balance: account.balance as number, 
          color: account.color as string, 
          total: totalIncomeResult.length > 0 ? totalIncomeResult[0].totalIncome : 0,
        };
      }),
    );
    return accountsWithIncome;
  } catch (error: any) {
    console.error(`Error in getIncomeAccount for userId ${userId}:`, error);
    throw error;
  }
}

export async function getExpenseAccount(userId: string): Promise<any[]> {
  if (!userId) return [];
  await connectToDB();

  try {
    const user = await User.findById(userId).select("account");
    if (!user || !user.account || user.account.length === 0) return [];

    const accountsFromDB = await Account.find({ _id: { $in: user.account } }).select("name balance color _id");

    const accountsWithExpense = await Promise.all(
      accountsFromDB.map(async (account) => {
        const totalExpenseResult = await Expense.aggregate([
          { $match: { account: account._id } },
          { $group: { _id: null, totalExpense: { $sum: "$amount" }}},
        ]);
        return {
          type: "Expense",
          name: account.name,
          balance: account.balance,
          color: account.color,
          total: totalExpenseResult.length > 0 ? totalExpenseResult[0].totalExpense : 0,
        };
      }),
    );
    return accountsWithExpense;
  } catch (error: any) {
    console.error(`Error in getExpenseAccount for userId ${userId}:`, error);
    throw error;
  }
}

export async function getCategoryAccount(userId: string): Promise<CategoryExpenses[]> {
  if (!userId) return [];
  await connectToDB();

  try {
    const user = await User.findById(userId).populate({
        path: 'category',
        populate: {
            path: 'expense' 
        }
    });

    if (!user || !user.category || user.category.length === 0) {
      console.warn(`getCategoryAccount: User not found or no categories for ID: ${userId}.`);
      return [];
    }

    const categoryExpensesData = user.category.map((cat: any) => {
      let totalAmount = 0;
      if (cat.expense && Array.isArray(cat.expense)) {
        totalAmount = cat.expense.reduce((acc: number, exp: any) => acc + (exp.amount || 0), 0);
      }
      return {
        _id: cat._id.toString(),
        name: cat.name,
        budget: cat.budget || 0, 
        totalExpenses: totalAmount,
      };
    });

    return categoryExpensesData as CategoryExpenses[];
  } catch (error: any) {
    console.error(`Error in getCategoryAccount for userId ${userId}:`, error);
    throw error;
  }
}