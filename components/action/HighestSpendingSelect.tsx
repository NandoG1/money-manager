"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import HighestSpendingList from "../card/HighestSpendingList";

type HighestSpending = {
  type: string;
  _id: string;
  name: string;
  date: string;
  amount: number;
};

function HighestSpendingSelect() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [timespan, setTimespan] = useState("week");
  const [transactionData, setTransactionData] = useState<HighestSpending[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) { 
        setTransactionData([]); 
        setIsLoading(false);
        
        return;
      }

      setIsLoading(true);
      setError(null);
      
      const apiUrl = `/api/expense/highest?span=${timespan}&userId=${userId}`;
      console.log("HighestSpendingSelect: Fetching from URL:", apiUrl); 

      try {
        const res = await fetch(apiUrl);

        if (!res.ok) {
          let errorMsg = `Failed to fetch expense data. Status: ${res.status}`;
          try {
            const errorData = await res.json();
            errorMsg = errorData.message || errorMsg;
          } catch (e) {
            const textError = await res.text();
            errorMsg = textError || errorMsg;
          }
          throw new Error(errorMsg);
        }

        const data = await res.json();
        setTransactionData(data);
      } catch (err: any) {
        console.error(`HighestSpendingSelect: Error fetching expense data:`, err);
        setError(err.message || "An unknown error occurred while fetching expenses.");
        setTransactionData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timespan, userId]);

  return (
    <div className="space-y-4">
      <Select
        onValueChange={(value: string) => setTimespan(value)}
        defaultValue="week"
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Timespan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="week">Last 7 Days</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="all">All Time</SelectItem>
        </SelectContent>
      </Select>

      {isLoading && (
        <div className="mt-4 flex items-center justify-center">
          Loading expenses...
        </div>
      )}

      {!isLoading && error && (
        <div className="mt-4 flex items-center justify-center text-red-500">
          {error} {/* Tampilkan pesan error yang lebih spesifik */}
        </div>
      )}
      
      {!isLoading && !error && (
        <div className="space-y-4">
          {transactionData.length > 0 ? (
            transactionData.map((data) => (
              <div key={data._id}>
                <HighestSpendingList transactionData={data} />
              </div>
            ))
          ) : (
            <div className="mt-4 flex items-center justify-center">
              No transactions found for this period.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HighestSpendingSelect;