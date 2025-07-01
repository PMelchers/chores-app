"use client"
import type React from "react"
import { useState } from "react"
import { useAuth } from "../providers/auth-provider"
import { useTasks } from "../../hooks/useTasks"
import { LoadingSpinner } from "../ui/loading-spinner"
import { PageLayout } from "../layout/page-layout"
import { Header } from "../layout/header"
import { TaskCreator } from "../tasks/task-creator"
import { QuestManager } from "../quests/quest-manager"
import { RewardManager } from "../rewards/reward-manager"
import { HistoryLog } from "../history/history-log"
import { FamilyAdmin } from "../family/family-admin"
import {
  Plus,
  Users,
  Trophy,
  CheckCircle,
  Clock,
  Trash2,
  Star,
  Target,
  Sparkles,
  Zap,
  TrendingUp,
  Award,
  Settings,
} from "lucide-react"
import { format } from "date-fns"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Badge } from "../ui/badge"
import { Textarea } from "../ui/textarea"

export function ParentDashboard() {
  const { user, userRole } = useAuth()
  const { tasks, loading, addTask, deleteTask, toggleTaskCompletion, error } = useTasks()
  const [currentPage, setCurrentPage] = useState("dashboard")

  const [showAddTask, setShowAddTask] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    points: 10,
    dueDate: "",
  })

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.title.trim()) return

    try {
      await addTask({
        title: newTask.title,
        description: newTask.description || undefined,
        assignedTo: newTask.assignedTo || undefined,
        points: newTask.points,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
      })

      setNewTask({ title: "", description: "", assignedTo: "", points: 10, dueDate: "" })
      setShowAddTask(false)
    } catch (error) {
      console.error("Failed to add task:", error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId)
      } catch (error) {
        console.error("Failed to delete task:", error)
      }
    }
  }

  const handleToggleTask = async (taskId: string) => {
    try {
      await toggleTaskCompletion(taskId)
    } catch (error) {
      console.error("Failed to toggle task:", error)
    }
  }

  const completedTasks = tasks.filter((task) => task.completed)
  const pendingTasks = tasks.filter((task) => !task.completed)
  const totalPoints = completedTasks.reduce((sum, task) => sum + (task.points || 0), 0)

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "tasks":
        return <TaskCreator />
      case "quests":
        return <QuestManager />
      case "rewards":
        return <RewardManager />
      case "history":
        return <HistoryLog />
      case "family":
        return <FamilyAdmin />
      default:
        return renderDashboard()
    }
  }

  const getPageTitle = () => {
    switch (currentPage) {
      case "tasks":
        return "Task Management"
      case "quests":
        return "Quest Creator"
      case "rewards":
        return "Reward Manager"
      case "history":
        return "Family Activity"
      case "family":
        return "Family Settings"
      default:
        return "Parent Command Center"
    }
  }

  const getPageSubtitle = () => {
    switch (currentPage) {
      case "tasks":
        return "Create and manage tasks for your family"
      case "quests":
        return "Design special challenges and adventures"
      case "rewards":
        return "Set up rewards and manage the family shop"
      case "history":
        return "Monitor progress and celebrate achievements"
      case "family":
        return "Manage family members and settings"
      default:
        return "Manage your family's epic adventures! 👑"
    }
  }

  const renderDashboard = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-white mt-4 text-lg">Loading your command center...</p>
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
          <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Tasks</CardTitle>
              <div className="relative">
                <Target className="h-8 w-8 text-blue-200" />
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-white animate-pulse" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{tasks.length}</div>
              <p className="text-xs text-blue-100 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                Family tasks
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
              <div className="text-3xl font-bold text-green-100">{completedTasks.length}</div>
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
              <div className="text-3xl font-bold text-orange-100">{pendingTasks.length}</div>
              <p className="text-xs text-orange-100 flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3" />
                Need attention
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white border-0 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-100">Points Earned</CardTitle>
              <div className="relative">
                <Star className="h-8 w-8 text-yellow-200" />
                <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-100">{totalPoints}</div>
              <p className="text-xs text-yellow-100 flex items-center gap-1 mt-1">
                <Trophy className="h-3 w-3" />
                Family total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task Management */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                      <Settings className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-2xl">Quick Task Management</CardTitle>
                      <CardDescription className="text-purple-200 text-lg">
                        Create and manage family tasks
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowAddTask(!showAddTask)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Task Form */}
                {showAddTask && (
                  <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
                    <CardHeader>
                      <CardTitle className="text-lg text-white flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-yellow-400" />
                        Create New Task
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAddTask} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="title" className="text-white font-medium">
                              Task Title
                            </Label>
                            <Input
                              id="title"
                              value={newTask.title}
                              onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
                              placeholder="e.g., Clean bedroom"
                              required
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-purple-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="points" className="text-white font-medium">
                              Points
                            </Label>
                            <Input
                              id="points"
                              type="number"
                              value={newTask.points}
                              onChange={(e) =>
                                setNewTask((prev) => ({ ...prev, points: Number.parseInt(e.target.value) || 10 }))
                              }
                              min="1"
                              max="100"
                              className="bg-white/10 border-white/20 text-white focus:border-purple-400"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description" className="text-white font-medium">
                            Description (optional)
                          </Label>
                          <Textarea
                            id="description"
                            value={newTask.description}
                            onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
                            placeholder="Additional details about the task..."
                            rows={2}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-purple-400"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="assignedTo" className="text-white font-medium">
                              Assign to (optional)
                            </Label>
                            <Input
                              id="assignedTo"
                              value={newTask.assignedTo}
                              onChange={(e) => setNewTask((prev) => ({ ...prev, assignedTo: e.target.value }))}
                              placeholder="Family member email"
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-purple-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="dueDate" className="text-white font-medium">
                              Due Date (optional)
                            </Label>
                            <Input
                              id="dueDate"
                              type="date"
                              value={newTask.dueDate}
                              onChange={(e) => setNewTask((prev) => ({ ...prev, dueDate: e.target.value }))}
                              className="bg-white/10 border-white/20 text-white focus:border-purple-400"
                            />
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            type="submit"
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Task
                          </Button>
                          <Button
                            type="button"
                            onClick={() => setShowAddTask(false)}
                            className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-xl border border-white/20"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                {/* Tasks List */}
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-1">
                    <TabsTrigger
                      value="all"
                      className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-lg"
                    >
                      All Tasks ({tasks.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="pending"
                      className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-lg"
                    >
                      Pending ({pendingTasks.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="completed"
                      className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-lg"
                    >
                      Completed ({completedTasks.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-4 mt-6">
                    {tasks.slice(0, 5).map((task) => (
                      <TaskCard key={task.id} task={task} onToggle={handleToggleTask} onDelete={handleDeleteTask} />
                    ))}
                    {tasks.length > 5 && (
                      <Button
                        onClick={() => setCurrentPage("tasks")}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl"
                      >
                        View All Tasks ({tasks.length})
                      </Button>
                    )}
                  </TabsContent>

                  <TabsContent value="pending" className="space-y-4 mt-6">
                    {pendingTasks.slice(0, 5).map((task) => (
                      <TaskCard key={task.id} task={task} onToggle={handleToggleTask} onDelete={handleDeleteTask} />
                    ))}
                    {pendingTasks.length > 5 && (
                      <Button
                        onClick={() => setCurrentPage("tasks")}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl"
                      >
                        View All Pending ({pendingTasks.length})
                      </Button>
                    )}
                  </TabsContent>

                  <TabsContent value="completed" className="space-y-4 mt-6">
                    {completedTasks.slice(0, 5).map((task) => (
                      <TaskCard key={task.id} task={task} onToggle={handleToggleTask} onDelete={handleDeleteTask} />
                    ))}
                    {completedTasks.length > 5 && (
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
            {/* Family Overview */}
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white text-xl">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  Family Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/20">
                    <span className="text-purple-200">Total Family Points</span>
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold px-3 py-1">
                      {totalPoints} pts
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/20">
                    <span className="text-purple-200">Tasks This Week</span>
                    <span className="font-bold text-white text-lg">{tasks.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/20">
                    <span className="text-purple-200">Completion Rate</span>
                    <span className="font-bold text-white text-lg">
                      {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => setCurrentPage("tasks")}
                  className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl p-4 h-auto"
                >
                  <Plus className="h-5 w-5 mr-3 text-green-400" />
                  <div className="text-left">
                    <div className="font-medium">Manage Tasks</div>
                    <div className="text-sm text-purple-200">Create and organize family tasks</div>
                  </div>
                </Button>
                <Button
                  onClick={() => setCurrentPage("quests")}
                  className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl p-4 h-auto"
                >
                  <Zap className="h-5 w-5 mr-3 text-purple-400" />
                  <div className="text-left">
                    <div className="font-medium">Create Quests</div>
                    <div className="text-sm text-purple-200">Design epic challenges</div>
                  </div>
                </Button>
                <Button
                  onClick={() => setCurrentPage("rewards")}
                  className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl p-4 h-auto"
                >
                  <Trophy className="h-5 w-5 mr-3 text-yellow-400" />
                  <div className="text-left">
                    <div className="font-medium">Reward Center</div>
                    <div className="text-sm text-purple-200">Manage family rewards</div>
                  </div>
                </Button>
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
        userRole="parent"
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

// Task Card Component
function TaskCard({
  task,
  onToggle,
  onDelete,
}: {
  task: any
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <Card
      className={`transition-all duration-300 transform hover:scale-105 ${
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
              <CheckCircle className={`h-5 w-5 ${task.completed ? "fill-current" : ""}`} />
            </Button>
            <div className="flex-1">
              <h4 className={`font-bold text-lg ${task.completed ? "text-green-300 line-through" : "text-white"}`}>
                {task.title}
              </h4>
              {task.description && <p className="text-purple-200 mt-2">{task.description}</p>}
              <div className="flex items-center gap-3 mt-4">
                {task.points && (
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold px-3 py-1">
                    {task.points} pts
                  </Badge>
                )}
                {task.assignedTo && (
                  <Badge className="bg-white/20 text-white border border-white/30 px-3 py-1">
                    Assigned to: {task.assignedTo}
                  </Badge>
                )}
                {task.dueDate && (
                  <Badge className="bg-white/20 text-white border border-white/30 px-3 py-1">
                    Due: {format(new Date(task.dueDate), "MMM d")}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => task.id && onDelete(task.id)}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 p-2 rounded-full border border-red-400/30"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
