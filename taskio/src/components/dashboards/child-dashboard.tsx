"use client"

import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"
import { useAuth } from "../providers/auth-provider"
import { useTasks } from "../../hooks/useTasks"
import { LoadingSpinner } from "../ui/loading-spinner"
import { 
  CheckCircle,
  Clock,
  Star,
  Trophy,
  Target,
  Calendar,
} from "lucide-react"
import { format } from "date-fns"

export function ChildDashboard() {
  const { user } = useAuth()
  const { tasks, loading, toggleTaskCompletion } = useTasks()

  const handleToggleTask = async (taskId: string) => {
    try {
      await toggleTaskCompletion(taskId)
    } catch (error) {
      console.error("Failed to toggle task:", error)
    }
  }

  const myTasks = tasks.filter(task => task.assignedTo === user?.uid || task.assignedTo === user?.email)
  const completedTasks = myTasks.filter(task => task.completed)
  const pendingTasks = myTasks.filter(task => !task.completed)
  const totalPoints = completedTasks.reduce((sum, task) => sum + (task.points || 0), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-gray-600 mt-4 text-lg">Loading your tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-100">Total Points</CardTitle>
              <Star className="h-4 w-4 text-yellow-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPoints}</div>
              <p className="text-xs text-yellow-200">Points earned</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks.length}</div>
              <p className="text-xs text-green-200">Tasks finished</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Pending</CardTitle>
              <Clock className="h-4 w-4 text-blue-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasks.length}</div>
              <p className="text-xs text-blue-200">Tasks to do</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Progress</CardTitle>
              <Trophy className="h-4 w-4 text-purple-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {myTasks.length > 0 ? Math.round((completedTasks.length / myTasks.length) * 100) : 0}%
              </div>
              <p className="text-xs text-purple-200">Completion rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Your Progress
            </CardTitle>
            <CardDescription>Keep going! You're doing great!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Tasks Completed</span>
                <span className="font-medium">{completedTasks.length} / {myTasks.length}</span>
              </div>
              <Progress 
                value={myTasks.length > 0 ? (completedTasks.length / myTasks.length) * 100 : 0} 
                className="h-3"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Pending Tasks ({pendingTasks.length})
              </CardTitle>
              <CardDescription>Tasks waiting for you to complete</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>All caught up! No pending tasks.</p>
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
                            className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <div className="flex-1">
                            <h4 className="font-semibold">{task.title}</h4>
                            {task.description && <p className="text-gray-600 text-sm mt-1">{task.description}</p>}
                            <div className="flex items-center gap-2 mt-2">
                              {task.points && (
                                <Badge className="bg-yellow-500 text-white">
                                  <Star className="h-3 w-3 mr-1" />
                                  {task.points} pts
                                </Badge>
                              )}
                              {task.dueDate && (
                                <Badge variant="outline">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Due {format(task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate), 'MMM dd')}
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
            </CardContent>
          </Card>

          {/* Completed Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Completed Tasks ({completedTasks.length})
              </CardTitle>
              <CardDescription>Great job on these tasks!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {completedTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No completed tasks yet. Start completing some!</p>
                </div>
              ) : (
                completedTasks.map((task) => (
                  <Card key={task.id} className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="p-2 bg-green-500 rounded-full">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-green-800 line-through">{task.title}</h4>
                            {task.description && <p className="text-green-600 text-sm mt-1">{task.description}</p>}
                            <div className="flex items-center gap-2 mt-2">
                              {task.points && (
                                <Badge className="bg-green-600 text-white">
                                  <Star className="h-3 w-3 mr-1" />
                                  {task.points} pts earned
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
            </CardContent>
          </Card>
        </div>

        {/* Motivational Footer */}
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
          <CardContent className="text-center p-8">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-2xl font-bold mb-2">You're Amazing! 🌟</h3>
            <p className="text-purple-100">
              {completedTasks.length > 0 
                ? `You've completed ${completedTasks.length} tasks and earned ${totalPoints} points!`
                : "Ready to start your task adventure? Let's go!"
              }
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
