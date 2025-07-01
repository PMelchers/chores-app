"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"
import { PageLayout } from "../layout/page-layout"
import { CheckCircle2, Clock, Star, Coins, Sparkles, Trophy, Target } from "lucide-react"

type Chore = {
  id: string
  title: string
  description: string
  coinValue: number
  xpValue: number
  category: string
  completed: boolean
  requiresApproval: boolean
  pendingApproval: boolean
}

export function ChoreList() {
  const [chores, setChores] = useState<Chore[]>([
    {
      id: "1",
      title: "Make Bed",
      description: "Make your bed neatly every morning",
      coinValue: 5,
      xpValue: 10,
      category: "bedroom",
      completed: true,
      requiresApproval: false,
      pendingApproval: false,
    },
    {
      id: "2",
      title: "Brush Teeth",
      description: "Brush your teeth for 2 minutes",
      coinValue: 3,
      xpValue: 5,
      category: "bathroom",
      completed: true,
      requiresApproval: false,
      pendingApproval: false,
    },
    {
      id: "3",
      title: "Clean Room",
      description: "Tidy up bedroom and put toys away",
      coinValue: 15,
      xpValue: 25,
      category: "bedroom",
      completed: false,
      requiresApproval: true,
      pendingApproval: false,
    },
    {
      id: "4",
      title: "Do Homework",
      description: "Complete all assigned homework",
      coinValue: 20,
      xpValue: 30,
      category: "homework",
      completed: false,
      requiresApproval: true,
      pendingApproval: false,
    },
    {
      id: "5",
      title: "Feed Pet",
      description: "Give food and water to family pet",
      coinValue: 8,
      xpValue: 15,
      category: "pets",
      completed: false,
      requiresApproval: false,
      pendingApproval: false,
    },
    {
      id: "6",
      title: "Set Table",
      description: "Set the dinner table for the family",
      coinValue: 10,
      xpValue: 20,
      category: "kitchen",
      completed: false,
      requiresApproval: true,
      pendingApproval: true,
    },
  ])

  const completedCount = chores.filter((chore) => chore.completed).length
  const totalCoinsEarned = chores.filter((chore) => chore.completed).reduce((sum, chore) => sum + chore.coinValue, 0)
  const progressPercentage = (completedCount / chores.length) * 100

  const handleCompleteChore = (choreId: string) => {
    setChores(
      chores.map((chore) => {
        if (chore.id === choreId) {
          if (chore.requiresApproval) {
            return { ...chore, pendingApproval: true }
          } else {
            return { ...chore, completed: true }
          }
        }
        return chore
      }),
    )
  }

  const getCategoryEmoji = (category: string) => {
    const emojis: { [key: string]: string } = {
      bedroom: "🛏️",
      bathroom: "🚿",
      kitchen: "🍽️",
      homework: "📚",
      pets: "🐕",
      general: "✨",
    }
    return emojis[category] || "✨"
  }

  return (
    <PageLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Progress Card */}
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Star className="h-6 w-6" />
                </div>
                Today's Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Chores Completed</span>
                <span className="text-3xl font-bold">
                  {completedCount}/{chores.length}
                </span>
              </div>
              <div className="relative">
                <Progress value={progressPercentage} className="h-4 bg-white/20" />
                <div
                  className="absolute top-0 left-0 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2">
                  <Coins className="h-4 w-4" />
                  Coins Earned Today: {totalCoinsEarned}
                </span>
                <span className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  {Math.round(progressPercentage)}% Complete
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Chores Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chores.map((chore) => (
              <Card
                key={chore.id}
                className={`transition-all duration-300 transform hover:scale-105 ${
                  chore.completed
                    ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30"
                    : chore.pendingApproval
                      ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/30"
                      : "bg-white/10 border-white/20 hover:bg-white/20"
                } backdrop-blur-sm shadow-xl`}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{getCategoryEmoji(chore.category)}</div>
                      <div>
                        <CardTitle
                          className={`text-lg ${chore.completed ? "line-through text-green-300" : "text-white"}`}
                        >
                          {chore.title}
                        </CardTitle>
                        <Badge className="mt-1 bg-white/20 text-white border border-white/30 capitalize">
                          {chore.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {chore.completed && <CheckCircle2 className="h-6 w-6 text-green-400" />}
                      {chore.pendingApproval && <Clock className="h-6 w-6 text-yellow-400 animate-pulse" />}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-purple-200">{chore.description}</p>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold px-3 py-1">
                        <Coins className="h-3 w-3 mr-1" />
                        {chore.coinValue}
                      </Badge>
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-3 py-1">
                        <Star className="h-3 w-3 mr-1" />
                        {chore.xpValue} XP
                      </Badge>
                    </div>
                  </div>

                  {chore.requiresApproval && !chore.completed && !chore.pendingApproval && (
                    <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs">
                      Requires Parent Approval
                    </Badge>
                  )}

                  {!chore.completed && !chore.pendingApproval && (
                    <Button
                      onClick={() => handleCompleteChore(chore.id)}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      {chore.requiresApproval ? "Submit for Approval" : "Mark Complete"}
                    </Button>
                  )}

                  {chore.pendingApproval && (
                    <div className="text-center">
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold px-4 py-2">
                        <Clock className="h-4 w-4 mr-2" />
                        Waiting for Parent Approval
                      </Badge>
                    </div>
                  )}

                  {chore.completed && (
                    <div className="text-center">
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-4 py-2">
                        <Trophy className="h-4 w-4 mr-2" />
                        Completed! +{chore.coinValue} coins, +{chore.xpValue} XP
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Completion Celebration */}
          {completedCount === chores.length && (
            <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center border-0 shadow-2xl">
              <CardContent className="py-12">
                <div className="text-8xl mb-6">🎉</div>
                <h3 className="text-4xl font-bold mb-4">Amazing Work!</h3>
                <p className="text-xl mb-4">You've completed all your chores for today!</p>
                <div className="flex justify-center items-center gap-4 text-lg">
                  <Badge className="bg-white/20 text-white font-bold px-6 py-3 text-lg">
                    <Coins className="h-5 w-5 mr-2" />
                    Total earned: {totalCoinsEarned} coins
                  </Badge>
                  <Badge className="bg-white/20 text-white font-bold px-6 py-3 text-lg">
                    <Sparkles className="h-5 w-5 mr-2" />
                    You're a champion!
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
