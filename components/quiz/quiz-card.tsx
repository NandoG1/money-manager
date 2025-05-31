"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useQuiz, type QuizQuestion } from "@/lib/store/quiz"
import { CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuizCardProps {
  onComplete: (score: number, total: number) => void
  category?: string
  difficulty?: "easy" | "medium" | "hard"
  questionsCount?: number
}

function QuizCardComponent({ onComplete, category, difficulty, questionsCount = 5 }: QuizCardProps) {
  const { getRandomQuizQuestions, submitQuizAnswer } = useQuiz()
  const [questions] = useState<QuizQuestion[]>(getRandomQuizQuestions(questionsCount, category, difficulty))
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)

  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return

    setSelectedAnswer(answerIndex)
    setIsAnswered(true)

    const correct = submitQuizAnswer(currentQuestion.id, answerIndex)
    setIsCorrect(correct)

    if (correct) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      onComplete(score, questions.length)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-500 dark:text-green-400"
      case "medium":
        return "text-yellow-500 dark:text-yellow-400"
      case "hard":
        return "text-red-500 dark:text-red-400"
      default:
        return "text-gray-500 dark:text-gray-400"
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto border border-white/10 bg-black/40 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Financial Quiz</CardTitle>
            <CardDescription>
              Question {currentQuestionIndex + 1} of {questions.length} •
              <span className={cn("ml-1 font-medium", getDifficultyColor(currentQuestion.difficulty))}>
                {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
              </span>
            </CardDescription>
          </div>
          <div className="text-2xl font-bold">
            {score}/{currentQuestionIndex + (isAnswered ? 1 : 0)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-lg font-medium">{currentQuestion.question}</div>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={cn(
                "w-full text-left p-4 rounded-lg border transition-colors",
                selectedAnswer === index
                  ? isCorrect
                    ? "border-green-500 bg-green-500/10 text-green-500"
                    : "border-red-500 bg-red-500/10 text-red-500"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50",
                isAnswered && currentQuestion.correctAnswer === index && "border-green-500 bg-green-500/10 text-green-500"
              )}
              onClick={() => handleAnswerSelect(index)}
              disabled={isAnswered}
            >
              <div className="flex items-center">
                {isAnswered ? (
                  index === currentQuestion.correctAnswer ? (
                    <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                  ) : selectedAnswer === index ? (
                    <XCircle className="h-5 w-5 mr-2 text-red-500" />
                  ) : (
                    <div className="h-5 w-5 mr-2" />
                  )
                ) : (
                  <div className="h-5 w-5 mr-2" />
                )}
                {option}
              </div>
            </button>
          ))}
        </div>
        {isAnswered && (
          <div className={cn(
            "p-4 rounded-lg", 
            isCorrect ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"
          )}>
            <div className="font-medium mb-1">{isCorrect ? "Correct!" : "Incorrect!"}</div>
            <div className="text-sm">{currentQuestion.explanation}</div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="ml-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700" 
          onClick={handleNextQuestion} 
          disabled={!isAnswered}
        >
          {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default QuizCardComponent
