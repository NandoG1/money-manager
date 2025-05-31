"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, TrendingUp, DollarSign, LineChart } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

type PredictionData = {
  date: string
  predicted_income: number
  predicted_expense: number
}

export default function PredictPage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasTransactions, setHasTransactions] = useState<boolean | null>(null)
  const [predictions, setPredictions] = useState<PredictionData[]>([])
  
  useEffect(() => {
    if (status === "authenticated") {
      checkTransactions()
    }
  }, [status])
  
  const checkTransactions = async () => {
    try {
      setIsLoading(true)
      setError(null)
      

      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
      
      if (response.ok) {
        setHasTransactions(true)
      } else {
        const data = await response.json()
        setHasTransactions(false)
        setError(data.message || 'Not enough transaction data to generate predictions')
      }
    } catch (error: any) {
      console.error('Error checking transactions:', error)
      setHasTransactions(false)
      setError('Failed to check transaction data: ' + (error.message || 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }
  
  const generatePrediction = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to generate prediction')
      }
      
      const data = await response.json()
      setPredictions(data.prediction)
      
      toast({
        title: "Prediction Generated",
        description: "Your 7-day financial prediction has been generated successfully.",
      })
    } catch (error: any) {
      console.error('Error generating prediction:', error)
      setError(error.message || 'Failed to generate prediction')
      
      toast({
        title: "Prediction Failed",
        description: error.message || 'Failed to generate prediction',
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Chart configuration
  const chartData = {
    labels: predictions.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Predicted Income',
        data: predictions.map(item => item.predicted_income),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: false
      },
      {
        label: 'Predicted Expense',
        data: predictions.map(item => item.predicted_expense),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.3,
        fill: false
      }
    ]
  }
  
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '7-Day Financial Prediction'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatCurrency(value as number)
          }
        }
      }
    }
  }
  
  if (status === "loading" || isLoading && hasTransactions === null) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Financial Prediction</h1>
        <div className="grid gap-4">
          <Skeleton className="h-[200px] w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-[100px] w-full" />
            <Skeleton className="h-[100px] w-full" />
          </div>
        </div>
      </div>
    )
  }
  
  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please sign in to use the financial prediction feature.
          </AlertDescription>
        </Alert>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Financial Prediction</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <span>AI-Powered Financial Prediction</span>
            </CardTitle>
            <CardDescription>
              Get a 7-day forecast of your income and expenses based on your transaction history.
              Our AI model analyzes your past financial patterns to provide personalized predictions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {!hasTransactions && !isLoading && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Not Enough Data</AlertTitle>
                <AlertDescription>
                  You need at least 5 days of transaction data (both income and expenses) to generate predictions.
                  Please add more transactions to use this feature.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex justify-center mb-6">
              <Button 
                onClick={generatePrediction} 
                disabled={isLoading || !hasTransactions}
                className="w-full md:w-auto"
              >
                {isLoading ? "Generating..." : "Generate 7-Day Prediction"}
              </Button>
            </div>
            
            {predictions.length > 0 && (
              <div className="space-y-6">
                <div className="h-[400px]">
                  <Line data={chartData} options={chartOptions} />
                </div>
                
                <Tabs defaultValue="table">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="table">Table View</TabsTrigger>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="table" className="mt-4">
                    <div className="rounded-md border">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              <th className="p-3 text-left">Date</th>
                              <th className="p-3 text-left">Predicted Income</th>
                              <th className="p-3 text-left">Predicted Expense</th>
                              <th className="p-3 text-left">Net</th>
                            </tr>
                          </thead>
                          <tbody>
                            {predictions.map((prediction, index) => (
                              <tr key={index} className="border-b">
                                <td className="p-3">{new Date(prediction.date).toLocaleDateString()}</td>
                                <td className="p-3 text-blue-600">{formatCurrency(prediction.predicted_income)}</td>
                                <td className="p-3 text-red-600">{formatCurrency(prediction.predicted_expense)}</td>
                                <td className={`p-3 ${prediction.predicted_income - prediction.predicted_expense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatCurrency(prediction.predicted_income - prediction.predicted_expense)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="summary" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-blue-600" />
                            Total Predicted Income
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-blue-600">
                            {formatCurrency(predictions.reduce((sum, item) => sum + item.predicted_income, 0))}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Over the next 7 days
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-red-600" />
                            Total Predicted Expenses
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-red-600">
                            {formatCurrency(predictions.reduce((sum, item) => sum + item.predicted_expense, 0))}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Over the next 7 days
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="md:col-span-2">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <LineChart className="h-4 w-4" />
                            Prediction Insights
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {predictions.reduce((sum, item) => sum + item.predicted_income, 0) > 
                             predictions.reduce((sum, item) => sum + item.predicted_expense, 0) ? (
                              <p>You are predicted to have a positive cash flow over the next 7 days.</p>
                            ) : (
                              <p>You are predicted to spend more than you earn over the next 7 days.</p>
                            )}
                            
                            <p>
                              Highest income day: {formatCurrency(Math.max(...predictions.map(p => p.predicted_income)))} on{' '}
                              {new Date(predictions.find(p => p.predicted_income === Math.max(...predictions.map(p => p.predicted_income)))?.date || '').toLocaleDateString()}
                            </p>
                            
                            <p>
                              Highest expense day: {formatCurrency(Math.max(...predictions.map(p => p.predicted_expense)))} on{' '}
                              {new Date(predictions.find(p => p.predicted_expense === Math.max(...predictions.map(p => p.predicted_expense)))?.date || '').toLocaleDateString()}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
