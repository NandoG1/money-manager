"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Pencil, Trash2, Plus, Calendar, Clock } from "lucide-react"
import { format } from "date-fns"
import { EditSavingGoalDialog } from "./edit-saving-goal-dialog"
import { AddContributionDialog } from "./add-contribution-dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { SavingGoal } from "@/app/(root)/goals/page"
import { useTheme } from "next-themes"

interface SavingGoalCardProps {
  goal: SavingGoal
  onUpdate: (goalId: string, updatedGoal: Partial<SavingGoal>) => Promise<boolean>
  onDelete: (goalId: string) => Promise<boolean>
  onContribute: (goalId: string, amount: number, note?: string) => Promise<boolean>
}

export function SavingGoalCard({ goal, onUpdate, onDelete, onContribute }: SavingGoalCardProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [contributeOpen, setContributeOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const progressPercentage = Math.min(
    Math.round((goal.currentAmount / goal.targetAmount) * 100),
    100
  )

  const daysLeft = Math.ceil(
    (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(goal._id)
    } catch (error) {
      console.error("Error deleting goal:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card className={`overflow-hidden border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} shadow-md hover:shadow-lg transition-shadow duration-300`}>
      <div className="h-2" style={{ backgroundColor: goal.color }} />
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{goal.title}</h3>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className={isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Goal</AlertDialogTitle>
                  <AlertDialogDescription className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                    Are you sure you want to delete this saving goal? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className={isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Progress: {progressPercentage}%
              </span>
              <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Calendar className={`h-4 w-4 mr-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {format(new Date(goal.deadline), "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className={`h-4 w-4 mr-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {daysLeft > 0 ? `${daysLeft} days left` : "Deadline passed"}
              </span>
            </div>
          </div>

          {goal.description && (
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-2`}>{goal.description}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
          onClick={() => setContributeOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Contribution
        </Button>
      </CardFooter>

      <EditSavingGoalDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        goal={goal}
        onSave={onUpdate}
      />

      <AddContributionDialog
        open={contributeOpen}
        onOpenChange={setContributeOpen}
        goalId={goal._id}
        onSave={onContribute}
      />
    </Card>
  )
}