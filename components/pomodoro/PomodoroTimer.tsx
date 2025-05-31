"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

type TimerMode = "focus" | "shortBreak" | "longBreak"

const TIMER_SETTINGS = {
  focus: { minutes: 25, color: "bg-primary" },
  shortBreak: { minutes: 5, color: "bg-green-500" },
  longBreak: { minutes: 15, color: "bg-blue-500" },
}

export function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>("focus")
  const [timeLeft, setTimeLeft] = useState(TIMER_SETTINGS[mode].minutes * 60)
  const [isActive, setIsActive] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (isActive && timeLeft === 0) {
      setIsActive(false)
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [isActive, timeLeft])

  useEffect(() => {
    setTimeLeft(TIMER_SETTINGS[mode].minutes * 60)
    setIsActive(false)
  }, [mode])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(TIMER_SETTINGS[mode].minutes * 60)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const calculateProgress = () => {
    const totalSeconds = TIMER_SETTINGS[mode].minutes * 60
    return ((totalSeconds - timeLeft) / totalSeconds) * 100
  }

  return (
    <Card className="w-full max-w-md border border-white/10 bg-black/40 backdrop-blur-sm shadow-lg dark:border-white/10 dark:bg-black/40 dark:backdrop-blur-sm">
      <CardHeader>
        <Tabs defaultValue="focus" className="w-full" onValueChange={(value) => setMode(value as TimerMode)}>
          <TabsList className="grid w-full grid-cols-3 bg-black/60 border border-white/10">
            <TabsTrigger 
              value="focus"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-white"
            >
              Focus
            </TabsTrigger>
            <TabsTrigger 
              value="shortBreak"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-white"
            >
              Short Break
            </TabsTrigger>
            <TabsTrigger 
              value="longBreak"
              className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-white"
            >
              Long Break
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative flex items-center justify-center w-64 h-64 mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle className="text-muted stroke-current" strokeWidth="4" fill="transparent" r="42" cx="50" cy="50" />
            <circle
              className={cn("stroke-current transition-all duration-500", {
                "text-primary": mode === "focus",
                "text-green-500": mode === "shortBreak",
                "text-blue-500": mode === "longBreak",
              })}
              strokeWidth="4"
              strokeLinecap="round"
              fill="transparent"
              r="42"
              cx="50"
              cy="50"
              strokeDasharray="264"
              strokeDashoffset={264 - (calculateProgress() / 100) * 264}
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl font-bold">{formatTime(timeLeft)}</span>
            <span className="text-sm text-muted-foreground mt-1">{isActive ? "In progress" : "Paused"}</span>
          </div>
        </div>

        <div className="flex gap-4 w-full">
          <Button variant="outline" onClick={resetTimer} className="flex-1 border-white/10">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={toggleTimer}
            className={cn("flex-1", {
              "bg-primary hover:bg-primary/90": mode === "focus",
              "bg-green-500 hover:bg-green-500/90": mode === "shortBreak",
              "bg-blue-500 hover:bg-blue-500/90": mode === "longBreak",
            })}
          >
            {isActive ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
