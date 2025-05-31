"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useQuiz } from "@/lib/store/quiz"
import { Award, Flame } from "lucide-react"

function UserLevelCardComponent() {
  const { userProgress } = useQuiz()
  const { level, points, streakDays } = userProgress

  const pointsForCurrentLevel = (level - 1) * 100
  const pointsForNextLevel = level * 100
  const progressPercentage = ((points - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100

  return (
    <Card className="border border-white/10 bg-black/40 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Award className="mr-2 h-5 w-5 text-primary" />
          Your Progress
        </CardTitle>
        <CardDescription>Keep learning to level up and earn more badges</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-muted-foreground">Level</span>
                <h3 className="text-2xl font-bold">{level}</h3>
              </div>
              <div className="text-right">
                <span className="text-sm text-muted-foreground">Points</span>
                <h3 className="text-2xl font-bold">{points}</h3>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{points} points</span>
                <span>{pointsForNextLevel} points</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground text-center mt-1">
              {Math.ceil(pointsForNextLevel - points)} points until level {level + 1}
            </p>
          </div>

          <div className="flex items-center justify-center bg-primary/5 rounded-lg p-3">
            <Flame className="h-5 w-5 text-orange-500 mr-2" />
            <div>
              <span className="font-medium">
                {streakDays} day{streakDays !== 1 ? "s" : ""}
              </span>
              <span className="text-muted-foreground ml-1">streak</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-muted/50 rounded-lg p-2">
              <div className="text-2xl font-bold">{userProgress.quizzesTaken}</div>
              <div className="text-xs text-muted-foreground">Quizzes</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-2">
              <div className="text-2xl font-bold">{userProgress.correctAnswers}</div>
              <div className="text-xs text-muted-foreground">Correct</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-2">
              <div className="text-2xl font-bold">
                {userProgress.quizzesTaken > 0
                  ? Math.round((userProgress.correctAnswers / (userProgress.quizzesTaken * 5 || 1)) * 100)
                  : 0}%
              </div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default UserLevelCardComponent
