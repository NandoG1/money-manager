"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SavingGoal } from "@/app/(root)/goals/page"
import { useTheme } from "next-themes"

interface EditSavingGoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goal: SavingGoal
  onSave: (goalId: string, updatedGoal: Partial<SavingGoal>) => Promise<boolean>
}

export function EditSavingGoalDialog({ open, onOpenChange, goal, onSave }: EditSavingGoalDialogProps) {
  const [title, setTitle] = useState(goal.title)
  const [targetAmount, setTargetAmount] = useState(goal.targetAmount.toString())
  const [deadline, setDeadline] = useState(goal.deadline.split('T')[0])
  const [description, setDescription] = useState(goal.description || "")
  const [color, setColor] = useState(goal.color || "#10b981")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = "Title is required"
    }

    const parsedAmount = parseFloat(targetAmount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.targetAmount = "Target amount must be a positive number"
    }

    if (!deadline) {
      newErrors.deadline = "Deadline is required"
    } else if (new Date(deadline) < new Date()) {
      newErrors.deadline = "Deadline cannot be in the past"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const updatedGoal = {
        title,
        targetAmount: parseFloat(targetAmount),
        deadline: new Date(deadline).toISOString(),
        description,
        color,
      }

      const success = await onSave(goal._id, updatedGoal)
      if (success) {
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Error updating goal:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[425px] ${isDark ? 'bg-gray-900 text-white border-gray-800' : 'bg-white text-gray-900 border-gray-200'}`}>
        <DialogHeader>
          <DialogTitle>Edit Saving Goal</DialogTitle>
          <DialogDescription className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            Update your saving goal details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className={isDark ? 'text-gray-300' : 'text-gray-700'}>Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} ${errors.title ? 'border-red-500' : ''}`}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="targetAmount" className={isDark ? 'text-gray-300' : 'text-gray-700'}>Target Amount</Label>
              <Input
                id="targetAmount"
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className={`${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} ${errors.targetAmount ? 'border-red-500' : ''}`}
              />
              {errors.targetAmount && <p className="text-red-500 text-sm mt-1">{errors.targetAmount}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deadline" className={isDark ? 'text-gray-300' : 'text-gray-700'}>Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className={`${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} ${errors.deadline ? 'border-red-500' : ''}`}
              />
              {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className={isDark ? 'text-gray-300' : 'text-gray-700'}>Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="color" className={isDark ? 'text-gray-300' : 'text-gray-700'}>Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className={`${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className={isDark ? 'bg-gray-800 text-white hover:bg-gray-700 border-gray-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border-gray-300'}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}