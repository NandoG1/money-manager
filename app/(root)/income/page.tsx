import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/ui/data-table";
import { UserProvider } from "@/lib/context/UserContext";

import {
  getIncomeAccount,
  getUserAccount,
} from "@/lib/actions/account.actions";
import { getAllIncome } from "@/lib/actions/income.actions";

import TransactionPieChart from "@/components/chart/TransactionPieChart";
import AddIncomeBtn from "@/components/action/AddIncomeBtn";
import BarChart from "@/components/chart/BarChart";
import TransactionLineChart from "@/components/chart/TransactionLineChart";

async function IncomePage() {
  const session: any = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const [userAccount, allIncomes, incomeAccount] = await Promise.all([
    getUserAccount(userId),
    getAllIncome(userId),
    getIncomeAccount(userId),
  ]);

  return (
    <section className="mb-6 px-2 md:px-0">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-bold md:text-xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-600">Income Management</h3>
          <div className="h-px flex-grow bg-gradient-to-r from-emerald-500/50 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5 lg:grid-rows-4">
          {/* Income Line Chart */}
          <div className="lg:col-span-2 lg:row-span-2">
            <div className="h-full w-full rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-5 shadow-lg">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                <div className="h-6 w-1.5 bg-gradient-to-b from-blue-400 to-indigo-600 rounded-full"></div>
                <h3 className="text-lg font-bold">Income Insights</h3>
              </div>
              <div className="h-[300px] md:h-[480px]">
                <TransactionLineChart transactionType="income" />
              </div>
            </div>
          </div>

          {/* Income Donut and Bar Chart */}
          <div className="lg:col-span-2 lg:col-start-1 lg:row-span-2 lg:row-start-3">
            <div className="h-full w-full rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-5 shadow-lg">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                <div className="h-6 w-1.5 bg-gradient-to-b from-green-400 to-emerald-600 rounded-full"></div>
                <h3 className="text-lg font-bold">Income Overview</h3>
              </div>
              <Tabs defaultValue="donut" className="w-full">
                <TabsList className="flex w-full gap-4 bg-black/60 border border-white/10">
                  <TabsTrigger value="donut" className="w-full lg:w-[220px] data-[state=active]:bg-emerald-600/20 data-[state=active]:text-white">
                    Donut Chart
                  </TabsTrigger>
                  <TabsTrigger value="bar" className="w-full lg:w-[220px] data-[state=active]:bg-emerald-600/20 data-[state=active]:text-white">
                    Bar Chart
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="donut" className="mt-4">
                  <div className="h-full md:h-[430px]">
                    <TransactionPieChart accountData={incomeAccount} />
                  </div>
                </TabsContent>
                <TabsContent value="bar" className="mt-4">
                  <div className="h-[320px] md:h-[430px]">
                    <BarChart accountData={incomeAccount} />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Income Activity Table */}
          <div className="lg:col-span-3 lg:col-start-3 lg:row-span-4 lg:row-start-1">
            <div className="h-full w-full rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-5 shadow-lg">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1.5 bg-gradient-to-b from-emerald-400 to-teal-600 rounded-full"></div>
                  <h3 className="text-lg font-bold">Income Activity</h3>
                </div>
                <AddIncomeBtn accounts={userAccount} />
              </div>
              <div>
                <UserProvider accounts={userAccount}>
                  <DataTable columns={columns} data={allIncomes} />
                </UserProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default IncomePage;
