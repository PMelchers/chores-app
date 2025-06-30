"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"
import { CheckCircle2, Clock, Star, Coins } from "lucide-react"

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
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Today's Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg">Chores Completed</span>
            <span className="text-2xl font-bold">
              {completedCount}/{chores.length}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3 bg-white/20" />
          <div className="flex justify-between items-center text-sm">
            <span>Coins Earned Today: 🪙 {totalCoinsEarned}</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {chores.map((chore) => (
          <Card
            key={chore.id}
            className={`transition-all duration-200 ${
              chore.completed
                ? "bg-green-50 border-green-200"
                : chore.pendingApproval
                  ? "bg-yellow-50 border-yellow-200"
                  : "hover:shadow-md"
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getCategoryEmoji(chore.category)}</span>
                  <CardTitle className={`text-lg ${chore.completed ? "line-through text-muted-foreground" : ""}`}>
                    {chore.title}
                  </CardTitle>
                </div>
                {chore.completed && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                {chore.pendingApproval && <Clock className="h-5 w-5 text-yellow-500" />}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{chore.description}</p>

              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Coins className="h-3 w-3" />
                    {chore.coinValue}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {chore.xpValue} XP
                  </Badge>
                </div>
                <Badge variant="outline" className="capitalize">
                  {chore.category}
                </Badge>
              </div>

              {chore.requiresApproval && !chore.completed && !chore.pendingApproval && (
                <Badge variant="outline" className="text-xs">
                  Requires Parent Approval
                </Badge>
              )}

              {!chore.completed && !chore.pendingApproval && (
                <Button onClick={() => handleCompleteChore(chore.id)} className="w-full" size="sm">
                  {chore.requiresApproval ? "Submit for Approval" : "Mark Complete"}
                </Button>
              )}

              {chore.pendingApproval && (
                <div className="text-center">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    ⏳ Waiting for Parent Approval
                  </Badge>
                </div>
              )}

              {chore.completed && (
                <div className="text-center">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    ✅ Completed! +{chore.coinValue} coins, +{chore.xpValue} XP
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {completedCount === chores.length && (
        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center">
          <CardContent className="py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-2">Amazing Work!</h3>
            <p className="text-lg">You've completed all your chores for today!</p>
            <p className="text-sm mt-2">Total earned: 🪙 {totalCoinsEarned} coins</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
