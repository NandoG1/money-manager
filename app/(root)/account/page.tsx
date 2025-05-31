import Link from "next/link";
import { ChevronRight } from "lucide-react";

import {
  getExpenseAccount,
  getIncomeAccount,
  getUserAccount,
} from "@/lib/actions/account.actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import AccountCard from "@/components/card/AccountCard";
import BarChart from "@/components/chart/BarChart";
import { getAllIncome } from "@/lib/actions/income.actions";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/table/columns";
import { getAllExpense } from "@/lib/actions/expense.actions";
import { UserProvider } from "@/lib/context/UserContext";
import { getAccountCategory } from "@/lib/actions/category.actions";

async function AccountPage() {
  const session: any = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const [
    allAcc,
    incomeAccount,
    expenseAccount,
    userCategory,
    allIncomes,
    allExpenses,
  ] = await Promise.all([
    getUserAccount(userId),
    getIncomeAccount(userId),
    getExpenseAccount(userId),
    getAccountCategory(userId),
    getAllIncome(userId),
    getAllExpense(userId),
  ]);

  return (
    <section className="mb-6 px-2 md:px-0">
      <div className="space-y-6">
        {/* Accounts Section */}
        <div className="space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold md:text-xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-600">
              Your Accounts
            </h3>
            <div className="h-px flex-grow bg-gradient-to-r from-emerald-500/50 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {allAcc.length ? (
              allAcc.map((card) => (
                <div key={card._id} className="group transform transition-all duration-300 hover:scale-105">
                  <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-emerald-900/40 via-black/60 to-teal-900/40 p-0.5 shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 bg-black/50 backdrop-blur-sm rounded-lg p-4">
                      <AccountCard account={card} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full rounded-xl border border-white/10 bg-gradient-to-br from-emerald-900/30 via-black/70 to-teal-900/30 p-0.5 shadow-lg">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-8 text-center">
                  <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-emerald-400 to-teal-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-600 mb-2">
                    No Accounts Yet
                  </h4>
                  <p className="text-white/80 mb-3">
                    You havent added any accounts yet.
                  </p>
                  <p className="text-sm text-white/60 max-w-md mx-auto">
                    Create an account to start tracking your finances and visualize your spending habits.
                  </p>
                </div>
              </div>
            )}
          </div>
          
        </div>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-5 shadow-lg">
            <div className="flex items-center justify-between pb-4 mb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1.5 bg-gradient-to-b from-green-400 to-emerald-600 rounded-full"></div>
                <h3 className="text-lg font-bold">Income Overview</h3>
              </div>
              <Link
                href={"/income"}
                className="flex items-center gap-1 text-sm font-medium text-white/70 hover:text-emerald-400 transition-colors duration-300"
              >
                View Income <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex h-[300px] w-full items-center">
              <BarChart accountData={incomeAccount} />
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-5 shadow-lg">
            <div className="flex items-center justify-between pb-4 mb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1.5 bg-gradient-to-b from-red-400 to-pink-600 rounded-full"></div>
                <h3 className="text-lg font-bold">Expense Overview</h3>
              </div>
              <Link
                href={"/expense"}
                className="flex items-center gap-1 text-sm font-medium text-white/70 hover:text-emerald-400 transition-colors duration-300"
              >
                View Expense <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex h-[300px] w-full items-center">
              <BarChart accountData={expenseAccount} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
            <div className="h-6 w-1.5 bg-gradient-to-b from-blue-400 to-indigo-600 rounded-full"></div>
            <h3 className="text-lg font-bold">Recent Activities</h3>
          </div>
          <UserProvider accounts={allAcc} categories={userCategory}>
            <div className="grid grid-cols-1 gap-y-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="text-base font-medium text-emerald-400">Income</h4>
                </div>
                <div>
                  <DataTable columns={columns} data={allIncomes} />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="text-base font-medium text-red-400">Expense</h4>
                </div>
                <div>
                  <DataTable columns={columns} data={allExpenses} />
                </div>
              </div>
            </div>
          </UserProvider>
        </div>
      </div>
    </section>
  );
}

export default AccountPage;
