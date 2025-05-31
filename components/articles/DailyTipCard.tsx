"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useFinance } from "@/lib/store/articles"
import { LightbulbIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function DailyTipCard() {
  const { getDailyTip } = useFinance()
  const tip = getDailyTip()

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "saving":
        return "from-green-500/10 to-emerald-500/10 border-green-500/20"
      case "budgeting":
        return "from-blue-500/10 to-cyan-500/10 border-blue-500/20"
      case "investing":
        return "from-purple-500/10 to-indigo-500/10 border-purple-500/20"
      case "debt":
        return "from-red-500/10 to-orange-500/10 border-red-500/20"
      default:
        return "from-gray-500/10 to-slate-500/10 border-gray-500/20"
    }
  }

  return (
    <Card className={cn("border overflow-hidden bg-gradient-to-r", getCategoryColor(tip.category))}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="bg-black/20 rounded-full p-2 mt-1">
            <LightbulbIcon className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <h3 className="font-medium text-sm mb-1">Daily Financial Tip</h3>
            <p className="text-sm text-muted-foreground">{tip.content}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
