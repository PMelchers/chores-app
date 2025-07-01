"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Badge } from "../ui/badge"
import { Textarea } from "../ui/textarea"
import { useAuth } from "../providers/auth-provider"
import { useTasks } from "../../hooks/useTasks"
import { LoadingSpinner } from "../ui/loading-spinner"
import { databaseService } from "../../firebase/database"
import { 
  Plus, 
  Calendar,
  Users,
  Trophy,
  CheckCircle,
  Clock,
  Trash2,
  Edit2,
  LogOut,
  Star,
  Target
} from "lucide-react"
import { format } from "date-fns"

export function ParentDashboard() {
  const { user, userRole, signOut } = useAuth()
  const { tasks, loading, addTask, updateTask, deleteTask, toggleTaskCompletion, error } = useTasks()

  console.log('ParentDashboard: Rendering with', { 
    user: user?.uid, 
    userRole,
    tasksCount: tasks.length, 
    loading, 
    error,
    tasks: tasks 
  });

  const [showAddTask, setShowAddTask] = useState(false)
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    points: 10,
    dueDate: ""
  })

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.title.trim()) return

    try {
      let assignedToUserId = undefined;
      
      // If assignedTo is provided, try to find the user by email and convert to user ID
      if (newTask.assignedTo && newTask.assignedTo.trim()) {
        console.log('Looking up user by email:', newTask.assignedTo);
        const user = await databaseService.getUserByEmail(newTask.assignedTo.trim());
        if (user) {
          assignedToUserId = user.id;
          console.log('Found user ID:', assignedToUserId);
        } else {
          console.warn('User not found with email:', newTask.assignedTo);
          alert(`User with email "${newTask.assignedTo}" not found. Please make sure they have registered.`);
          return;
        }
      }

      await addTask({
        title: newTask.title,
        description: newTask.description || undefined,
        assignedTo: assignedToUserId,
        points: newTask.points,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined
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

  const completedTasks = tasks.filter(task => task.completed)
  const pendingTasks = tasks.filter(task => !task.completed)
  const totalPoints = completedTasks.reduce((sum, task) => sum + (task.points || 0), 0)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
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
          <Button onClick={signOut} className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md transition-colors">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{pendingTasks.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points Earned</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{totalPoints}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task Management */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Task Management</CardTitle>
                    <CardDescription>Create and manage family tasks</CardDescription>
                  </div>
                  <Button onClick={() => setShowAddTask(!showAddTask)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Task
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
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
                              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="e.g., Clean bedroom"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="points">Points</Label>
                            <Input
                              id="points"
                              type="number"
                              value={newTask.points}
                              onChange={(e) => setNewTask(prev => ({ ...prev, points: parseInt(e.target.value) || 10 }))}
                              min="1"
                              max="100"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description (optional)</Label>
                          <Textarea
                            id="description"
                            value={newTask.description}
                            onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Additional details about the task..."
                            rows={2}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="assignedTo">Assign to (optional)</Label>
                            <Input
                              id="assignedTo"
                              value={newTask.assignedTo}
                              onChange={(e) => setNewTask(prev => ({ ...prev, assignedTo: e.target.value }))}
                              placeholder="Family member email"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="dueDate">Due Date (optional)</Label>
                            <Input
                              id="dueDate"
                              type="date"
                              value={newTask.dueDate}
                              onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
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
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All Tasks ({tasks.length})</TabsTrigger>
                    <TabsTrigger value="pending">Pending ({pendingTasks.length})</TabsTrigger>
                    <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="space-y-3">
                    {tasks.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Target className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No tasks created yet. Add your first task to get started!</p>
                      </div>
                    ) : (
                      tasks.map((task) => (
                        <TaskCard 
                          key={task.id} 
                          task={task} 
                          onToggle={handleToggleTask}
                          onDelete={handleDeleteTask}
                        />
                      ))
                    )}
                  </TabsContent>
                  
                  <TabsContent value="pending" className="space-y-3">
                    {pendingTasks.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <CheckCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No pending tasks. Great job!</p>
                      </div>
                    ) : (
                      pendingTasks.map((task) => (
                        <TaskCard 
                          key={task.id} 
                          task={task} 
                          onToggle={handleToggleTask}
                          onDelete={handleDeleteTask}
                        />
                      ))
                    )}
                  </TabsContent>
                  
                  <TabsContent value="completed" className="space-y-3">
                    {completedTasks.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Trophy className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No completed tasks yet.</p>
                      </div>
                    ) : (
                      completedTasks.map((task) => (
                        <TaskCard 
                          key={task.id} 
                          task={task} 
                          onToggle={handleToggleTask}
                          onDelete={handleDeleteTask}
                        />
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Family Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Family Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Family Points</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      {totalPoints} pts
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tasks This Week</span>
                    <span className="font-semibold">{tasks.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Completion Rate</span>
                    <span className="font-semibold">
                      {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => setShowAddTask(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Quick Task
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Calendar
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Trophy className="h-4 w-4 mr-2" />
                  Reward Center
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Task Card Component
function TaskCard({ 
  task, 
  onToggle, 
  onDelete 
}: { 
  task: any
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <Card className={`transition-all ${task.completed ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => task.id && onToggle(task.id)}
              className={`p-1 ${task.completed ? 'text-green-600' : 'text-gray-400'}`}
            >
              <CheckCircle className={`h-5 w-5 ${task.completed ? 'fill-current' : ''}`} />
            </Button>
            <div className="flex-1">
              <h4 className={`font-medium ${task.completed ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                {task.title}
              </h4>
              {task.description && (
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
              )}
              <div className="flex items-center gap-3 mt-2">
                {task.points && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {task.points} pts
                  </Badge>
                )}
                {task.assignedTo && (
                  <Badge variant="outline">
                    Assigned to: {task.assignedTo}
                  </Badge>
                )}
                {task.dueDate && (
                  <Badge variant="outline" className="text-xs">
                    Due: {format(new Date(task.dueDate), 'MMM d')}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => task.id && onDelete(task.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
