"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuiz } from "@/lib/store/quiz"
import { Lock, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

function BadgesShowcaseComponent() {
  const { userProgress } = useQuiz()
  const { badges } = userProgress

  const formatDate = (date?: Date) => {
    if (!date) return ""
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date))
  }

  return (
    <Card className="border border-white/10 bg-black/40 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-primary" />
          Your Achievements
        </CardTitle>
        <CardDescription>Collect badges by completing financial quizzes and challenges</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={cn(
                "flex flex-col items-center text-center p-3 rounded-lg transition-all",
                badge.unlocked ? "bg-primary/5 hover:bg-primary/10" : "bg-muted/50 text-muted-foreground",
              )}
            >
              <div className="relative mb-2">
                <div
                  className={cn(
                    "w-16 h-16 flex items-center justify-center rounded-full",
                    badge.unlocked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                  )}
                >
                  <span className="text-3xl">{badge.icon}</span>
                </div>
                {!badge.unlocked && (
                  <div className="absolute -bottom-1 -right-1 bg-muted-foreground text-background rounded-full p-1">
                    <Lock className="h-3 w-3" />
                  </div>
                )}
              </div>
              <h3 className="font-medium text-sm mb-1">{badge.name}</h3>
              <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>
              {badge.unlocked && badge.unlockedAt && (
                <span className="text-xs text-primary">Unlocked: {formatDate(badge.unlockedAt)}</span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default BadgesShowcaseComponent
