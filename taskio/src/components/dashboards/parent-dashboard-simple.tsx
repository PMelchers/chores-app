"use client"

import { useState } from "react"
import { useAuth } from "../providers/auth-provider"
import { useTasks } from "../../hooks/useTasks"
import { LoadingSpinner } from "../ui/loading-spinner"
import {
  Plus,
  Users,
  Trophy,
  CheckCircle,
  Clock,
  Star,
  Target,
} from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Badge } from "../ui/badge"
import { Textarea } from "../ui/textarea"

export function ParentDashboard() {
  const { user } = useAuth()
  const { tasks, loading, addTask, toggleTaskCompletion } = useTasks()

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
        description: newTask.description,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-gray-600 mt-4 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2">
              <Trophy className="h-4 w-4 mr-2" />
              {totalPoints} Points Earned
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.length}</div>
              <p className="text-xs text-muted-foreground">
                {pendingTasks.length} pending, {completedTasks.length} completed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points Earned</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPoints}</div>
              <p className="text-xs text-muted-foreground">From completed tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Family Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Active members</p>
            </CardContent>
          </Card>
        </div>

        {/* Task Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Task Management</CardTitle>
                <CardDescription>Create and manage family tasks</CardDescription>
              </div>
              <Button
                onClick={() => setShowAddTask(!showAddTask)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add Task Form */}
            {showAddTask && (
              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg">Create New Task</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddTask} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Task Title</Label>
                        <Input
                          id="title"
                          value={newTask.title}
                          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                          placeholder="e.g., Clean your room"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assignedTo">Assign To (Email)</Label>
                        <Input
                          id="assignedTo"
                          value={newTask.assignedTo}
                          onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                          placeholder="child@example.com"
                          type="email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="points">Points</Label>
                        <Input
                          id="points"
                          type="number"
                          value={newTask.points}
                          onChange={(e) => setNewTask({ ...newTask, points: parseInt(e.target.value) || 0 })}
                          min="1"
                          max="100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={newTask.dueDate}
                          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        placeholder="Describe what needs to be done..."
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="bg-green-600 hover:bg-green-700">
                        Create Task
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowAddTask(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Tasks List */}
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pending" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Pending ({pendingTasks.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Completed ({completedTasks.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="pending" className="space-y-4">
                {pendingTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No pending tasks. Create one to get started!</p>
                  </div>
                ) : (
                  pendingTasks.map((task) => (
                    <Card key={task.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <Button
                              onClick={() => task.id && handleToggleTask(task.id)}
                              size="sm"
                              variant="outline"
                              className="mt-1"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <div className="flex-1">
                              <h4 className="font-semibold">{task.title}</h4>
                              {task.description && <p className="text-gray-600 text-sm mt-1">{task.description}</p>}
                              <div className="flex items-center gap-2 mt-2">
                                {task.points && (
                                  <Badge variant="secondary">
                                    {task.points} pts
                                  </Badge>
                                )}
                                {task.assignedTo && (
                                  <Badge variant="outline">
                                    {task.assignedTo}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
              <TabsContent value="completed" className="space-y-4">
                {completedTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No completed tasks yet.</p>
                  </div>
                ) : (
                  completedTasks.map((task) => (
                    <Card key={task.id} className="bg-green-50 border-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-green-800 line-through">{task.title}</h4>
                              {task.description && <p className="text-green-600 text-sm mt-1">{task.description}</p>}
                              <div className="flex items-center gap-2 mt-2">
                                {task.points && (
                                  <Badge className="bg-green-600">
                                    {task.points} pts earned
                                  </Badge>
                                )}
                                {task.assignedTo && (
                                  <Badge variant="outline" className="border-green-300">
                                    {task.assignedTo}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
