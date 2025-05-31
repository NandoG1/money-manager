"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useTheme } from "next-themes"

interface AddContributionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goalId: string
  onSave: (goalId: string, amount: number, note?: string) => Promise<boolean>
}

export function AddContributionDialog({ open, onOpenChange, goalId, onSave }: AddContributionDialogProps) {
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const resetForm = () => {
    setAmount("")
    setNote("")
    setErrors({})
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = "Contribution amount must be a positive number"
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
      const success = await onSave(goalId, parseFloat(amount), note)
      if (success) {
        resetForm()
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Error adding contribution:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm()
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={`sm:max-w-[425px] ${isDark ? 'bg-gray-900 text-white border-gray-800' : 'bg-white text-gray-900 border-gray-200'}`}>
        <DialogHeader>
          <DialogTitle>Add Contribution</DialogTitle>
          <DialogDescription className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            Add a new contribution to your saving goal.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount" className={isDark ? 'text-gray-300' : 'text-gray-700'}>Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g., 500000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500' : 'bg-white border-gray-300 text-gray-900'} ${errors.amount ? 'border-red-500' : ''}`}
              />
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="note" className={isDark ? 'text-gray-300' : 'text-gray-700'}>Note (Optional)</Label>
              <Textarea
                id="note"
                placeholder="Add a note for this contribution"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={isDark ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500' : 'bg-white border-gray-300 text-gray-900'}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className={isDark ? 'bg-gray-800 text-white hover:bg-gray-700 border-gray-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border-gray-300'}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Contribution"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
