"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { SavingGoalCard } from "@/components/finance/saving-goal-card"
import { AddSavingGoalDialog } from "@/components/finance/add-saving-goal-dialog"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"

export type SavingGoal = {
  _id: string
  title: string
  targetAmount: number
  currentAmount: number
  deadline: string
  description: string
  color: string
  contributions: {
    _id: string
    amount: number
    date: string
    note: string
  }[]
  createdAt: string
  updatedAt: string
}

export default function GoalsPage() {
  const { data: session } = useSession()
  const [savingGoals, setSavingGoals] = useState<SavingGoal[]>([])
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch("/api/goals")
        const data = await response.json()
        if (data.success) {
          setSavingGoals(data.goals)
        }
      } catch (error) {
        console.error("Error fetching goals:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchGoals()
    }
  }, [session])

  const addGoal = async (newGoal: Omit<SavingGoal, "_id" | "createdAt" | "updatedAt" | "contributions">) => {
    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGoal),
      })
      const data = await response.json()
      if (data.success) {
        setSavingGoals((prev) => [...prev, data.goal])
        return true
      }
      return false
    } catch (error) {
      console.error("Error adding goal:", error)
      return false
    }
  }

  const updateGoal = async (goalId: string, updatedGoal: Partial<SavingGoal>) => {
    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedGoal),
      })
      const data = await response.json()
      if (data.success) {
        setSavingGoals((prev) =>
          prev.map((goal) => (goal._id === goalId ? { ...goal, ...data.goal } : goal))
        )
        return true
      }
      return false
    } catch (error) {
      console.error("Error updating goal:", error)
      return false
    }
  }

  const deleteGoal = async (goalId: string) => {
    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: "DELETE",
      })
      const data = await response.json()
      if (data.success) {
        setSavingGoals((prev) => prev.filter((goal) => goal._id !== goalId))
        return true
      }
      return false
    } catch (error) {
      console.error("Error deleting goal:", error)
      return false
    }
  }

  const addContribution = async (goalId: string, amount: number, note: string = "") => {
    try {
      const response = await fetch(`/api/goals/${goalId}/contribute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, note }),
      })
      const data = await response.json()
      if (data.success) {
        setSavingGoals((prev) =>
          prev.map((goal) => (goal._id === goalId ? data.goal : goal))
        )
        return true
      }
      return false
    } catch (error) {
      console.error("Error adding contribution:", error)
      return false
    }
  }

  return (
    <main className={`flex-1 p-6 md:p-8 pt-16 md:pt-8 ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'} min-h-screen`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saving Goals</h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Track and manage your saving goals</p>
        </div>
        <AddSavingGoalDialog open={open} onOpenChange={setOpen} onSave={addGoal}>
          <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Button>
        </AddSavingGoalDialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : savingGoals.length === 0 ? (
        <Card className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className={`rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'} p-3 mb-4`}>
              <Plus className={`h-6 w-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No saving goals yet</h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-center max-w-md mb-6`}>
              Create your first saving goal to start tracking your progress towards financial milestones.
            </p>
            <AddSavingGoalDialog open={open} onOpenChange={setOpen} onSave={addGoal}>
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                Create a Saving Goal
              </Button>
            </AddSavingGoalDialog>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {savingGoals.map((goal) => (
            <motion.div key={goal._id} variants={itemVariants}>
              <SavingGoalCard 
                goal={goal} 
                onUpdate={updateGoal} 
                onDelete={deleteGoal} 
                onContribute={addContribution} 
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </main>
  )
}
