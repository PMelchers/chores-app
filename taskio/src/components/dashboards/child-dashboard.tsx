"use client"

import { useState, useEffect } from "react"
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
  Star,
  Trophy,
  Target,
  Calendar,
  Gift
} from "lucide-react"
import { format } from "date-fns"

export function ChildDashboard({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const { user } = useAuth()
  const { tasks, loading, submitTaskForApproval, error } = useTasks()
  const [rewards, setRewards] = useState<any[]>([])
  const [userCoins, setUserCoins] = useState(0)

  // Load user coins and top rewards
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return
      
      try {
        // Get user coins
        const userData = await databaseService.getUser(user.uid)
        setUserCoins(userData?.coins || 0)
        
        // Get top 3 rewards for preview
        const allRewards = await databaseService.getRewards()
        const topRewards = allRewards.slice(0, 3)
        setRewards(topRewards)
      } catch (error) {
        console.error("Failed to load user data:", error)
      }
    }

    loadUserData()
  }, [user])

  const handleSubmitTask = async (taskId: string) => {
    try {
      await submitTaskForApproval(taskId)
    } catch (error) {
      console.error("Failed to submit task:", error)
    }
  }

  const completedTasks = tasks.filter((task: any) => task.completed)
  const pendingTasks = tasks.filter((task: any) => !task.completed && !task.pendingApproval)
  const awaitingApproval = tasks.filter((task: any) => task.pendingApproval)
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
        @keyframes rainbow-button {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Tasks Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.email}</p>
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
                  <div className="text-2xl font-bold text-yellow-600">{userCoins}</div>
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
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="pending">To Do ({pendingTasks.length})</TabsTrigger>
                    <TabsTrigger value="awaiting">Awaiting ({awaitingApproval.length})</TabsTrigger>
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
                          onSubmit={handleSubmitTask}
                        />
                      ))
                    )}
                  </TabsContent>
                  
                  <TabsContent value="awaiting" className="space-y-3 mt-4">
                    {awaitingApproval.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Clock className="h-12 w-12 mx-auto mb-3 text-yellow-400" />
                        <p>No tasks waiting for approval 👍</p>
                      </div>
                    ) : (
                      awaitingApproval.map((task: any) => (
                        <ChildTaskCard 
                          key={task.id} 
                          task={task} 
                          onSubmit={handleSubmitTask}
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
                          onSubmit={handleSubmitTask}
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
                          onSubmit={handleSubmitTask}
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
            {/* Rewards Shop Preview */}
            <Card className="bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 border-2 border-purple-300 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={() => onNavigate && onNavigate('rewards')}
            >
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-center justify-center">
                  <Gift className="h-6 w-6 animate-bounce" />
                  🏪 EPIC REWARD SHOP 🏪
                  <Gift className="h-6 w-6 animate-bounce" />
                </CardTitle>
                <div className="text-center text-sm font-bold">
                  🪙 {userCoins} Coins Available 🪙
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Featured Rewards - Real rewards from database */}
                  {rewards.length === 0 ? (
                    <div className="text-center py-4 text-purple-600">
                      <Gift className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm font-bold">Loading awesome rewards...</p>
                    </div>
                  ) : (
                    rewards.map((reward) => (
                      <Card key={reward.id} className="bg-white border-2 border-yellow-300 hover:shadow-md transition-all duration-200 hover:scale-105">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{reward.icon || '🎁'}</span>
                            <div className="flex-1">
                              <div className="font-bold text-gray-900 text-sm">{reward.name}</div>
                              <div className="text-xs text-gray-600">{reward.description || 'An awesome reward!'}</div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <Badge className="bg-green-100 text-green-800 font-bold">
                              🪙 {reward.cost}
                            </Badge>
                            <Badge className="bg-blue-100 text-blue-800">{reward.category || 'special'}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                  
                  {/* Click to Shop Button */}
                  <Button 
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 text-sm shadow-lg transform hover:scale-105 transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation()
                      onNavigate && onNavigate('rewards')
                    }}
                  >
                    <Gift className="h-4 w-4 mr-2" />
                    🛒 VISIT FULL SHOP - MORE EPIC REWARDS! 🛒
                  </Button>
                  
                  <div className="text-center text-xs text-purple-600 font-bold animate-bounce">
                    ✨ Click anywhere to explore the full shop! ✨
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
  onSubmit 
}: { 
  task: any
  onSubmit: (id: string) => void
}) {
  const getTaskStatus = () => {
    if (task.completed) return 'completed'
    if (task.pendingApproval) return 'pending'
    return 'todo'
  }

  const status = getTaskStatus()

  return (
    <Card className={`transition-all ${
      status === 'completed' ? 'bg-green-50 border-green-200' : 
      status === 'pending' ? 'bg-yellow-50 border-yellow-200' : 
      'bg-white hover:shadow-md'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="mt-1">
              {status === 'completed' && (
                <CheckCircle className="h-6 w-6 text-green-600 fill-current" />
              )}
              {status === 'pending' && (
                <Clock className="h-6 w-6 text-yellow-600 animate-pulse" />
              )}
              {status === 'todo' && (
                <CheckCircle className="h-6 w-6 text-gray-300" />
              )}
            </div>
            <div className="flex-1">
              <h4 className={`font-medium ${
                status === 'completed' ? 'text-green-800 line-through' : 
                status === 'pending' ? 'text-yellow-800' :
                'text-gray-900'
              }`}>
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
                {status === 'completed' && (
                  <Badge className="bg-green-600 text-white">
                    <Trophy className="h-3 w-3 mr-1" />
                    Approved!
                  </Badge>
                )}
                {status === 'pending' && (
                  <Badge className="bg-yellow-500 text-white">
                    <Clock className="h-3 w-3 mr-1" />
                    Waiting for approval
                  </Badge>
                )}
              </div>
              
              {/* Action button for todo tasks */}
              {status === 'todo' && (
                <Button
                  onClick={() => task.id && onSubmit(task.id)}
                  className="mt-3 w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-300"
                  size="sm"
                >
                  🎯 I'm Done! (Ask Parent to Check) 
                </Button>
              )}
              
              {status === 'pending' && (
                <div className="mt-3 text-center bg-gradient-to-r from-yellow-100 to-orange-100 p-3 rounded-lg border-2 border-yellow-400">
                  <p className="text-sm text-yellow-800 font-bold animate-pulse">
                    ⏰ Waiting for parent approval...
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    🚫 You cannot change this until parent approves!
                  </p>
                </div>
              )}
              
              {status === 'completed' && (
                <div className="mt-3 text-center bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-lg border-2 border-green-400">
                  <p className="text-sm text-green-800 font-bold">
                    🎉 APPROVED! You earned {task.points || 0} coins! 🪙
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    ✅ This task is permanently completed!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
