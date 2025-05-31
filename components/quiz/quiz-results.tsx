"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useQuiz, type Badge, type UserProgress, type QuizSubmitResult } from "@/lib/store/quiz"
import { Trophy, Award, Star, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

interface QuizResultsProps {
  score: number
  total: number
  onRestart: () => void
  onClose: () => void
}

function QuizResultsComponent({ score, total, onRestart, onClose }: QuizResultsProps) {
  const { userProgress, submitQuizResults } = useQuiz()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newBadges, setNewBadges] = useState<Badge[]>([])
  const [levelUp, setLevelUp] = useState(false)
  const [initialLevel] = useState(userProgress.level)
  const [showConfetti, setShowConfetti] = useState(false)
  
  const percentage = Math.round((score / total) * 100)
  const isPerfectScore = score === total

  useEffect(() => {
    const submitResults = async () => {
      setIsSubmitting(true)
      try {
        const result = await submitQuizResults({
          score,
          total,
        })
        
        if (!result) {
          console.error("No result returned from submitQuizResults")
          return
        }
        
        if (result.unlockedBadges && result.unlockedBadges.length > 0) {
          setNewBadges(result.unlockedBadges)
        }
        
        if (result.userProgress && result.userProgress.level > initialLevel) {
          setLevelUp(true)
        }
        
        if (isPerfectScore || 
            (result.unlockedBadges && result.unlockedBadges.length > 0) || 
            (result.userProgress && result.userProgress.level > initialLevel)) {
          setShowConfetti(true)
        }
      } catch (error) {
        console.error("Error submitting quiz results:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
    
    submitResults()
  }, [score, total, submitQuizResults, initialLevel, isPerfectScore])

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="border border-white/10 bg-black/40 backdrop-blur-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Quiz Results</CardTitle>
          <CardDescription>Your quiz is complete!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-4">
              <div className="text-3xl font-bold">
                {percentage}%
              </div>
            </div>
            <h3 className="text-xl font-bold mb-1">
              {isPerfectScore ? "Perfect Score!" : percentage >= 80 ? "Great Job!" : percentage >= 60 ? "Good Work!" : "Keep Learning!"}
            </h3>
            <p className="text-muted-foreground">
              You scored {score} out of {total} questions correctly.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">XP Gained</span>
                <span className="text-sm font-medium">+{score * (isPerfectScore ? 2 : 1)}</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            
            {levelUp && (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
                <Trophy className="h-5 w-5 mx-auto mb-2 text-primary" />
                <h4 className="font-medium">Level Up!</h4>
                <p className="text-sm text-muted-foreground">You have reached level {userProgress.level}!</p>
              </div>
            )}
            
            {newBadges.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium flex items-center">
                  <Award className="h-4 w-4 mr-1 text-primary" />
                  New Achievements
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {newBadges.map((badge) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-lg bg-primary/5 border border-primary/10 flex items-center space-x-3"
                    >
                      <div className="text-2xl">{badge.icon}</div>
                      <div>
                        <div className="font-medium">{badge.name}</div>
                        <div className="text-xs text-muted-foreground">{badge.description}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onRestart}
            className="w-full sm:w-auto border-white/10"
          >
            <Star className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button 
            onClick={onClose}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            View Achievements
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default QuizResultsComponent
