// app/(root)/dashboard/page.tsx
import OverviewCard from "@/components/card/OverviewCard";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/ui/data-table";
import DonutChart from "@/components/chart/DonutChart";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import QuickActions from "@/components/action/QuickActions";
import { getAllIncome, getIncomeSum } from "@/lib/actions/income.actions";
import { getAllExpense, getExpenseSum } from "@/lib/actions/expense.actions";
import { getAccountSum, getUserAccount } from "@/lib/actions/account.actions";
import { getAccountCategory } from "@/lib/actions/category.actions";
import HighestSpendingSelect from "@/components/action/HighestSpendingSelect";
import { UserProvider } from "@/lib/context/UserContext";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Image from "next/image";

import { HiArrowDown, HiArrowUp, HiOutlineWallet } from "react-icons/hi2"; 

async function DashboardPage() {
  const session: any = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <section className="mb-4 px-2 md:mb-6 md:px-0">
        <p>Loading user data or user not authenticated...</p>
      </section>
    );
  }

  const [
    accountSum,
    incomeSum,
    expenseSum,
    allExpenses,
    allIncomes,
    allAcc,
    userCategory,
  ] = await Promise.all([
    getAccountSum(userId),
    getIncomeSum(userId),
    getExpenseSum(userId),
    getAllExpense(userId),
    getAllIncome(userId),
    getUserAccount(userId),
    getAccountCategory(userId),
  ]);

  const tableData = [...allExpenses, ...allIncomes];

  const overview = [
    { title: "Total Balance", amount: accountSum, icon: <HiOutlineWallet size={24} />, color: "0, 176, 255" },
    { title: "Total Income", amount: incomeSum, icon: <HiArrowUp size={24} />, color: "80, 221, 179" },
    { title: "Total Expense", amount: expenseSum, icon: <HiArrowDown size={24} />, color: "239, 68, 68" },
  ];

  return (
    <section className="mb-4 px-2 md:mb-6 md:px-0">
      <div className="space-y-6">
        {/* Quick Actions Section */}
        <div className="hidden space-y-4 md:block">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold md:text-xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-600">Quick Actions</h3>
            <div className="h-px flex-grow bg-gradient-to-r from-emerald-500/50 to-transparent"></div>
          </div>
          <QuickActions />
        </div>

        {/* Overview Section */}
        <div className="space-y-4">
           <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold md:text-xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-600">Overview</h3>
            <div className="h-px flex-grow bg-gradient-to-r from-emerald-500/50 to-transparent"></div>
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:grid-rows-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 col-span-1 md:col-span-3 xl:col-span-4">
              {overview.map((data) => ( <div key={data.title}> <OverviewCard title={data.title} icon={data.icon} amount={data.amount} color={data.color} /> </div> ))}
            </div>

            <div className="col-span-1 md:col-span-2 lg:col-span-3 lg:row-span-4">
              <div className="h-full w-full rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-5 shadow-lg">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                  <div className="h-6 w-1.5 bg-gradient-to-b from-emerald-400 to-teal-600 rounded-full"></div>
                  <h3 className="text-lg font-bold">Recent Activity</h3>
                </div>
                <UserProvider accounts={allAcc} categories={userCategory}>
                  <DataTable columns={columns} data={tableData} />
                </UserProvider>
              </div>
            </div>
            
            <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-5 shadow-lg lg:col-span-2 xl:col-start-4 xl:row-span-3 xl:row-start-2">
              <div className="flex items-center justify-between pb-4 mb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1.5 bg-gradient-to-b from-blue-400 to-indigo-600 rounded-full"></div>
                  <h3 className="text-lg font-bold">Accounts</h3>
                </div>
                <Link href={"/account"} className="flex items-center gap-1 text-sm font-medium text-white/70 hover:text-emerald-400 transition-colors duration-300">
                  See All <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="lg:h-[400px]">
                <DonutChart accountData={allAcc} />
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-5 shadow-lg xl:col-span-2 xl:col-start-4 xl:row-span-2 xl:row-start-5">
              <div className="flex items-center justify-between pb-4 mb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1.5 bg-gradient-to-b from-red-400 to-pink-600 rounded-full"></div>
                  <h3 className="text-lg font-bold">Highest Spending</h3>
                </div>
                <Link href={"/expense"} className="flex items-center gap-1 text-sm font-medium text-white/70 hover:text-emerald-400 transition-colors duration-300">
                  See All <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <HighestSpendingSelect />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;