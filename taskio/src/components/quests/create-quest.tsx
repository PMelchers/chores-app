"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Badge } from "../ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Label } from "../ui/label"
import { Plus, X, Star, Sword, Trophy, Target, Coins } from "lucide-react"
import { useQuests } from "../../hooks/useQuests"
import { useAuth } from "../providers/auth-provider"
import type { Quest, QuestObjective } from "../../firebase/database"

interface QuestFormData {
  title: string
  description: string
  difficulty: Quest['difficulty']
  category: Quest['category']
  coinReward: number
  xpReward: number
  bonusReward: string
  assignedTo: string
  dueDate: string
  objectives: Omit<QuestObjective, 'completed'>[]
}

export function CreateQuest() {
  const { createQuest } = useQuests()
  const { userRole } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<QuestFormData>({
    title: '',
    description: '',
    difficulty: 'easy',
    category: 'daily',
    coinReward: 50,
    xpReward: 25,
    bonusReward: '',
    assignedTo: '',
    dueDate: '',
    objectives: []
  })

  const [newObjective, setNewObjective] = useState({
    title: '',
    description: '',
    required: true
  })

  // Predefined quest templates for inspiration
  const questTemplates = [
    {
      title: "Homework Hero",
      description: "Complete all your homework assignments with excellence!",
      difficulty: 'medium' as const,
      category: 'daily' as const,
      coinReward: 75,
      xpReward: 50,
      objectives: [
        { id: crypto.randomUUID(), title: "Finish math homework", description: "Complete all exercises", required: true },
        { id: crypto.randomUUID(), title: "Read 30 minutes", description: "Any book you like", required: true },
        { id: crypto.randomUUID(), title: "Review notes", description: "Go over today's lessons", required: false }
      ]
    },
    {
      title: "Chore Champion",
      description: "Master your household responsibilities like a pro!",
      difficulty: 'easy' as const,
      category: 'weekly' as const,
      coinReward: 100,
      xpReward: 75,
      objectives: [
        { id: crypto.randomUUID(), title: "Clean your room", description: "Bed made, clothes put away", required: true },
        { id: crypto.randomUUID(), title: "Take out trash", description: "All bins emptied", required: true },
        { id: crypto.randomUUID(), title: "Help with dishes", description: "Load/unload dishwasher", required: true }
      ]
    },
    {
      title: "Epic Skills Challenge",
      description: "Learn something awesome and show off your new abilities!",
      difficulty: 'epic' as const,
      category: 'monthly' as const,
      coinReward: 300,
      xpReward: 200,
      bonusReward: "Choose your next family movie night!",
      objectives: [
        { id: crypto.randomUUID(), title: "Learn a new skill", description: "Drawing, coding, instrument, etc.", required: true },
        { id: crypto.randomUUID(), title: "Practice daily for 2 weeks", description: "At least 15 minutes per day", required: true },
        { id: crypto.randomUUID(), title: "Show off your progress", description: "Demonstrate what you learned", required: true },
        { id: crypto.randomUUID(), title: "Teach someone else", description: "Share your knowledge", required: false }
      ]
    }
  ]

  const addObjective = () => {
    if (newObjective.title.trim()) {
      setFormData(prev => ({
        ...prev,
        objectives: [...prev.objectives, {
          id: crypto.randomUUID(),
          ...newObjective
        }]
      }))
      setNewObjective({ title: '', description: '', required: true })
    }
  }

  const removeObjective = (id: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter(obj => obj.id !== id)
    }))
  }

  const useTemplate = (template: typeof questTemplates[0]) => {
    setFormData(prev => ({
      ...prev,
      title: template.title,
      description: template.description,
      difficulty: template.difficulty,
      category: template.category,
      coinReward: template.coinReward,
      xpReward: template.xpReward,
      bonusReward: template.bonusReward || '',
      objectives: template.objectives
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.objectives.length === 0) {
      alert('Please add at least one objective!')
      return
    }

    setLoading(true)
    try {
      const questId = await createQuest({
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        category: formData.category,
        coinReward: formData.coinReward,
        xpReward: formData.xpReward || undefined,
        bonusReward: formData.bonusReward || undefined,
        assignedTo: formData.assignedTo || undefined,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        objectives: formData.objectives
      })

      // Reset form
      setFormData({
        title: '',
        description: '',
        difficulty: 'easy',
        category: 'daily',
        coinReward: 50,
        xpReward: 25,
        bonusReward: '',
        assignedTo: '',
        dueDate: '',
        objectives: []
      })

      const message = formData.assignedTo 
        ? `Quest created and assigned to ${formData.assignedTo}! 🎮` 
        : 'Quest created successfully! Don\'t forget to assign it to a child. 🎮'
      alert(message)
    } catch (error) {
      console.error('Error creating quest:', error)
      alert(`Failed to create quest: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyIcon = (difficulty: Quest['difficulty']) => {
    switch (difficulty) {
      case 'easy': return <Star className="h-4 w-4 text-green-500" />
      case 'medium': return <Sword className="h-4 w-4 text-yellow-500" />
      case 'hard': return <Trophy className="h-4 w-4 text-orange-500" />
      case 'epic': return <Trophy className="h-4 w-4 text-red-500" />
      case 'legendary': return <Trophy className="h-4 w-4 text-purple-500" />
      default: return <Star className="h-4 w-4" />
    }
  }

  if (userRole !== 'parent') {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">Only parents can create quests.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Quest Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Quick Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {questTemplates.map((template, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer border-2 border-dashed border-gray-200 hover:border-blue-400" onClick={() => useTemplate(template)}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {getDifficultyIcon(template.difficulty)}
                    <h3 className="font-medium">{template.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline">{template.difficulty}</Badge>
                    <Badge variant="secondary">{template.category}</Badge>
                    <span className="flex items-center gap-1">
                      <Coins className="h-3 w-3" />
                      {template.coinReward}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Quest Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-500" />
            Create New Quest
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Quest Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Epic Adventure Quest"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assign To (Child Email)</Label>
                <Input
                  id="assignedTo"
                  type="email"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                  placeholder="child@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the quest and what your child will accomplish..."
                required
              />
            </div>

            {/* Quest Properties */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select value={formData.difficulty} onValueChange={(value: Quest['difficulty']) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                    <SelectItem value="epic">Epic</SelectItem>
                    <SelectItem value="legendary">Legendary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value: Quest['category']) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="special">Special</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coinReward">Coin Reward</Label>
                <Input
                  id="coinReward"
                  type="number"
                  min="1"
                  value={formData.coinReward}
                  onChange={(e) => setFormData(prev => ({ ...prev, coinReward: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="xpReward">XP Reward</Label>
                <Input
                  id="xpReward"
                  type="number"
                  min="0"
                  value={formData.xpReward}
                  onChange={(e) => setFormData(prev => ({ ...prev, xpReward: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            {/* Optional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bonusReward">Bonus Reward (Optional)</Label>
                <Input
                  id="bonusReward"
                  value={formData.bonusReward}
                  onChange={(e) => setFormData(prev => ({ ...prev, bonusReward: e.target.value }))}
                  placeholder="Extra screen time, special treat, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date (Optional)</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>

            {/* Objectives */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Label>Quest Objectives *</Label>
                <Badge variant="outline">{formData.objectives.length} objectives</Badge>
              </div>

              {/* Existing objectives */}
              {formData.objectives.length > 0 && (
                <div className="space-y-2">
                  {formData.objectives.map((objective) => (
                    <div key={objective.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{objective.title}</span>
                          {!objective.required && (
                            <Badge variant="outline" className="text-xs">Optional</Badge>
                          )}
                        </div>
                        {objective.description && (
                          <p className="text-sm text-gray-600 mt-1">{objective.description}</p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeObjective(objective.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new objective */}
              <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    value={newObjective.title}
                    onChange={(e) => setNewObjective(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Objective title..."
                  />
                  <Input
                    value={newObjective.description}
                    onChange={(e) => setNewObjective(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description (optional)..."
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newObjective.required}
                      onChange={(e) => setNewObjective(prev => ({ ...prev, required: e.target.checked }))}
                    />
                    <span className="text-sm">Required objective</span>
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addObjective}
                    disabled={!newObjective.title.trim()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Objective
                  </Button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={loading || !formData.title || !formData.description || formData.objectives.length === 0}
                className="px-8"
              >
                {loading ? 'Creating...' : 'Create Quest'} 🎮
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
