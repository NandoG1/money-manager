// components/chart/TransactionLineChart.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import LineChart from "./LineChart"; 
import TimespanSelect from "../action/TimespanSelect";

type TransactionType = "income" | "expense";

interface TransactionLineChartProps {
  transactionType: TransactionType;
}

interface ApiTransactionItem {
  _id?: string;
  date: string;  
  amount: number; 
  type: string;   
}

function TransactionLineChart({ transactionType }: TransactionLineChartProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [timespan, setTimespan] = useState("week");
  const [transactionData, setTransactionData] = useState<ApiTransactionItem[]>([]); 
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
      
      const apiUrl = `/api/${transactionType}/timespan?span=${timespan}&userId=${userId}`;
      console.log(`TransactionLineChart: Fetching from URL: ${apiUrl}`); // Untuk debugging

      try {
        const res = await fetch(apiUrl);

        if (!res.ok) {
          let errorMsg = `Failed to fetch ${transactionType} data. Status: ${res.status}`;
          try {
            const errorData = await res.json();
            errorMsg = errorData.message || errorMsg;
          } catch (e) {
            try {
                const textError = await res.text(); 
                errorMsg = textError || errorMsg; 
            } catch (textE) {
            }
          }
          throw new Error(errorMsg);
        }

        const data: ApiTransactionItem[] = await res.json();
        setTransactionData(data);
      } catch (err: any) {
        console.error(`TransactionLineChart: Error fetching ${transactionType} data:`, err);
        setError(err.message || `An unknown error occurred while fetching ${transactionType} data.`);
        setTransactionData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timespan, userId, transactionType]); 

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="ml-auto">
        <TimespanSelect onValueChange={(value: string) => setTimespan(value)} />
      </div>
      {isLoading && (
        <div className="flex-grow flex items-center justify-center text-white/70">
          Loading chart data... {/* Anda bisa mengganti ini dengan komponen Spinner */}
        </div>
      )}
      {!isLoading && error && (
        <div className="flex-grow flex items-center justify-center text-red-500 px-4 text-center">
          {error} {/* Menampilkan pesan error ke pengguna */}
        </div>
      )}
      {!isLoading && !error && (
        <LineChart accountData={transactionData} /> 
      )}
    </div>
  );
}

export default TransactionLineChart;