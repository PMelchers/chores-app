"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Progress } from "../ui/progress"
import { useAuth } from "../providers/auth-provider"
import { useTasks } from "../../hooks/useTasks"
import { LoadingSpinner } from "../ui/loading-spinner"
import { PageLayout } from "../layout/page-layout"
import { Header } from "../layout/header"
import { ChoreList } from "../tasks/chore-list"
import { QuestList } from "../quests/quest-list"
import { RewardShop } from "../rewards/reward-shop"
import { HistoryLog } from "../history/history-log"
import { AvatarPetPanel } from "../avatar/avatar-pet-panel"
import {
  CheckCircle,
  Clock,
  Star,
  Trophy,
  Target,
  Calendar,
  Gift,
  Zap,
  Sparkles,
  TrendingUp,
  Award,
  Flame,
} from "lucide-react"
import { format } from "date-fns"

export function ChildDashboard() {
  const { user } = useAuth()
  const { tasks, loading, toggleTaskCompletion, error } = useTasks()
  const [currentPage, setCurrentPage] = useState("dashboard")

  const completedTasks = tasks.filter((task: any) => task.completed)
  const pendingTasks = tasks.filter((task: any) => !task.completed)
  const totalPoints = completedTasks.reduce((sum: number, task: any) => sum + (task.points || 0), 0)
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0

  const handleToggleTask = async (taskId: string) => {
    try {
      await toggleTaskCompletion(taskId)
    } catch (error) {
      console.error("Failed to toggle task:", error)
    }
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "tasks":
        return <ChoreList />
      case "quests":
        return <QuestList />
      case "rewards":
        return <RewardShop />
      case "history":
        return <HistoryLog />
      case "avatar":
        return <AvatarPetPanel />
      default:
        return renderDashboard()
    }
  }

  const getPageTitle = () => {
    switch (currentPage) {
      case "tasks":
        return "Daily Tasks"
      case "quests":
        return "Epic Quests"
      case "rewards":
        return "Reward Shop"
      case "history":
        return "Your Journey"
      case "avatar":
        return "Your Avatar"
      default:
        return "My Adventure Dashboard"
    }
  }

  const getPageSubtitle = () => {
    switch (currentPage) {
      case "tasks":
        return "Complete your daily adventures! 🌟"
      case "quests":
        return "Embark on epic challenges! ⚡"
      case "rewards":
        return "Spend your coins on amazing rewards! 🎁"
      case "history":
        return "Track your epic journey! 📈"
      case "avatar":
        return "Customize your character! 👤"
      default:
        return "Your epic quest awaits! 🌟"
    }
  }

  const renderDashboard = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-white mt-4 text-lg">Loading your adventure...</p>
          </div>
        </div>
      )
    }

    return (
      <div className="max-w-7xl mx-auto space-y-8">
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-200 backdrop-blur-sm animate-shake">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              {error}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white border-0 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-100">Total Points</CardTitle>
              <div className="relative">
                <Star className="h-8 w-8 text-yellow-200" />
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-white animate-pulse" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalPoints}</div>
              <p className="text-xs text-yellow-100 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                Keep earning more!
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Completed</CardTitle>
              <div className="relative">
                <CheckCircle className="h-8 w-8 text-green-200" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completedTasks.length}</div>
              <p className="text-xs text-green-100 flex items-center gap-1 mt-1">
                <Award className="h-3 w-3" />
                Tasks finished
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Pending</CardTitle>
              <div className="relative">
                <Clock className="h-8 w-8 text-orange-200" />
                {pendingTasks.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingTasks.length}</div>
              <p className="text-xs text-orange-100 flex items-center gap-1 mt-1">
                <Flame className="h-3 w-3" />
                Tasks to do
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Progress</CardTitle>
              <div className="relative">
                <Trophy className="h-8 w-8 text-purple-200" />
                <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completionRate}%</div>
              <p className="text-xs text-purple-100 flex items-center gap-1 mt-1">
                <Target className="h-3 w-3" />
                Completion rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white text-2xl">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                <Target className="h-6 w-6 text-white" />
              </div>
              Your Epic Progress
            </CardTitle>
            <CardDescription className="text-purple-200 text-lg">Keep up the amazing work, champion!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-white">
                  <span className="text-lg font-medium">Overall Completion</span>
                  <span className="text-2xl font-bold text-yellow-400">{completionRate}%</span>
                </div>
                <div className="relative">
                  <Progress value={completionRate} className="h-4 bg-white/20" />
                  <div
                    className="absolute top-0 left-0 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="text-center p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl border border-yellow-400/30 backdrop-blur-sm">
                  <div className="text-4xl font-bold text-yellow-400 mb-2">{totalPoints}</div>
                  <div className="text-yellow-200 font-medium">Points Earned</div>
                  <div className="flex justify-center mt-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                  </div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-400/30 backdrop-blur-sm">
                  <div className="text-4xl font-bold text-green-400 mb-2">{completedTasks.length}</div>
                  <div className="text-green-200 font-medium">Tasks Completed</div>
                  <div className="flex justify-center mt-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-400/30 backdrop-blur-sm">
                  <div className="text-4xl font-bold text-blue-400 mb-2">{tasks.length}</div>
                  <div className="text-blue-200 font-medium">Total Tasks</div>
                  <div className="flex justify-center mt-2">
                    <Trophy className="h-5 w-5 text-blue-400" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tasks Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center gap-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  Quick Tasks Preview
                </CardTitle>
                <CardDescription className="text-purple-200 text-lg">
                  Your most urgent tasks at a glance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pending" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-1">
                    <TabsTrigger
                      value="pending"
                      className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-lg"
                    >
                      To Do ({pendingTasks.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="completed"
                      className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-lg"
                    >
                      Done ({completedTasks.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="pending" className="space-y-4 mt-6">
                    {pendingTasks.slice(0, 3).map((task: any) => (
                      <ChildTaskCard key={task.id} task={task} onToggle={handleToggleTask} />
                    ))}
                    {pendingTasks.length > 3 && (
                      <Button
                        onClick={() => setCurrentPage("tasks")}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl"
                      >
                        View All Tasks ({pendingTasks.length})
                      </Button>
                    )}
                  </TabsContent>

                  <TabsContent value="completed" className="space-y-4 mt-6">
                    {completedTasks.slice(0, 3).map((task: any) => (
                      <ChildTaskCard key={task.id} task={task} onToggle={handleToggleTask} />
                    ))}
                    {completedTasks.length > 3 && (
                      <Button
                        onClick={() => setCurrentPage("tasks")}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl"
                      >
                        View All Completed ({completedTasks.length})
                      </Button>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Points & Rewards */}
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white text-xl">
                  <div className="bg-gradient-to-r from-pink-500 to-red-500 p-3 rounded-xl">
                    <Gift className="h-5 w-5 text-white" />
                  </div>
                  Rewards Shop
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl border border-yellow-400/30">
                    <div className="flex justify-center mb-3">
                      <div className="relative">
                        <Star className="h-12 w-12 text-yellow-400" />
                        <Sparkles className="absolute -top-1 -right-1 h-6 w-6 text-white animate-pulse" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-yellow-400 mb-1">{totalPoints} Points</div>
                    <div className="text-yellow-200">Available to spend</div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-white text-lg flex items-center gap-2">
                      <Gift className="h-5 w-5 text-pink-400" />
                      Quick Rewards
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-200">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">🎬</div>
                          <span className="text-white font-medium">Movie Night</span>
                        </div>
                        <Badge className="bg-yellow-500 text-yellow-900 font-bold">50 pts</Badge>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-200">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">💰</div>
                          <span className="text-white font-medium">Extra Allowance</span>
                        </div>
                        <Badge className="bg-yellow-500 text-yellow-900 font-bold">100 pts</Badge>
                      </div>
                    </div>
                    <Button
                      onClick={() => setCurrentPage("rewards")}
                      className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white rounded-xl"
                    >
                      Visit Shop
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievement */}
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white text-xl">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
                    <div className="bg-green-500 p-2 rounded-full">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-green-400">Task Starter</div>
                      <div className="text-xs text-green-200">Complete your first task</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl border border-white/20 opacity-60">
                    <div className="bg-gray-500 p-2 rounded-full">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-400">Point Collector</div>
                      <div className="text-xs text-gray-500">Earn 100 points</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <PageLayout>
      <Header
        title={getPageTitle()}
        subtitle={getPageSubtitle()}
        userRole="child"
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        stats={{
          points: totalPoints,
          completedTasks: completedTasks.length,
          totalTasks: tasks.length,
        }}
      />

      <div className="p-6">{renderCurrentPage()}</div>
    </PageLayout>
  )
}

// Child Task Card Component
function ChildTaskCard({
  task,
  onToggle,
}: {
  task: any
  onToggle: (id: string) => void
}) {
  return (
    <Card
      className={`transition-all duration-300 cursor-pointer transform hover:scale-105 ${
        task.completed
          ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30"
          : "bg-white/10 border-white/20 hover:bg-white/20"
      } backdrop-blur-sm shadow-xl`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <Button
              onClick={() => task.id && onToggle(task.id)}
              className={`p-2 rounded-full transition-all duration-200 ${
                task.completed
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-white/20 hover:bg-white/30 text-white border border-white/30"
              }`}
            >
              <CheckCircle className={`h-6 w-6 ${task.completed ? "fill-current" : ""}`} />
            </Button>
            <div className="flex-1">
              <h4 className={`font-bold text-lg ${task.completed ? "text-green-300 line-through" : "text-white"}`}>
                {task.title}
              </h4>
              {task.description && <p className="text-purple-200 mt-2">{task.description}</p>}
              <div className="flex items-center gap-3 mt-4">
                {task.points && (
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold px-3 py-1">
                    <Star className="h-4 w-4 mr-1" />
                    {task.points} pts
                  </Badge>
                )}
                {task.dueDate && (
                  <Badge className="bg-white/20 text-white border border-white/30 px-3 py-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    Due: {format(new Date(task.dueDate), "MMM d")}
                  </Badge>
                )}
                {task.completed && (
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-3 py-1">
                    <Trophy className="h-4 w-4 mr-1" />
                    Completed!
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
