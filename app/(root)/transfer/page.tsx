import { DataTable } from "@/components/ui/data-table";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { columns } from "./columns";
import { getAllTransfer } from "@/lib/actions/transfer.actions";
import AddTransferBtn from "@/components/action/AddTransferBtn";
import { getUserAccount } from "@/lib/actions/account.actions";
import { UserProvider } from "@/lib/context/UserContext";

async function TransferPage() {
  const session: any = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const [userAccount, allTransfers] = await Promise.all([
    getUserAccount(userId),
    getAllTransfer(userId),
  ]);

  return (
    <section className="mb-6 px-2 md:px-0">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-lg font-bold md:text-xl bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-600">Transfer Management</h3>
        <div className="h-px flex-grow bg-gradient-to-r from-amber-500/50 to-transparent"></div>
      </div>
      
      <div className="h-full w-full rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-5 shadow-lg md:mb-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1.5 bg-gradient-to-b from-amber-400 to-orange-600 rounded-full"></div>
            <h3 className="text-lg font-bold">Transfer History</h3>
          </div>
          <AddTransferBtn accounts={userAccount} />
        </div>
        <div>
          <UserProvider accounts={userAccount}>
            <DataTable columns={columns} data={allTransfers} />
          </UserProvider>
        </div>
      </div>
    </section>
  );
}

export default TransferPage;
