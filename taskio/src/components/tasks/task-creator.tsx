"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Switch } from "../ui/switch"
import { Badge } from "../ui/badge"
import { PageLayout } from "../layout/page-layout"
import { Plus, Trash2, Edit, Sparkles, Settings, Target } from "lucide-react"

type Task = {
  id: string
  title: string
  description: string
  coinValue: number
  xpValue: number
  recurrence: "daily" | "weekly" | "monthly"
  category: string
  requiresApproval: boolean
  streakEligible: boolean
}

export function TaskCreator() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Make Bed",
      description: "Make your bed neatly every morning",
      coinValue: 5,
      xpValue: 10,
      recurrence: "daily",
      category: "bedroom",
      requiresApproval: false,
      streakEligible: true,
    },
    {
      id: "2",
      title: "Clean Room",
      description: "Tidy up bedroom and put toys away",
      coinValue: 15,
      xpValue: 25,
      recurrence: "weekly",
      category: "bedroom",
      requiresApproval: true,
      streakEligible: false,
    },
  ])

  const [isCreating, setIsCreating] = useState(false)
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    coinValue: 5,
    xpValue: 10,
    recurrence: "daily",
    category: "general",
    requiresApproval: false,
    streakEligible: true,
  })

  const handleCreateTask = () => {
    if (newTask.title && newTask.description) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        coinValue: newTask.coinValue || 5,
        xpValue: newTask.xpValue || 10,
        recurrence: newTask.recurrence || "daily",
        category: newTask.category || "general",
        requiresApproval: newTask.requiresApproval || false,
        streakEligible: newTask.streakEligible || true,
      }
      setTasks([...tasks, task])
      setNewTask({
        title: "",
        description: "",
        coinValue: 5,
        xpValue: 10,
        recurrence: "daily",
        category: "general",
        requiresApproval: false,
        streakEligible: true,
      })
      setIsCreating(false)
    }
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const getCategoryEmoji = (category: string) => {
    const emojis: { [key: string]: string } = {
      bedroom: "🛏️",
      kitchen: "🍽️",
      bathroom: "🚿",
      homework: "📚",
      general: "✨",
    }
    return emojis[category] || "✨"
  }

  return (
    <PageLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Actions */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Task Management</h2>
                <p className="text-purple-200">Create and manage daily chores and recurring tasks</p>
              </div>
            </div>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </div>

          {/* Create Task Form */}
          {isCreating && (
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-400" />
                  Create New Task
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white font-medium">
                      Task Title
                    </Label>
                    <Input
                      id="title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="e.g., Make Bed"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-purple-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-white font-medium">
                      Category
                    </Label>
                    <Select
                      value={newTask.category}
                      onValueChange={(value) => setNewTask({ ...newTask, category: value })}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bedroom">🛏️ Bedroom</SelectItem>
                        <SelectItem value="kitchen">🍽️ Kitchen</SelectItem>
                        <SelectItem value="bathroom">🚿 Bathroom</SelectItem>
                        <SelectItem value="homework">📚 Homework</SelectItem>
                        <SelectItem value="general">✨ General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Describe what needs to be done..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-purple-400"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="coinValue" className="text-white font-medium">
                      Super Coins
                    </Label>
                    <Input
                      id="coinValue"
                      type="number"
                      value={newTask.coinValue}
                      onChange={(e) => setNewTask({ ...newTask, coinValue: Number.parseInt(e.target.value) })}
                      min="1"
                      max="100"
                      className="bg-white/10 border-white/20 text-white focus:border-purple-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="xpValue" className="text-white font-medium">
                      XP Points
                    </Label>
                    <Input
                      id="xpValue"
                      type="number"
                      value={newTask.xpValue}
                      onChange={(e) => setNewTask({ ...newTask, xpValue: Number.parseInt(e.target.value) })}
                      min="1"
                      max="200"
                      className="bg-white/10 border-white/20 text-white focus:border-purple-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recurrence" className="text-white font-medium">
                      Recurrence
                    </Label>
                    <Select
                      value={newTask.recurrence}
                      onValueChange={(value: "daily" | "weekly" | "monthly") =>
                        setNewTask({ ...newTask, recurrence: value })
                      }
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requiresApproval"
                      checked={newTask.requiresApproval}
                      onCheckedChange={(checked) => setNewTask({ ...newTask, requiresApproval: checked })}
                    />
                    <Label htmlFor="requiresApproval" className="text-white">
                      Requires Parent Approval
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="streakEligible"
                      checked={newTask.streakEligible}
                      onCheckedChange={(checked) => setNewTask({ ...newTask, streakEligible: checked })}
                    />
                    <Label htmlFor="streakEligible" className="text-white">
                      Counts Toward Streak
                    </Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    onClick={() => setIsCreating(false)}
                    className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-xl border border-white/20"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateTask}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Task
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <Card
                key={task.id}
                className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getCategoryEmoji(task.category)}</div>
                      <CardTitle className="text-lg text-white">{task.title}</CardTitle>
                    </div>
                    <div className="flex space-x-1">
                      <Button className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteTask(task.id)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-300 p-2 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-purple-200">{task.description}</p>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold">
                        🪙 {task.coinValue}
                      </Badge>
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                        ⭐ {task.xpValue} XP
                      </Badge>
                    </div>
                    <Badge className="bg-white/20 text-white border border-white/30 capitalize">
                      {task.recurrence}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-white/20 text-white border border-white/30 text-xs capitalize">
                      {task.category}
                    </Badge>
                    {task.requiresApproval && (
                      <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs">
                        Approval Required
                      </Badge>
                    )}
                    {task.streakEligible && (
                      <Badge className="bg-green-500/20 text-green-300 border border-green-400/30 text-xs">
                        Streak Eligible
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {tasks.length === 0 && (
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
              <CardContent className="text-center py-16">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No Tasks Created Yet</h3>
                <p className="text-purple-200 mb-6">Start creating epic adventures for your family!</p>
                <Button
                  onClick={() => setIsCreating(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Task
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
