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
    <div className="min-h-screen p-4" style={{
      background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #dda0dd, #ff6b6b)',
      backgroundSize: '400% 400%',
      animation: 'rainbow 3s ease infinite'
    }}>
      <style>{`
        @keyframes rainbow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes wobble {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(2deg); }
          75% { transform: rotate(-2deg); }
        }
        .wobble-card {
          animation: wobble 2s ease-in-out infinite;
        }
      `}</style>
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl transform hover:scale-105 transition-all duration-300 wobble-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Star className="h-6 w-6 animate-spin" />
              🚀 Today's Epic Progress! 🚀
              <Star className="h-6 w-6 animate-spin" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">🎯 Chores Completed</span>
              <span className="text-3xl font-bold animate-bounce">
                {completedCount}/{chores.length}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-4 bg-white/20 shadow-inner" />
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="animate-pulse">💰 Coins Earned Today: 🪙 {totalCoinsEarned}</span>
              <span className="text-yellow-300">{Math.round(progressPercentage)}% Complete!</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chores.map((chore, index) => (
            <Card
              key={chore.id}
              className={`transition-all duration-300 transform hover:scale-105 hover:rotate-1 shadow-lg ${
                chore.completed
                  ? "bg-gradient-to-br from-green-100 to-green-200 border-green-400 border-2"
                  : chore.pendingApproval
                    ? "bg-gradient-to-br from-yellow-100 to-orange-200 border-yellow-400 border-2"
                    : "bg-gradient-to-br from-white to-blue-50 border-blue-300 border-2 hover:shadow-2xl"
              }`}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
                      {getCategoryEmoji(chore.category)}
                    </span>
                    <CardTitle className={`text-lg font-bold ${chore.completed ? "line-through text-gray-500" : "text-purple-800"}`}>
                      {chore.title}
                    </CardTitle>
                  </div>
                  {chore.completed && <CheckCircle2 className="h-6 w-6 text-green-500 animate-spin" />}
                  {chore.pendingApproval && <Clock className="h-6 w-6 text-yellow-500 animate-pulse" />}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-700 font-medium">{chore.description}</p>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold shadow-md animate-pulse">
                      <Coins className="h-3 w-3 mr-1" />
                      🪙 {chore.coinValue}
                    </Badge>
                    <Badge className="bg-gradient-to-r from-purple-400 to-purple-600 text-white font-bold shadow-md">
                      <Star className="h-3 w-3 mr-1" />
                      ⭐ {chore.xpValue} XP
                    </Badge>
                  </div>
                  <Badge className="bg-gradient-to-r from-pink-300 to-pink-500 text-white font-bold capitalize shadow-md">
                    {chore.category}
                  </Badge>
                </div>

                {chore.requiresApproval && !chore.completed && !chore.pendingApproval && (
                  <Badge className="bg-orange-100 text-orange-800 text-xs font-bold border-2 border-orange-300">
                    ⚠️ Requires Parent Approval
                  </Badge>
                )}

                {!chore.completed && !chore.pendingApproval && (
                  <Button 
                    onClick={() => handleCompleteChore(chore.id)} 
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 shadow-lg transform hover:scale-105 transition-all duration-300" 
                    size="sm"
                  >
                    {chore.requiresApproval ? "🚀 Submit for Approval" : "✅ Mark Complete"}
                  </Button>
                )}

                {chore.pendingApproval && (
                  <div className="text-center">
                    <Badge className="bg-gradient-to-r from-yellow-200 to-orange-300 text-orange-800 font-bold py-2 px-4 animate-pulse">
                      ⏳ Waiting for Parent Approval (Epic Reward Coming!)
                    </Badge>
                  </div>
                )}

                {chore.completed && (
                  <div className="text-center">
                    <Badge className="bg-gradient-to-r from-green-200 to-emerald-300 text-green-800 font-bold py-2 px-4 animate-bounce">
                      🎉 Completed! +{chore.coinValue} coins, +{chore.xpValue} XP! 🎉
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {completedCount === chores.length && (
          <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center shadow-2xl transform hover:scale-105 transition-all duration-300 wobble-card">
            <CardContent className="py-8">
              <div className="text-8xl mb-4 animate-bounce">🎉</div>
              <h3 className="text-4xl font-bold mb-2 animate-pulse">🔥 AMAZING WORK! 🔥</h3>
              <p className="text-xl font-bold">You've completed ALL your chores for today! POGGERS! 🎯</p>
              <p className="text-lg mt-2 font-bold animate-bounce">Total earned: 💰 {totalCoinsEarned} coins! No cap! 📈</p>
              <div className="mt-4 text-6xl animate-spin">⭐</div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
