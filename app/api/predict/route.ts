import { NextRequest, NextResponse } from 'next/server';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { connectToDB } from '@/lib/mongoose';
import Income from '@/lib/models/income.model';
import Expense from '@/lib/models/expense.model';

const FLASK_API_URL = 'https://money-manager-be-production.up.railway.app/';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found in session' }, { status: 400 });
    }
    
    await connectToDB();
    
    const incomes = await Income.find({ user: userId }).sort({ date: 1 });
    const expenses = await Expense.find({ user: userId }).sort({ date: 1 });
    
    if (incomes.length === 0 || expenses.length === 0) {
      return NextResponse.json({ 
        error: 'Not enough transaction data', 
        message: 'You need to have both income and expense transactions to generate predictions.'
      }, { status: 400 });
    }
    
    const transactionMap = new Map();
    
    incomes.forEach(income => {
      const dateStr = new Date(income.date).toISOString().split('T')[0];
      if (!transactionMap.has(dateStr)) {
        transactionMap.set(dateStr, { date: dateStr, income: 0, expense: 0 });
      }
      const entry = transactionMap.get(dateStr);
      entry.income += income.amount;
    });
    
    expenses.forEach(expense => {
      const dateStr = new Date(expense.date).toISOString().split('T')[0];
      if (!transactionMap.has(dateStr)) {
        transactionMap.set(dateStr, { date: dateStr, income: 0, expense: 0 });
      }
      const entry = transactionMap.get(dateStr);
      entry.expense += expense.amount;
    });
    
    const transactionData = Array.from(transactionMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (transactionData.length < 5) {
      return NextResponse.json({ 
        error: 'Not enough transaction data', 
        message: 'You need at least 5 days of transaction data to generate predictions.'
      }, { status: 400 });
    }
    
    const response = await fetch(`${FLASK_API_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Error from backend: ${errorText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error('Error in predict API route:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
