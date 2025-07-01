"use client"

import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Progress } from "../ui/progress"
import { useAuth } from "../providers/auth-provider"
import { useTasks } from "../../hooks/useTasks"
import { LoadingSpinner } from "../ui/loading-spinner"
import { databaseService } from "../../firebase/database"
import { 
  CheckCircle,
  Clock,
  LogOut,
  Star,
  Trophy,
  Target,
  Calendar,
  Gift
} from "lucide-react"
import { format } from "date-fns"

export function ChildDashboard() {
  const { user, signOut } = useAuth()
  const { tasks, loading, toggleTaskCompletion, error } = useTasks()

  console.log('ChildDashboard: Rendering with', { 
    user: user?.uid, 
    tasksCount: tasks.length, 
    loading, 
    error,
    tasks: tasks 
  });

  const handleToggleTask = async (taskId: string) => {
    try {
      await toggleTaskCompletion(taskId)
    } catch (error) {
      console.error("Failed to toggle task:", error)
    }
  }

  const handleDebugAllTasks = async () => {
    try {
      console.log('Debug: Fetching all tasks from database...');
      const allTasks = await databaseService.getAllTasks();
      console.log('Debug: All tasks in database:', allTasks);
      console.log('Debug: Current user ID:', user?.uid);
      console.log('Debug: Current user email:', user?.email);
      
      // Check each task in detail
      allTasks.forEach((task, index) => {
        console.log(`Debug: Task ${index + 1}:`, {
          id: task.id,
          title: task.title,
          assignedTo: task.assignedTo,
          createdBy: task.createdBy,
          assignedToType: typeof task.assignedTo,
          isAssignedToCurrentUser: task.assignedTo === user?.uid,
          isAssignedToCurrentEmail: task.assignedTo === user?.email
        });
      });
      
      console.log('Debug: Tasks assigned to current user (by UID):', allTasks.filter(task => task.assignedTo === user?.uid));
      console.log('Debug: Tasks assigned to current user (by email):', allTasks.filter(task => task.assignedTo === user?.email));
      
      // Fix tasks that are assigned by email instead of user ID
      const tasksAssignedByEmail = allTasks.filter(task => task.assignedTo === user?.email);
      if (tasksAssignedByEmail.length > 0) {
        console.log('Debug: Found tasks assigned by email, updating to user ID...');
        for (const task of tasksAssignedByEmail) {
          if (task.id) {
            try {
              await databaseService.updateTask(task.id, { assignedTo: user?.uid });
              console.log(`Debug: Updated task ${task.id} assignedTo from email to user ID`);
            } catch (error) {
              console.error(`Debug: Failed to update task ${task.id}:`, error);
            }
          }
        }
        alert('Fixed task assignments! The tasks should now appear in your dashboard.');
      }
      
      // Create a test task if none exist
      if (allTasks.length === 0) {
        console.log('Debug: No tasks found. Creating a test task...');
        const testTask = await databaseService.addTask({
          title: 'Test Task for Child',
          description: 'This is a test task to debug the issue',
          completed: false,
          assignedTo: user?.uid || 'unknown', 
          createdBy: 'debug-parent',
          points: 15,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
        console.log('Debug: Created test task:', testTask);
      }
    } catch (error) {
      console.error('Debug: Error fetching all tasks:', error);
    }
  }

  const completedTasks = tasks.filter((task: any) => task.completed)
  const pendingTasks = tasks.filter((task: any) => !task.completed)
  const totalPoints = completedTasks.reduce((sum: number, task: any) => sum + (task.points || 0), 0)
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Tasks Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleDebugAllTasks}
              className="flex items-center gap-2 border border-blue-300 hover:bg-blue-50 px-4 py-2 rounded-md transition-colors text-blue-600"
            >
              Debug Tasks
            </Button>
            <Button
              onClick={signOut}
              className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Points</CardTitle>
              <Star className="h-4 w-4 text-yellow-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPoints}</div>
              <p className="text-xs text-blue-100">Keep earning more!</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks.length}</div>
              <p className="text-xs text-green-100">Tasks finished</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Pending</CardTitle>
              <Clock className="h-4 w-4 text-orange-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasks.length}</div>
              <p className="text-xs text-orange-100">Tasks to do</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Progress</CardTitle>
              <Trophy className="h-4 w-4 text-purple-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionRate}%</div>
              <p className="text-xs text-purple-100">Completion rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Your Progress
            </CardTitle>
            <CardDescription>Keep up the great work!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Overall Completion</span>
                  <span className="font-medium">{completionRate}%</span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{totalPoints}</div>
                  <div className="text-sm text-yellow-700">Points Earned</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
                  <div className="text-sm text-green-700">Tasks Completed</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
                  <div className="text-sm text-blue-700">Total Tasks</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>My Tasks</CardTitle>
                <CardDescription>Complete tasks to earn points and rewards!</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pending" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pending">To Do ({pendingTasks.length})</TabsTrigger>
                    <TabsTrigger value="completed">Done ({completedTasks.length})</TabsTrigger>
                    <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="pending" className="space-y-3 mt-4">
                    {pendingTasks.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <CheckCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No pending tasks. Great job! 🎉</p>
                      </div>
                    ) : (
                      pendingTasks.map((task: any) => (
                        <ChildTaskCard 
                          key={task.id} 
                          task={task} 
                          onToggle={handleToggleTask}
                        />
                      ))
                    )}
                  </TabsContent>
                  
                  <TabsContent value="completed" className="space-y-3 mt-4">
                    {completedTasks.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Trophy className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No completed tasks yet. Start completing tasks to earn points!</p>
                      </div>
                    ) : (
                      completedTasks.map((task: any) => (
                        <ChildTaskCard 
                          key={task.id} 
                          task={task} 
                          onToggle={handleToggleTask}
                        />
                      ))
                    )}
                  </TabsContent>
                  
                  <TabsContent value="all" className="space-y-3 mt-4">
                    {tasks.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Target className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No tasks assigned yet. Check back later!</p>
                      </div>
                    ) : (
                      tasks.map((task: any) => (
                        <ChildTaskCard 
                          key={task.id} 
                          task={task} 
                          onToggle={handleToggleTask}
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
            {/* Points & Rewards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg">
                    <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-yellow-800">{totalPoints} Points</div>
                    <div className="text-sm text-yellow-700">Available to spend</div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Upcoming Rewards</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>Movie Night</span>
                        <Badge className="border border-gray-300 text-gray-600">50 pts</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>Extra Allowance</span>
                        <Badge className="border border-gray-300 text-gray-600">100 pts</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>Choose Dinner</span>
                        <Badge className="border border-gray-300 text-gray-600">25 pts</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <div className="font-medium text-green-800">Task Starter</div>
                      <div className="text-xs text-green-600">Complete your first task</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg opacity-50">
                    <Star className="h-6 w-6 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-600">Point Collector</div>
                      <div className="text-xs text-gray-500">Earn 100 points</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg opacity-50">
                    <Trophy className="h-6 w-6 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-600">Champion</div>
                      <div className="text-xs text-gray-500">Complete 10 tasks</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Child Task Card Component
function ChildTaskCard({ 
  task, 
  onToggle 
}: { 
  task: any
  onToggle: (id: string) => void
}) {
  return (
    <Card className={`transition-all cursor-pointer ${task.completed ? 'bg-green-50 border-green-200' : 'bg-white hover:shadow-md'}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Button
              onClick={() => task.id && onToggle(task.id)}
              className={`p-1 bg-transparent border-none hover:bg-gray-100 text-sm ${task.completed ? 'text-green-600' : 'text-gray-400 hover:text-green-600'}`}
            >
              <CheckCircle className={`h-6 w-6 ${task.completed ? 'fill-current' : ''}`} />
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
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Star className="h-3 w-3 mr-1" />
                    {task.points} pts
                  </Badge>
                )}
                {task.dueDate && (
                  <Badge className="border border-gray-300 text-gray-600 text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    Due: {format(new Date(task.dueDate), 'MMM d')}
                  </Badge>
                )}
                {task.completed && (
                  <Badge className="bg-green-600 text-white">
                    <Trophy className="h-3 w-3 mr-1" />
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
