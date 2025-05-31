"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { FileSpreadsheet, FileJson, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"

export default function BackupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const { data: session, status } = useSession()
  const userId = session?.user?.id


  useEffect(() => {
    if (status === 'loading') {
      setIsPageLoading(true)
    } else {
      setIsPageLoading(false)
    }
  }, [status])

  const downloadData = (data: string, filename: string, type: string) => {
    try {
      const blob = new Blob([data], { type })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()

      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 100)
    } catch (error: any) {
      console.error(`Error downloading data: ${error?.message || 'Unknown error'}`)
      toast({
        title: "Download failed",
        description: `Failed to download file: ${error?.message || 'Unknown error'}`,
        variant: "destructive",
      })
    }
  }

  const escapeCSV = (value: any): string => {
    if (value === null || value === undefined) return ""
    const str = String(value)
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const exportAllData = async () => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to export your data.",
        variant: "destructive",
      })
      return
    }
  
    try {
      setIsLoading(true)
      
      let exportData = { expenses: [], incomes: [], accounts: [], categories: [], tasks: [] }
      
      // Fetch expenses
      try {
        const expensesRes = await fetch('/api/expense')
        if (expensesRes.ok) {
          exportData.expenses = await expensesRes.json()
          console.log('Successfully fetched expenses:', exportData.expenses.length)
        } else {
          console.error('Failed to fetch expenses:', await expensesRes.text())
        }
      } catch (error) {
        console.error('Error fetching expenses:', error)
      }
      
      // Fetch incomes
      try {
        const incomesRes = await fetch('/api/income')
        if (incomesRes.ok) {
          exportData.incomes = await incomesRes.json()
          console.log('Successfully fetched incomes:', exportData.incomes.length)
        } else {
          console.error('Failed to fetch incomes:', await incomesRes.text())
        }
      } catch (error) {
        console.error('Error fetching incomes:', error)
      }
      
      // Fetch accounts
      try {
        const accountsRes = await fetch('/api/account')
        if (accountsRes.ok) {
          exportData.accounts = await accountsRes.json()
          console.log('Successfully fetched accounts:', exportData.accounts.length)
        } else {
          console.error('Failed to fetch accounts:', await accountsRes.text())
        }
      } catch (error) {
        console.error('Error fetching accounts:', error)
      }
      
      // Fetch categories
      try {
        const categoriesRes = await fetch('/api/category')
        if (categoriesRes.ok) {
          exportData.categories = await categoriesRes.json()
          console.log('Successfully fetched categories:', exportData.categories.length)
        } else {
          console.error('Failed to fetch categories:', await categoriesRes.text())
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
      
      // Fetch tasks (this part remains unchanged)
      try {
        const tasksRes = await fetch('/api/tasks')
        if (tasksRes.ok) {
          exportData.tasks = await tasksRes.json()
          console.log('Successfully fetched tasks:', exportData.tasks.length)
        } else {
          console.error('Failed to fetch tasks:', await tasksRes.text())
        }
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
      
      const combinedData = {
        ...exportData,
        exportDate: new Date().toISOString(),
        user: userId
      }
      
      console.log('Exporting data:', {
        expensesCount: exportData.expenses.length,
        incomesCount: exportData.incomes.length,
        accountsCount: exportData.accounts.length,
        categoriesCount: exportData.categories.length,
        tasksCount: exportData.tasks.length
      })
      
      const jsonString = JSON.stringify(combinedData, null, 2)
      
      downloadData(
        jsonString, 
        `fintrack-backup-${new Date().toISOString().split("T")[0]}.json`, 
        "application/json"
      )
  
      toast({
        title: "Export successful",
        description: "Your data has been exported successfully.",
      })
    } catch (error: any) {
      console.error("Error exporting data:", error)
      toast({
        title: "Export failed",
        description: `Export failed: ${error?.message || 'Unknown error'}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const exportTransactionsAsCsv = async () => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to export your data.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      
      let transactions = []
      
      try {
        const expensesRes = await fetch('/api/expense')
        const incomesRes = await fetch('/api/income')
        
        let expenses = []
        let incomes = []
        
        if (expensesRes.ok) {
          expenses = await expensesRes.json()
          console.log('Successfully fetched expenses:', expenses.length)
        } else {
          const errorText = await expensesRes.text()
          console.error('Failed to fetch expenses:', expensesRes.status, errorText)
        }
        
        if (incomesRes.ok) {
          incomes = await incomesRes.json()
          console.log('Successfully fetched incomes:', incomes.length)
        } else {
          const errorText = await incomesRes.text()
          console.error('Failed to fetch incomes:', incomesRes.status, errorText)
        }
        
        expenses = expenses.map((expense: any) => ({
          ...expense,
          type: 'expense'
        }))
        
        incomes = incomes.map((income: any) => ({
          ...income,
          type: 'income'
        }))
        
        transactions = [...expenses, ...incomes]
        
      } catch (error) {
        console.error('Error fetching transactions:', error)
        throw error 
      }
      
      if (transactions.length === 0) {
        toast({
          title: "Export failed",
          description: "No transaction data available to export.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }
      
      console.log('Exporting transactions:', { transactionsCount: transactions.length })

      const headers = ["ID", "Title", "Amount", "Type", "Category", "Account", "Date", "Notes"]

      const rows = transactions.map((transaction: any) => {
        return [
          escapeCSV(transaction._id || transaction.id || ''),
          escapeCSV(transaction.title || transaction.description || transaction.name || ''),
          escapeCSV(transaction.amount || 0),
          escapeCSV(transaction.type || ''),
          escapeCSV(transaction.category?.name || transaction.category || 'N/A'),
          escapeCSV(transaction.account?.name || transaction.account || 'N/A'),
          escapeCSV(transaction.date || transaction.createdAt || ''),
          escapeCSV(transaction.notes || ''),
        ]
      })

      const csvContent = [headers.map(escapeCSV).join(","), ...rows.map((row: any[]) => row.join(","))].join("\n")

      downloadData(
        csvContent, 
        `fintrack-transactions-${new Date().toISOString().split("T")[0]}.csv`, 
        "text/csv"
      )

      toast({
        title: "Export successful",
        description: `Exported ${transactions.length} transaction(s) successfully.`,
      })
    } catch (error: any) {
      console.error("Error exporting transactions:", error)
      toast({
        title: "Export failed",
        description: `Export failed: ${error?.message || 'Unknown error'}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const exportAccountsAsCsv = async () => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to export your data.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      
      let accounts = []
      
      try {
        const response = await fetch('/api/account')
        if (response.ok) {
          accounts = await response.json()
          console.log('Successfully fetched accounts:', accounts.length)
        } else {
          const errorText = await response.text()
          console.error('Failed to fetch accounts:', response.status, errorText)
          throw new Error(`HTTP error ${response.status}: ${errorText}`)
        }
      } catch (error) {
        console.error('Error fetching accounts:', error)
        throw error 
      }
      
      if (accounts.length === 0) {
        toast({
          title: "Export failed",
          description: "No account data available to export.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }
      
      console.log('Exporting accounts:', { accountsCount: accounts.length })

      const headers = ["ID", "Account Name", "Balance", "Color", "Created Date"]

      const rows = accounts.map((account: any) => {
        return [
          escapeCSV(account._id || account.id || ''),
          escapeCSV(account.name || ''),
          escapeCSV(account.balance || 0),
          escapeCSV(account.color || '#cccccc'),
          escapeCSV(account.createdAt || 'Unknown date'),
        ]
      })

      const csvContent = [headers.map(escapeCSV).join(","), ...rows.map((row: any[]) => row.join(","))].join("\n")

      downloadData(
        csvContent, 
        `fintrack-accounts-${new Date().toISOString().split("T")[0]}.csv`, 
        "text/csv"
      )

      toast({
        title: "Export successful",
        description: `Exported ${accounts.length} account(s) successfully.`,
      })
    } catch (error: any) {
      console.error("Error exporting accounts:", error)
      toast({
        title: "Export failed",
        description: `Export failed: ${error?.message || 'Unknown error'}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const exportCategoriesAsCsv = async () => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to export your data.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      
      let categories = []
      
      try {
        const response = await fetch('/api/category')
        if (response.ok) {
          categories = await response.json()
          console.log('Successfully fetched categories:', categories.length)
        } else {
          const errorText = await response.text()
          console.error('Failed to fetch categories:', response.status, errorText)
          throw new Error(`HTTP error ${response.status}: ${errorText}`)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        throw error 
      }
      
      if (categories.length === 0) {
        toast({
          title: "Export failed",
          description: "No category data available to export.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }
      
      console.log('Exporting categories:', { categoriesCount: categories.length })

      const headers = ["ID", "Category Name", "Budget", "Created Date"]

      const rows = categories.map((category: any) => {
        return [
          escapeCSV(category._id || category.id || ''),
          escapeCSV(category.name || ''),
          escapeCSV(category.budget || 0),
          escapeCSV(category.createdAt || 'Unknown date'),
        ]
      })

      const csvContent = [headers.map(escapeCSV).join(","), ...rows.map((row: any[]) => row.join(","))].join("\n")

      downloadData(
        csvContent, 
        `fintrack-categories-${new Date().toISOString().split("T")[0]}.csv`, 
        "text/csv"
      )

      toast({
        title: "Export successful",
        description: `Exported ${categories.length} category(ies) successfully.`,
      })
    } catch (error: any) {
      console.error("Error exporting categories:", error)
      toast({
        title: "Export failed",
        description: `Export failed: ${error?.message || 'Unknown error'}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const exportTasksAsCsv = async () => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to export your data.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      
      const response = await fetch('/api/tasks')
      
      if (!response.ok) {
        throw new Error("Failed to fetch task data")
      }
      
      const tasks = await response.json()
      
      console.log('Exporting tasks:', { tasksCount: tasks.length })

      const headers = ["ID", "Title", "Description", "Status", "Priority", "Deadline", "Created Date"]

      const rows = tasks.map((task: any) => {
        return [
          escapeCSV(task._id),
          escapeCSV(task.title),
          escapeCSV(task.description),
          escapeCSV(task.status),
          escapeCSV(task.priority),
          escapeCSV(task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'),
          escapeCSV(new Date(task.createdAt).toLocaleDateString()),
        ]
      })

      const csvContent = [headers.map(escapeCSV).join(","), ...rows.map((row: any[]) => row.join(","))].join("\n")

      downloadData(
        csvContent, 
        `fintrack-tasks-${new Date().toISOString().split("T")[0]}.csv`, 
        "text/csv"
      )

      toast({
        title: "Export successful",
        description: "Your tasks have been exported as CSV successfully.",
      })
    } catch (error: any) {
      console.error("Error exporting tasks:", error)
      toast({
        title: "Export failed",
        description: `Export failed: ${error?.message || 'Unknown error'}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <section className="mb-6 px-2 md:px-0">
      <div className="w-full space-y-6 md:mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-bold md:text-xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-600">Backup & Export</h3>
          <div className="h-px flex-grow bg-gradient-to-r from-emerald-500/50 to-transparent"></div>
        </div>
        
        <div className="grid gap-6">
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-5 shadow-lg dark:border-white/10 dark:bg-black/40 dark:backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10 dark:border-white/10">
              <div className="h-6 w-1.5 bg-gradient-to-b from-emerald-400 to-teal-600 rounded-full"></div>
              <h3 className="text-lg font-bold dark:text-white">Export Your Data</h3>
            </div>
            
            <div className="p-2">
              <Tabs defaultValue="json">
                <TabsList className="grid h-full w-full grid-cols-2 gap-3 md:grid-cols-2 bg-black/60 border border-white/10 p-1 mb-6 dark:bg-black/60 dark:border-white/10">
                  <TabsTrigger 
                    value="json"
                    className="data-[state=active]:bg-emerald-600/20 data-[state=active]:text-white"
                  >
                    JSON Backup
                  </TabsTrigger>
                  <TabsTrigger 
                    value="csv"
                    className="data-[state=active]:bg-emerald-600/20 data-[state=active]:text-white"
                  >
                    CSV Export
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="json" className="space-y-4">
                  <div className="flex flex-col gap-4">
                    <div className="bg-black/20 rounded-xl p-6 border border-white/5 dark:bg-black/20 dark:border-white/5">
                      <h3 className="text-lg font-medium mb-2 dark:text-white">Complete Backup</h3>
                      <p className="text-sm text-white/80 mb-4 dark:text-white/80">
                        Export all your data to a JSON file. This includes all your transactions, accounts, categories, and tasks.
                      </p>
                      <Button 
                        onClick={exportAllData} 
                        disabled={isLoading}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Exporting...
                          </>
                        ) : (
                          <>
                            <FileJson className="mr-2 h-4 w-4" />
                            Export All Data
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="csv" className="space-y-6">
                  <div className="bg-black/20 rounded-xl p-6 border border-white/5 dark:bg-black/20 dark:border-white/5">
                    <h3 className="text-lg font-medium mb-2 dark:text-white">Export Transactions</h3>
                    <p className="text-sm text-white/80 mb-4 dark:text-white/80">
                      Export your transactions (incomes and expenses) to a CSV file for use in spreadsheet applications.
                    </p>
                    <Button 
                      onClick={exportTransactionsAsCsv} 
                      disabled={isLoading}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <FileSpreadsheet className="mr-2 h-4 w-4" />
                          Export Transactions
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="bg-black/20 rounded-xl p-6 border border-white/5 dark:bg-black/20 dark:border-white/5">
                    <h3 className="text-lg font-medium mb-2 dark:text-white">Export Accounts</h3>
                    <p className="text-sm text-white/80 mb-4 dark:text-white/80">
                      Export your accounts to a CSV file for use in spreadsheet applications.
                    </p>
                    <Button 
                      onClick={exportAccountsAsCsv} 
                      disabled={isLoading}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <FileSpreadsheet className="mr-2 h-4 w-4" />
                          Export Accounts
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="bg-black/20 rounded-xl p-6 border border-white/5 dark:bg-black/20 dark:border-white/5">
                    <h3 className="text-lg font-medium mb-2 dark:text-white">Export Categories</h3>
                    <p className="text-sm text-white/80 mb-4 dark:text-white/80">
                      Export your categories to a CSV file for use in spreadsheet applications.
                    </p>
                    <Button 
                      onClick={exportCategoriesAsCsv} 
                      disabled={isLoading}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <FileSpreadsheet className="mr-2 h-4 w-4" />
                          Export Categories
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="bg-black/20 rounded-xl p-6 border border-white/5 dark:bg-black/20 dark:border-white/5">
                    <h3 className="text-lg font-medium mb-2 dark:text-white">Export Tasks</h3>
                    <p className="text-sm text-white/80 mb-4 dark:text-white/80">
                      Export your tasks to a CSV file for use in spreadsheet applications.
                    </p>
                    <Button 
                      onClick={exportTasksAsCsv} 
                      disabled={isLoading}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <FileSpreadsheet className="mr-2 h-4 w-4" />
                          Export Tasks
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
