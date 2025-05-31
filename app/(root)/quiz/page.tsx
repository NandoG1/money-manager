"use client"

import { useState, useEffect } from "react"
import dynamic from 'next/dynamic'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Brain, Trophy, Award, BookOpen, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"

const QuizCard = dynamic(() => import('@/components/quiz/quiz-card'), { ssr: false })
const QuizResults = dynamic(() => import('@/components/quiz/quiz-results'), { ssr: false })
const BadgesShowcase = dynamic(() => import('@/components/quiz/badges-showcase'), { ssr: false })
const UserLevelCard = dynamic(() => import('@/components/quiz/user-level-card'), { ssr: false })
const UserSwitch = dynamic(() => import('@/components/UserSwitch'), { ssr: false })

export default function QuizPage() {
  const { status: sessionStatus } = useSession()
  
  const [activeTab, setActiveTab] = useState("quiz")
  const [quizState, setQuizState] = useState<"start" | "in-progress" | "completed">("start")
  const [quizScore, setQuizScore] = useState({ score: 0, total: 0 })
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)
  const [selectedDifficulty, setSelectedDifficulty] = useState<"easy" | "medium" | "hard" | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [isStoreReady, setIsStoreReady] = useState(false)

  useEffect(() => {
    const initStore = async () => {
      try {
        const quizModule = await import('@/lib/store/quiz')
        const { fetchUserProgress } = quizModule.useQuiz.getState()
        
        if (sessionStatus !== 'loading') {
          await fetchUserProgress()
        }
        
        setIsStoreReady(true)
      } catch (error) {
        console.error("Failed to initialize quiz store:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    initStore()
  }, [sessionStatus])

  const handleQuizComplete = (score: number, total: number) => {
    setQuizScore({ score, total })
    setQuizState("completed")
  }

  const handleRestartQuiz = () => {
    setQuizState("start")
  }

  const handleStartQuiz = () => {
    setQuizState("in-progress")
  }

  const renderQuizContent = () => {
    switch (quizState) {
      case "start":
        return (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Financial Knowledge Quiz</h1>
              <p className="text-muted-foreground">
                Test your financial knowledge, learn new concepts, and earn badges!
              </p>
            </div>

            <div className="bg-muted/30 rounded-lg p-6 mb-8 border border-white/10">
              <h2 className="text-lg font-medium mb-4">Quiz Options</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category (Optional)</label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedCategory === undefined ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(undefined)}
                      className={selectedCategory === undefined ? "bg-gradient-to-r from-blue-500 to-indigo-600" : "border-white/10"}
                    >
                      All Categories
                    </Button>
                    <Button
                      variant={selectedCategory === "saving" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory("saving")}
                      className={selectedCategory === "saving" ? "bg-gradient-to-r from-blue-500 to-indigo-600" : "border-white/10"}
                    >
                      Saving
                    </Button>
                    <Button
                      variant={selectedCategory === "budgeting" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory("budgeting")}
                      className={selectedCategory === "budgeting" ? "bg-gradient-to-r from-blue-500 to-indigo-600" : "border-white/10"}
                    >
                      Budgeting
                    </Button>
                    <Button
                      variant={selectedCategory === "investing" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory("investing")}
                      className={selectedCategory === "investing" ? "bg-gradient-to-r from-blue-500 to-indigo-600" : "border-white/10"}
                    >
                      Investing
                    </Button>
                    <Button
                      variant={selectedCategory === "debt" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory("debt")}
                      className={selectedCategory === "debt" ? "bg-gradient-to-r from-blue-500 to-indigo-600" : "border-white/10"}
                    >
                      Debt
                    </Button>
                    <Button
                      variant={selectedCategory === "general" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory("general")}
                      className={selectedCategory === "general" ? "bg-gradient-to-r from-blue-500 to-indigo-600" : "border-white/10"}
                    >
                      General
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty (Optional)</label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedDifficulty === undefined ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDifficulty(undefined)}
                      className={selectedDifficulty === undefined ? "bg-gradient-to-r from-blue-500 to-indigo-600" : "border-white/10"}
                    >
                      All Difficulties
                    </Button>
                    <Button
                      variant={selectedDifficulty === "easy" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDifficulty("easy")}
                      className={selectedDifficulty === "easy" ? "bg-gradient-to-r from-green-500 to-emerald-600" : "border-white/10"}
                    >
                      Easy
                    </Button>
                    <Button
                      variant={selectedDifficulty === "medium" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDifficulty("medium")}
                      className={selectedDifficulty === "medium" ? "bg-gradient-to-r from-yellow-500 to-amber-600" : "border-white/10"}
                    >
                      Medium
                    </Button>
                    <Button
                      variant={selectedDifficulty === "hard" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDifficulty("hard")}
                      className={selectedDifficulty === "hard" ? "bg-gradient-to-r from-red-500 to-rose-600" : "border-white/10"}
                    >
                      Hard
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button 
                size="lg" 
                onClick={handleStartQuiz}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                Start Quiz
              </Button>
            </div>
          </div>
        )
      case "in-progress":
        return <QuizCard onComplete={handleQuizComplete} category={selectedCategory} difficulty={selectedDifficulty} />
      case "completed":
        return (
          <QuizResults
            score={quizScore.score}
            total={quizScore.total}
            onRestart={handleRestartQuiz}
            onClose={() => setActiveTab("achievements")}
          />
        )
    }
  }

  if (sessionStatus === 'loading' || isLoading || !isStoreReady) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading quiz data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">Financial Quiz</h2>
      </div>

      <UserSwitch />

      <Tabs defaultValue="quiz" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-black/60 border border-white/10">
          <TabsTrigger value="quiz" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-white">
            <BookOpen className="h-4 w-4 mr-2" />
            Quiz
          </TabsTrigger>
          <TabsTrigger value="achievements" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-white">
            <Trophy className="h-4 w-4 mr-2" />
            Achievements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quiz" className="space-y-4">
          {renderQuizContent()}
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <UserLevelCard />
            <div className="space-y-4 border border-white/10 bg-black/40 backdrop-blur-sm shadow-lg rounded-lg p-6">
              <div className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-primary" />
                <h3 className="text-lg font-medium">Your Achievements</h3>
              </div>
              <p className="text-muted-foreground">
                Complete quizzes and challenges to earn badges and level up your financial knowledge.
              </p>
              <Button 
                onClick={() => setActiveTab("quiz")}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                Take a Quiz
              </Button>
            </div>
          </div>
          <BadgesShowcase />
        </TabsContent>
      </Tabs>
    </div>
  )
}
