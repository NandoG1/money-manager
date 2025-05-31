"use client"

import { PomodoroTimer } from "@/components/pomodoro/PomodoroTimer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, BookOpen, Coffee, Brain } from "lucide-react"

export default function PomodoroPage() {
  return (
    <section className="mb-6 px-2 md:px-0">
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-bold md:text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">Pomodoro Timer</h3>
          <div className="h-px flex-grow bg-gradient-to-r from-purple-500/50 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          <div className="flex flex-col items-center justify-center">
            <PomodoroTimer />
          </div>

          <div className="space-y-6">
            <Card className="border border-white/10 bg-black/40 backdrop-blur-sm shadow-lg dark:border-white/10 dark:bg-black/40 dark:backdrop-blur-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-500" />
                  <span>What is the Pomodoro Technique?</span>
                </h2>
                <p className="text-muted-foreground mb-4">
                  The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. 
                  It uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="flex flex-col items-center p-4 bg-black/20 rounded-lg border border-white/5">
                    <BookOpen className="h-8 w-8 text-purple-500 mb-2" />
                    <h3 className="font-medium text-center">Focus Sessions</h3>
                    <p className="text-xs text-center text-muted-foreground mt-1">25-minute deep work periods</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-black/20 rounded-lg border border-white/5">
                    <Coffee className="h-8 w-8 text-green-500 mb-2" />
                    <h3 className="font-medium text-center">Short Breaks</h3>
                    <p className="text-xs text-center text-muted-foreground mt-1">5-minute rest between sessions</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-black/20 rounded-lg border border-white/5">
                    <Brain className="h-8 w-8 text-blue-500 mb-2" />
                    <h3 className="font-medium text-center">Long Breaks</h3>
                    <p className="text-xs text-center text-muted-foreground mt-1">15-minute rest after 4 sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-black/40 backdrop-blur-sm shadow-lg dark:border-white/10 dark:bg-black/40 dark:backdrop-blur-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">How to Use the Pomodoro Technique</h2>
                <ol className="space-y-3 text-muted-foreground list-decimal list-inside">
                  <li>Choose a task you want to work on</li>
                  <li>Set the timer for 25 minutes (Focus mode)</li>
                  <li>Work on the task until the timer rings</li>
                  <li>Take a short 5-minute break (Short Break mode)</li>
                  <li>After 4 pomodoros, take a longer 15-minute break (Long Break mode)</li>
                </ol>
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Benefits:</h3>
                  <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                    <li>Improves focus and concentration</li>
                    <li>Reduces mental fatigue</li>
                    <li>Increases productivity and efficiency</li>
                    <li>Helps manage distractions and interruptions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
