'use client';

import { useState, useRef } from 'react';
import { PlusCircle, MinusCircle, Trash2, Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

type IncomeItem = {
  id: string;
  amount: string;
  source: string;
};

type ExpenseItem = {
  id: string;
  amount: string;
  category: string;
};

export default function AIAdvicePage() {
  const [incomes, setIncomes] = useState<IncomeItem[]>([
    { id: crypto.randomUUID(), amount: '', source: '' },
  ]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: crypto.randomUUID(), amount: '', category: '' },
  ]);
  const [financialGoals, setFinancialGoals] = useState('');
  const [advice, setAdvice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const adviceRef = useRef<HTMLDivElement>(null);

  const addIncomeItem = () => {
    setIncomes([...incomes, { id: crypto.randomUUID(), amount: '', source: '' }]);
  };

  const removeIncomeItem = (id: string) => {
    if (incomes.length > 1) {
      setIncomes(incomes.filter((item) => item.id !== id));
    }
  };

  const updateIncomeItem = (id: string, field: 'amount' | 'source', value: string) => {
    setIncomes(
      incomes.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addExpenseItem = () => {
    setExpenses([...expenses, { id: crypto.randomUUID(), amount: '', category: '' }]);
  };

  const removeExpenseItem = (id: string) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter((item) => item.id !== id));
    }
  };

  const updateExpenseItem = (id: string, field: 'amount' | 'category', value: string) => {
    setExpenses(
      expenses.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const getTotalIncome = () => {
    return incomes
      .reduce((sum, item) => {
        const amount = parseFloat(item.amount) || 0;
        return sum + amount;
      }, 0)
      .toFixed(2);
  };

  const getTotalExpenses = () => {
    return expenses
      .reduce((sum, item) => {
        const amount = parseFloat(item.amount) || 0;
        return sum + amount;
      }, 0)
      .toFixed(2);
  };

  const validateForm = () => {
    const hasValidIncome = incomes.some(
      (item) => item.amount.trim() !== '' && !isNaN(parseFloat(item.amount))
    );
    const hasValidExpense = expenses.some(
      (item) => item.amount.trim() !== '' && !isNaN(parseFloat(item.amount))
    );

    if (!hasValidIncome) {
      setError('Please add at least one valid income amount');
      return false;
    }

    if (!hasValidExpense) {
      setError('Please add at least one valid expense amount');
      return false;
    }

    setError('');
    return true;
  };

  const getFinancialAdvice = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setAdvice('');

    try {
      const formattedIncomes = incomes
        .filter((item) => item.amount.trim() !== '' && !isNaN(parseFloat(item.amount)))
        .map((item) => `${item.source || 'Income'}: Rp ${parseFloat(item.amount).toLocaleString('id-ID')}`)
        .join('\n');

      const formattedExpenses = expenses
        .filter((item) => item.amount.trim() !== '' && !isNaN(parseFloat(item.amount)))
        .map((item) => `${item.category || 'Expense'}: Rp ${parseFloat(item.amount).toLocaleString('id-ID')}`)
        .join('\n');

      const response = await fetch('/api/financial-advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          income: formattedIncomes,
          expenses: formattedExpenses,
          goals: financialGoals,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get financial advice');
      }

      const data = await response.json();
      setAdvice(data.advice);
      
      setTimeout(() => {
        adviceRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Error getting financial advice:', error);
      setError('Failed to get financial advice. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mb-6 px-2 md:px-0">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-lg font-bold md:text-xl bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-600">
          AI Financial Advisor
        </h3>
        <div className="h-px flex-grow bg-gradient-to-r from-violet-500/50 to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-900/40 via-black/90 to-indigo-900/40 p-0.5 shadow-lg shadow-violet-900/20">
          <div className="relative z-10 h-full w-full bg-black/80 backdrop-blur-sm rounded-lg p-5">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-white">Your Income</h3>
                  <button
                    onClick={addIncomeItem}
                    className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add Income
                  </button>
                </div>

                <div className="space-y-3">
                  {incomes.map((income) => (
                    <div
                      key={income.id}
                      className="flex items-center gap-2 animate-fadeIn"
                    >
                      <div className="flex-1">
                        <input
                          type="text"
                          value={income.source}
                          onChange={(e) =>
                            updateIncomeItem(income.id, 'source', e.target.value)
                          }
                          placeholder="Income source"
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            Rp
                          </span>
                          <input
                            type="number"
                            value={income.amount}
                            onChange={(e) =>
                              updateIncomeItem(income.id, 'amount', e.target.value)
                            }
                            placeholder=" 0.00"
                            className="w-full bg-black/50 border border-white/10 rounded-lg pl-7 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeIncomeItem(income.id)}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                        aria-label="Remove income item"
                      >
                        <MinusCircle className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-gray-400">Total Income:</span>
                  <span className="font-medium text-green-500">Rp {parseFloat(getTotalIncome()).toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-white">Your Expenses</h3>
                  <button
                    onClick={addExpenseItem}
                    className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add Expense
                  </button>
                </div>

                <div className="space-y-3">
                  {expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center gap-2 animate-fadeIn"
                    >
                      <div className="flex-1">
                        <input
                          type="text"
                          value={expense.category}
                          onChange={(e) =>
                            updateExpenseItem(expense.id, 'category', e.target.value)
                          }
                          placeholder="Expense category"
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            Rp
                          </span>
                          <input
                            type="number"
                            value={expense.amount}
                            onChange={(e) =>
                              updateExpenseItem(expense.id, 'amount', e.target.value)
                            }
                            placeholder=" 0.00"
                            className="w-full bg-black/50 border border-white/10 rounded-lg pl-7 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeExpenseItem(expense.id)}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                        aria-label="Remove expense item"
                      >
                        <MinusCircle className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-gray-400">Total Expenses:</span>
                  <span className="font-medium text-red-500">Rp {parseFloat(getTotalExpenses()).toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-white mb-3">Your Financial Goals</h3>
                <textarea
                  value={financialGoals}
                  onChange={(e) => setFinancialGoals(e.target.value)}
                  placeholder="Describe your financial goals (e.g., save for a house, pay off debt, retire early)"
                  className="w-full h-24 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none"
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm bg-red-500/10 p-2 rounded-lg">
                  {error}
                </div>
              )}

              <button
                onClick={getFinancialAdvice}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing Your Finances...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Analyze My Spending
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div 
          ref={adviceRef}
          className={`relative overflow-hidden rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-900/40 via-black/90 to-indigo-900/40 p-0.5 shadow-lg shadow-violet-900/20 ${!advice && !isLoading ? 'opacity-70' : ''}`}
        >
          <div className="relative z-10 h-full w-full bg-black/80 backdrop-blur-sm rounded-lg p-5">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-400" />
              Financial Recommendations
            </h3>

            <div className="min-h-[400px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-t-2 border-violet-500 animate-spin"></div>
                    <div className="absolute inset-3 rounded-full border-t-2 border-indigo-500 animate-spin-slow"></div>
                  </div>
                  <p className="mt-4 text-gray-400 text-sm">Analyzing your financial situation...</p>
                </div>
              ) : advice ? (
                <div className="prose prose-invert prose-violet max-w-none">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-4 text-gray-300">{children}</p>,
                      strong: ({ children }) => <span className="font-bold text-violet-400">{children}</span>,
                      em: ({ children }) => <span className="italic text-indigo-300">{children}</span>,
                      ul: ({ children }) => <ul className="list-disc ml-5 mb-4 space-y-2">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal ml-5 mb-4 space-y-2">{children}</ol>,
                      li: ({ children }) => <li className="text-gray-300">{children}</li>,
                      h1: ({ children }) => <h1 className="text-xl font-bold text-white mb-4">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-lg font-bold text-white mb-3">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-base font-bold text-white mb-2">{children}</h3>,
                    }}
                  >
                    {advice}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="rounded-full bg-violet-500/10 p-4 mb-4">
                    <Sparkles className="h-8 w-8 text-violet-400" />
                  </div>
                  <h4 className="text-lg font-medium text-white mb-2">
                    Get Personalized Financial Advice
                  </h4>
                  <p className="text-gray-400 text-sm max-w-xs">
                    Enter your income, expenses, and financial goals to receive AI-powered recommendations tailored to your situation.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
