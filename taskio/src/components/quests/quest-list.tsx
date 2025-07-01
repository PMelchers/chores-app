"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"
import { PageLayout } from "../layout/page-layout"
import { Sword, Trophy, Star, Clock, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"

type Quest = {
  id: string
  title: string
  description: string
  coinReward: number
  xpReward: number
  difficulty: "easy" | "medium" | "hard" | "epic"
  type: "one-time" | "seasonal" | "challenge"
  deadline?: Date
  status: "active" | "completed" | "in-progress"
  requirements: { text: string; completed: boolean }[]
  progress: number
}

export function QuestList() {
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: "1",
      title: "Math Master Challenge",
      description: "Complete 20 math problems without any mistakes and become a true math hero!",
      coinReward: 50,
      xpReward: 100,
      difficulty: "medium",
      type: "challenge",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: "in-progress",
      requirements: [
        { text: "Complete math homework", completed: true },
        { text: "Score 100% on practice test", completed: false },
        { text: "Help sibling with math", completed: false },
      ],
      progress: 33,
    },
    {
      id: "2",
      title: "Holiday Helper",
      description: "Spread joy by helping with holiday preparations and making the season magical!",
      coinReward: 75,
      xpReward: 150,
      difficulty: "easy",
      type: "seasonal",
      deadline: new Date("2024-12-25"),
      status: "active",
      requirements: [
        { text: "Decorate Christmas tree", completed: false },
        { text: "Wrap 5 presents", completed: false },
        { text: "Bake cookies with family", completed: false },
      ],
      progress: 0,
    },
    {
      id: "3",
      title: "Reading Adventure",
      description: "Embark on literary journeys and discover new worlds through books!",
      coinReward: 100,
      xpReward: 200,
      difficulty: "hard",
      type: "challenge",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "in-progress",
      requirements: [
        { text: "Read first book", completed: true },
        { text: "Read second book", completed: true },
        { text: "Read third book", completed: false },
        { text: "Write reviews for all books", completed: false },
      ],
      progress: 50,
    },
    {
      id: "4",
      title: "Kitchen Helper Epic",
      description: "Master the culinary arts and become the ultimate kitchen assistant!",
      coinReward: 150,
      xpReward: 300,
      difficulty: "epic",
      type: "challenge",
      status: "active",
      requirements: [
        { text: "Learn to make pancakes", completed: false },
        { text: "Help cook dinner 5 times", completed: false },
        { text: "Organize spice cabinet", completed: false },
        { text: "Create your own recipe", completed: false },
      ],
      progress: 0,
    },
  ])

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: "bg-green-100 text-green-800 border-green-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      hard: "bg-orange-100 text-orange-800 border-orange-200",
      epic: "bg-purple-100 text-purple-800 border-purple-200",
    }
    return colors[difficulty as keyof typeof colors] || colors.easy
  }

  const getDifficultyIcon = (difficulty: string) => {
    const icons = {
      easy: "⭐",
      medium: "⭐⭐",
      hard: "⭐⭐⭐",
      epic: "👑",
    }
    return icons[difficulty as keyof typeof icons] || icons.easy
  }

  const handleStartQuest = (questId: string) => {
    setQuests(quests.map((quest) => (quest.id === questId ? { ...quest, status: "in-progress" as const } : quest)))
  }

  const toggleRequirement = (questId: string, requirementIndex: number) => {
    setQuests(
      quests.map((quest) => {
        if (quest.id === questId) {
          const newRequirements = [...quest.requirements]
          newRequirements[requirementIndex].completed = !newRequirements[requirementIndex].completed
          const completedCount = newRequirements.filter((req) => req.completed).length
          const newProgress = (completedCount / newRequirements.length) * 100

          return {
            ...quest,
            requirements: newRequirements,
            progress: newProgress,
            status: newProgress === 100 ? ("completed" as const) : quest.status,
          }
        }
        return quest
      }),
    )
  }

  const activeQuests = quests.filter((quest) => quest.status !== "completed")
  const completedQuests = quests.filter((quest) => quest.status === "completed")

  return (
    <PageLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Sword className="h-6 w-6" />
                Epic Quest Adventures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">
                Complete epic quests to earn massive rewards and unlock legendary achievements! 🏆
              </p>
              <div className="flex gap-4 mt-4 text-sm">
                <span>Active Quests: {activeQuests.length}</span>
                <span>Completed: {completedQuests.length}</span>
              </div>
            </CardContent>
          </Card>

          {activeQuests.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                <Sword className="h-5 w-5" />
                Active Quests
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeQuests.map((quest) => (
                  <Card
                    key={quest.id}
                    className={`relative overflow-hidden border-2 bg-white/10 backdrop-blur-sm shadow-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105`}
                  >
                    <div
                      className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold ${getDifficultyColor(quest.difficulty)}`}
                    >
                      {getDifficultyIcon(quest.difficulty)} {quest.difficulty.toUpperCase()}
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg pr-20 flex items-center gap-2 text-white">
                        <Sword className="h-5 w-5" />
                        {quest.title}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="capitalize bg-white/20 text-white border-white/30">
                          {quest.type}
                        </Badge>
                        <Badge
                          variant={quest.status === "in-progress" ? "default" : "secondary"}
                          className="bg-blue-500/20 text-blue-300 border-blue-400/30"
                        >
                          {quest.status === "in-progress" ? "In Progress" : "Ready to Start"}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-sm text-purple-200">{quest.description}</p>

                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1 bg-yellow-500/20 text-yellow-300 border-yellow-400/30"
                          >
                            🪙 {quest.coinReward}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1 bg-purple-500/20 text-purple-300 border-purple-400/30"
                          >
                            <Star className="h-3 w-3" />
                            {quest.xpReward} XP
                          </Badge>
                        </div>
                        {quest.deadline && (
                          <Badge
                            variant="outline"
                            className="text-xs flex items-center gap-1 bg-white/20 text-white border-white/30"
                          >
                            <Clock className="h-3 w-3" />
                            {format(quest.deadline, "MMM dd")}
                          </Badge>
                        )}
                      </div>

                      {quest.status === "in-progress" && (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-white">Progress</span>
                            <span className="text-sm text-purple-200">{Math.round(quest.progress)}%</span>
                          </div>
                          <Progress value={quest.progress} className="h-2" />
                        </div>
                      )}

                      <div className="space-y-2">
                        <span className="text-sm font-medium text-white">Quest Requirements:</span>
                        <div className="space-y-2">
                          {quest.requirements.map((requirement, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <button
                                onClick={() => toggleRequirement(quest.id, index)}
                                className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center transition-colors ${
                                  requirement.completed
                                    ? "bg-green-500 border-green-500 text-white"
                                    : "border-gray-300 hover:border-gray-400"
                                }`}
                                disabled={quest.status !== "in-progress"}
                              >
                                {requirement.completed && <CheckCircle2 className="h-3 w-3" />}
                              </button>
                              <span
                                className={`text-sm ${
                                  requirement.completed ? "line-through text-purple-300" : "text-white"
                                }`}
                              >
                                {requirement.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {quest.status === "active" && (
                        <Button
                          onClick={() => handleStartQuest(quest.id)}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                          size="sm"
                        >
                          Start Quest Adventure! 🚀
                        </Button>
                      )}

                      {quest.status === "in-progress" && quest.progress === 100 && (
                        <div className="text-center space-y-2">
                          <div className="text-4xl">🎉</div>
                          <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-400/30">
                            Quest Complete! Claim your rewards!
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {completedQuests.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Completed Quests
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedQuests.map((quest) => (
                  <Card key={quest.id} className="bg-green-500/20 border-green-400/30 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-yellow-500" />
                          <span className="font-medium text-white">{quest.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-green-300">🪙 +{quest.coinReward}</span>
                          <span className="text-blue-300">⭐ +{quest.xpReward}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeQuests.length === 0 && completedQuests.length === 0 && (
            <Card className="text-center py-12 bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
              <CardContent>
                <div className="text-6xl mb-4">🗡️</div>
                <h3 className="text-xl font-bold mb-2 text-white">No Quests Available</h3>
                <p className="text-purple-200">Check back later for new epic adventures!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
