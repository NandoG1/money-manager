import { getServerSession } from "next-auth";

import CategoryCard from "@/components/card/CategoryCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import {
  getCategoryAccount,
  getUserAccount,
} from "@/lib/actions/account.actions";
import AddCategoryBtn from "@/components/action/AddCategoryBtn";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./category-columns";
import {
  getAccountCategory,
  getCategoryLinechart,
  getExpenseBycategory,
} from "@/lib/actions/category.actions";
import { UserProvider } from "@/lib/context/UserContext";
import CategoryLineChart from "@/components/chart/CategoryLineChart";
import Image from "next/image";

async function CategoryPage() {
  const session: any = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const [
    userAccount,
    userCategory,
    allCategories,
    categoryExpenses,
    lineChartData,
  ] = await Promise.all([
    getUserAccount(userId),
    getAccountCategory(userId),
    getCategoryAccount(userId),
    getExpenseBycategory(userId),
    getCategoryLinechart(userId),
  ]);

  return (
    <section className="mb-6 px-2 md:px-0">
      <div className="w-full space-y-6 md:mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-bold md:text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">Category Management</h3>
          <div className="h-px flex-grow bg-gradient-to-r from-purple-500/50 to-transparent"></div>
        </div>
        
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:grid-rows-4">
          <div className="relative overflow-hidden rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-900/40 via-black/90 to-indigo-900/40 p-0.5 shadow-lg shadow-purple-900/20 lg:col-span-4 lg:row-span-4">
            <div className="relative z-10 h-full w-full bg-black rounded-lg p-5">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1.5 bg-gradient-to-b from-purple-400 to-indigo-600 rounded-full"></div>
                  <h3 className="text-lg font-bold">Budget Categories</h3>
                </div>
                <AddCategoryBtn />
              </div>
            <div
              className={`grid gap-4 md:max-lg:grid-cols-2 ${allCategories.length === 0 && "place-items-center justify-center lg:h-[800px]"}` }
            >
              {allCategories.length ? (
                allCategories.map((card) => (
                  <div key={card._id} className="group transform transition-all duration-300 hover:scale-105">
                    <div className="relative overflow-hidden rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-900/40 via-black/90 to-indigo-900/40 p-0.5 shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10 bg-black rounded-lg">
                        <CategoryCard category={card} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex w-full flex-col items-center justify-center gap-6 py-10">
                  <div className="rounded-full bg-gradient-to-br from-purple-600/30 to-indigo-600/30 p-1">
                    <div className="bg-black/70 rounded-full p-5">
                      <Image
                        src={"/assets/no-category.svg"}
                        width={200}
                        height={200}
                        alt="No Categories"
                        className="opacity-80"
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600 mb-2">
                      No Categories Yet
                    </h4>
                    <p className="text-white/80 mb-3">
                      You haven&apos;t added any categories yet.
                    </p>
                    <p className="text-sm text-white/60 max-w-md mx-auto">
                      Create categories to better organize and track your expenses.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
          <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-5 shadow-lg lg:col-span-full lg:col-start-5 lg:row-span-2">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
              <div className="h-6 w-1.5 bg-gradient-to-b from-blue-400 to-indigo-600 rounded-full"></div>
              <h3 className="text-lg font-bold">Category Activity</h3>
            </div>
            <div>
              <UserProvider accounts={userAccount} categories={userCategory}>
                <div>
                  <DataTable columns={columns} data={categoryExpenses} />
                </div>
              </UserProvider>
            </div>
          </div>
          
          <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-5 shadow-lg lg:col-span-full lg:col-start-5 lg:row-span-2 lg:row-start-3">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
              <div className="h-6 w-1.5 bg-gradient-to-b from-purple-400 to-indigo-600 rounded-full"></div>
              <h3 className="text-lg font-bold">Category Insights</h3>
            </div>

            <div className="w-full lg:h-[680px]">
              {lineChartData.length ? (
                <Tabs
                  className="w-full"
                  defaultValue={lineChartData[0].categoryId}
                >
                  <TabsList className="grid h-full w-full grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 bg-black/60 border border-white/10 p-1">
                    {lineChartData.map((tab) => (
                      <TabsTrigger 
                        key={tab.categoryId} 
                        value={tab.categoryId}
                        className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-white"
                      >
                        {tab.categoryName}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {lineChartData.map((data) => (
                    <div key={data.id} className="mt-8 h-full md:mt-12">
                      <TabsContent
                        value={data.categoryId}
                        className="h-[300px] lg:h-full"
                      >
                        <CategoryLineChart categoryData={data} />
                      </TabsContent>
                    </div>
                  ))}
                </Tabs>
              ) : (
                <div className="flex w-full flex-col items-center justify-center gap-6 md:h-full py-10">
                  <div className="rounded-full bg-purple-500/10 p-6">
                    <Image
                      src={"/assets/insights-chart.svg"}
                      width={200}
                      height={200}
                      alt="No Data Chart"
                      className="opacity-80"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-medium text-white/80 mb-2">
                      No transactions yet
                    </p>
                    <p className="text-sm text-white/60 max-w-md">
                      Start adding transactions to see insights for your categories.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategoryPage;
