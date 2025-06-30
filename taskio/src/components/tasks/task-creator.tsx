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
import { Plus, Trash2, Edit } from "lucide-react"

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Task Management</h2>
          <p className="text-muted-foreground">Create and manage daily chores and recurring tasks</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Task
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Task</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="e.g., Make Bed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={newTask.category} onValueChange={(value) => setNewTask({ ...newTask, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bedroom">Bedroom</SelectItem>
                    <SelectItem value="kitchen">Kitchen</SelectItem>
                    <SelectItem value="bathroom">Bathroom</SelectItem>
                    <SelectItem value="homework">Homework</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Describe what needs to be done..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coinValue">Super Coins</Label>
                <Input
                  id="coinValue"
                  type="number"
                  value={newTask.coinValue}
                  onChange={(e) => setNewTask({ ...newTask, coinValue: Number.parseInt(e.target.value) })}
                  min="1"
                  max="100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="xpValue">XP Points</Label>
                <Input
                  id="xpValue"
                  type="number"
                  value={newTask.xpValue}
                  onChange={(e) => setNewTask({ ...newTask, xpValue: Number.parseInt(e.target.value) })}
                  min="1"
                  max="200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recurrence">Recurrence</Label>
                <Select
                  value={newTask.recurrence}
                  onValueChange={(value: "daily" | "weekly" | "monthly") =>
                    setNewTask({ ...newTask, recurrence: value })
                  }
                >
                  <SelectTrigger>
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
                <Label htmlFor="requiresApproval">Requires Parent Approval</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="streakEligible"
                  checked={newTask.streakEligible}
                  onCheckedChange={(checked) => setNewTask({ ...newTask, streakEligible: checked })}
                />
                <Label htmlFor="streakEligible">Counts Toward Streak</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTask}>Create Task</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{task.title}</CardTitle>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(task.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{task.description}</p>

              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Badge variant="secondary">🪙 {task.coinValue}</Badge>
                  <Badge variant="secondary">⭐ {task.xpValue} XP</Badge>
                </div>
                <Badge variant="outline">{task.recurrence}</Badge>
              </div>

              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs">
                  {task.category}
                </Badge>
                {task.requiresApproval && (
                  <Badge variant="outline" className="text-xs">
                    Approval Required
                  </Badge>
                )}
                {task.streakEligible && (
                  <Badge variant="outline" className="text-xs">
                    Streak Eligible
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
